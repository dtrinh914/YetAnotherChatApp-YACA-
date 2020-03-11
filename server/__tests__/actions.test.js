const request = require('supertest');
const {openConnection, getClient, addUser, findUserByUsername, closeConnection} = require('../util/mongoUtil');
const {redisGet, clearRedis, closeRedis} = require('../util/redisUtil');
const app = require('../app');

//mock config file to use test DB
jest.mock('../config/config')

let testId;

beforeAll(async () => {
    // opens connection to test DB
    await openConnection();
    // creates a user
    await addUser('test_user', 'test_password');

    let response = await findUserByUsername('test_user');
    testId = response.data[0]._id;
});

afterAll(async () =>{
    // gets DB clients and deletes test data 
    const client = getClient();
    await client.db('test').dropDatabase();

    //Closes Redis / DB connection
    await clearRedis();
    await closeRedis();
    await closeConnection();
});

describe('/api/actions/login', () => {
    it.each` 
        username       | password           | result
        ${'test_user'} | ${'test_password'} | ${'{"loggedIn":true}'}
        ${''}          | ${''}              | ${'"Missing credentials"'}
        ${'test_user'} | ${''}              | ${'"Missing credentials"'}
        ${''}          | ${'test_password'} | ${'"Missing credentials"'}
        ${'test_user'} | ${'wrong_password'}| ${'"Incorrect Password"'}
        ${'wrong_user'}| ${'test_password'} | ${'"User Doesn\'t Exist"'}
    `('should return $result when username = $username and password = $password', async({username, password, result}) => {
        const response = await request(app)
            .post('/api/actions/login')
            .send({username: username, password: password});
        expect(response.text).toBe(result);

        if(username === 'test_user' && password === 'test_password'){
            expect(response.header['set-cookie'][0]).toContain('connect.sid=')
        }
    });

    it('should have user status online in redis', async () => {
        const response = await redisGet(testId.toString());
        expect(response).toBe('online');
    })
});

describe('/api/actions/logout', () => {
    it('returns {"loggedIn":false}', async() => {
        const response = await request(app).get('/api/actions/logout');
        expect(response.text).toBe('{"loggedIn":false}');
    });
});

describe('/api/actions/loggedon',() => {
    it('returns {"loggedIn":true}', async() => {
        //login test_user and store session cookie
        let response = await request(app)
                                .post('/api/actions/login')
                                .send({username:'test_user', password: 'test_password'});
        const cookie = response.header['set-cookie'];

        //send get request with session cookie
        response = await request(app)
                            .get('/api/actions/loggedon')
                            .set('Cookie', cookie);
        expect(response.text).toBe('{"loggedIn":true}')
    });
    it('returns {"loggedIn":false}', async() => {
        const response = await request(app).get('/api/actions/loggedon');
        expect(response.text).toBe('{"loggedIn":false}');
    });
});

describe('/api/actions/data', () =>{
    it('returns user data', async()=>{
        //login test_user and store session cookie
        let response = await request(app)
                                .post('/api/actions/login')
                                .send({username:'test_user', password: 'test_password'});
        const cookie = response.header['set-cookie'];

        //send get request with session cookie
        response = await request(app)
                            .get('/api/actions/data')
                            .set('Cookie', cookie);
        expect(response.text).toContain('"username":"test_user"')
    });

    it('returns 302', async() => {
        const response = await request(app)
                                    .get('/api/actions/data')
        expect(response.status).toBe(302)
    });
});