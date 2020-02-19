const request = require('supertest');
const {openConnection, getClient, addUser,findUserByUsername, addGroup, removeMember, 
       sendGroupInvite, declineGroupInvite, closeConnection} = require('../util/mongoUtil');
const {clearRedis, closeRedis} = require('../util/redisUtil');
const app = require('../app');

//mock config file to use test DB
jest.mock('../config/config')

let sessionCookie, testUserId, anotherUserId, testGroupId;

beforeAll(async () => {
    // opens connection to test DB
    await openConnection();
    // creates two test users
    await addUser('test_user', 'test_password');
    await addUser('another_user', 'another_password');
    
    //logs in the test_user and stores sessionCookie
    let response = await request(app)
                                .post('/api/actions/login')
                                .send({username:'test_user', password: 'test_password'});
    sessionCookie = response.header['set-cookie'];
    
    //retreives the test users ID and stores the value
    findUserByUsername('test_user').then(response =>{
        testUserId = response.data[0]._id;
    });
    findUserByUsername('another_user').then(response =>{
        anotherUserId = response.data[0]._id;
    });
    
    //creates a test group and stores group ID value
    addGroup('test_group', 'a fake group', anotherUserId).then(response => {
        testGroupId = response.data[0]._id;
    })
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

describe('/api/users/new', () =>{
    const errorStatus = '{"data":"There is an error with processing your request","status":-1}';

    it.each` 
        username       | password           | result
        ${'test_user'} | ${'test_password'} | ${'{"data":"Username already exists","status":0}'}
        ${'new_user'}  | ${'new_password'}  | ${'{"data":"Created Account","status":1}'}
        ${'new_user'}  | ${''}              | ${errorStatus}
        ${''}          | ${'new_password'}  | ${errorStatus}
        ${''}          | ${''}              | ${errorStatus}
        ${'   '}       | ${'   '}           | ${errorStatus}
    `('should return $result when username = $username and password = $password', async({username, password, result}) => {
        const response = await request(app)
                                    .post('/api/users/new')
                                    .send({username: username, password: password});
        expect(response.text).toBe(result);
    });
});

describe('/api/users/search/:username', () =>{
    it.each`
        username       | result
        ${'test_user'} | ${'"status":1'}
        ${''}          | ${"Found. Redirecting to /"}
        ${'  '}        | ${"Found. Redirecting to /"}
        ${'wrong_user'}| ${'"status":0'}
    `('should return $result when username = $username', async({username,result}) => {
        const response = await request(app)
                                    .get(`/api/users/search/${username}`)
                                    .set('Cookie', sessionCookie)
        expect(response.text).toContain(result);
    });

    it('should return 302', async () => {
        const response = await request(app)
                                    .get('/api/users/search/test_user');
        expect(response.status).toBe(302);
    });
});

describe('/api/users/pendinginvites', ()=>{
    it('should return status:1', async() => {
        const response = await request(app)
                                    .get('/api/users/pendinginvites')
                                    .set('Cookie', sessionCookie)
        expect(response.text).toContain('"status":1');
    });

    it('should return 302', async () => {
        const response = await request(app)
                                    .get('/api/users/pendinginvites');
        expect(response.status).toBe(302);
    });
});

describe('/api/users/pendinginvites/:id', () => {
    it('should return "Successfully added user to the group."', async() =>{
        //add a group invite to DB
        await sendGroupInvite(testUserId, testGroupId);

        //check route response
        const response = await request(app)
                                    .post(`/api/users/pendinginvites/${testGroupId}`)
                                    .set('Cookie', sessionCookie);
        //remove testUser from group in DB
        await removeMember(testUserId, testGroupId);

        expect(response.text).toContain('"Successfully added user to the group."')
    });

    it('should return "The group invite for this user does not exist"', async()=>{
        const response = await request(app)
                                    .post(`/api/users/pendinginvites/${testGroupId}`)
                                    .set('Cookie', sessionCookie);
        expect(response.text).toContain('"The group invite for this user does not exist"');
    })

    it('should return "Successfully declined invite."', async() =>{
        await sendGroupInvite(testUserId, testGroupId);

        const response = await request(app)
                                    .delete(`/api/users/pendinginvites/${testGroupId}`)
                                    .set('Cookie', sessionCookie);

        await declineGroupInvite(testUserId, testGroupId);

        expect(response.text).toContain('"Successfully declined invite."');
    });

    it('should return "The group invite for this user does not exist"', async() =>{
        const response = await request(app)
                                    .delete(`/api/users/pendinginvites/${testGroupId}`)
                                    .set('Cookie', sessionCookie);

        await declineGroupInvite(testUserId, testGroupId);

        expect(response.text).toContain('"The group invite for this user does not exist"');
    });

    it('should return 302', async () => {
        const response = await request(app)
                                    .post(`/api/users/pendinginvites/${testGroupId}`);
        expect(response.status).toBe(302);
    });
    it('should return 302', async () => {
        const response = await request(app)
                                    .delete(`/api/users/pendinginvites/${testGroupId}`);
        expect(response.status).toBe(302);
    });
});

