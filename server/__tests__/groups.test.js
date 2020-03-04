const request = require('supertest');
const {openConnection, getClient, addUser, addGroup, findUserByUsername, acceptGroupInvite, closeConnection} = require('../util/mongoUtil');
const {clearRedis, closeRedis} = require('../util/redisUtil');
const app = require('../app');

//mock config file to use test DB
jest.mock('../config/config');

let sessionCookie, seedGroupId, deleteGroupId, testUserId, anotherUserId, anotherUserSession;

beforeAll(async () => {
    // opens connection to test DB
    await openConnection();
    // creates a user
    await addUser('test_user', 'test_password');
    await addUser('another_user', 'another_password');

    //logs in the test_user and stores sessionCookie
    let response = await request(app)
                                .post('/api/actions/login')
                                .send({username:'test_user', password: 'test_password'});
    sessionCookie = response.header['set-cookie'];

    response = await request(app)
                                .post('/api/actions/login')
                                .send({username:'another_user', password: 'another_password'});
    anotherUserSession = response.header['set-cookie'];

    //retreives the test users ID and stores the value
    findUserByUsername('test_user').then(response =>{
        testUserId = response.data[0]._id;
        
        //creates a test group and stores group ID value
        addGroup('seed_group', 'a fake group', testUserId).then(response => {
            seedGroupId = response.data[0]._id;
         })

         addGroup('delete_group', 'a group to be deleted', testUserId).then(response => {
            deleteGroupId = response.data[0]._id;
         })
    });
    findUserByUsername('another_user').then(response =>{
        anotherUserId = response.data[0]._id;
    });
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

describe('POST /api/groups', ()=>{
    it.each`
        groupName                             | result
        ${'test_group'}                       | ${'"status":1'} 
        ${'   '}                              | ${'A group name cannot be an empty string.'}
        ${''}                                 | ${'A group name cannot be an empty string.'}
        ${'ab'}                               | ${'A group name cannot be shorter than 3 characters.'}
        ${'This is a really long group name'} | ${'A group name cannot be longer than 25 characters.'}
        ${'test_group'}                       | ${'The group already exists'}
    `('should contain $result when the groupName = $groupName', async({groupName, result}) => {
        const response = await request(app)
                                    .post('/api/groups')
                                    .set('Cookie', sessionCookie)
                                    .send({newGroupName:groupName})
        expect(response.text).toContain(result);
    });

    it('should return 302', async () => {
        const response = await request(app)
                                    .post('/api/groups');
        expect(response.status).toBe(302);
    });
});

describe('GET /api/groups/:id', () => {
    it('should contain "status":1', async ()=>{
        const response = await request(app)
                                    .get(`/api/groups/${seedGroupId}`)
                                    .set('Cookie', sessionCookie);
        expect(response.text).toContain('"status":1');
    });

    it('should contain "status":0', async()=>{
        const response = await request(app)
                                    .get('/api/groups/a123456789b123456789c123')
                                    .set('Cookie', sessionCookie);
        expect(response.text).toContain('"status":0');
    });

    it('should contain "status":-1', async()=>{
        const response = await request(app)
                                    .get('/api/groups/a123456789b12345678')
                                    .set('Cookie', sessionCookie);
        expect(response.text).toContain('"status":-1');
    });

    it('should return 302', async () => {
        const response = await request(app)
                                    .get(`/api/groups/${seedGroupId}`);
        expect(response.status).toBe(302);
    });
});

describe('PUT /api/groups/:id', ()=> {
    it('should return access denied', async ()=>{
        const response = await request(app)
                                    .put(`/api/groups/${seedGroupId}`)
                                    .set('Cookie', anotherUserSession)
                                    .send({groupDescription:'Updated group description.'});
        expect(response.text).toContain('Access denied.');
    });

    it('should return status:-1', async ()=>{
        const response = await request(app)
                                    .put(`/api/groups/notagroupid`)
                                    .set('Cookie', sessionCookie)
                                    .send({groupDescription:'Updated group description.'});
        expect(response.text).toContain('"status":-1');
    });
    
    it('should return status:1', async ()=>{
        const response = await request(app)
                                    .put(`/api/groups/${seedGroupId}`)
                                    .set('Cookie', sessionCookie)
                                    .send({groupDescription:'Updated group description.'});
        expect(response.text).toContain('"status":1');
    });
});


describe('DELETE /api/groups/:id', ()=> {
    it('should return access denied', async ()=>{
        const response = await request(app)
                                    .delete(`/api/groups/${deleteGroupId}`)
                                    .set('Cookie', anotherUserSession);
        expect(response.text).toContain('Access denied.');
    });

    it('should return status:-1', async ()=>{
        const response = await request(app)
                                    .delete(`/api/groups/notagroupid`)
                                    .set('Cookie', sessionCookie);
        expect(response.text).toContain('"status":-1');
    });
    
    it('should return status:1', async ()=>{
        const response = await request(app)
                                    .delete(`/api/groups/${deleteGroupId}`)
                                    .set('Cookie', sessionCookie);
        expect(response.text).toContain('"status":1');
    });
});

describe('GET /api/groups/:id/members', ()=>{
    it('should contain "status":1', async ()=>{
        const response = await request(app)
                                    .get(`/api/groups/${seedGroupId}/members`)
                                    .set('Cookie', sessionCookie);
        expect(response.text).toContain('"status":1');
    });

    it('should return 302', async () => {
        const response = await request(app)
                                    .get(`/api/groups/${seedGroupId}/members`);
        expect(response.status).toBe(302);
    });
});

describe('POST /api/groups/:id/members', () =>{
    it('should contain "status":1', async ()=>{
        const response = await request(app)
                                    .post(`/api/groups/${seedGroupId}/members`)
                                    .set('Cookie', sessionCookie)
                                    .send({userId: anotherUserId});
        expect(response.text).toContain('"status":1');
    });

    it('should contain "Invite already has been sent."', async ()=>{
        const response = await request(app)
                                    .post(`/api/groups/${seedGroupId}/members`)
                                    .set('Cookie', sessionCookie)
                                    .send({userId: anotherUserId});
        expect(response.text).toContain('"Invite already has been sent."');
    });

    it('should contain "User is already a member."', async ()=>{
        const response = await request(app)
                                    .post(`/api/groups/${seedGroupId}/members`)
                                    .set('Cookie', sessionCookie)
                                    .send({userId: testUserId});
        expect(response.text).toContain('"User is already a member."');
    });

    it('should return 302', async () => {
        const response = await request(app)
                                    .post(`/api/groups/${seedGroupId}/members`)
                                    .send({userId: anotherUserId});
        expect(response.status).toBe(302);
    });
});

describe('DELETE /api/groups/:id/members', () =>{
    it('should return access denied', async ()=>{
        const response = await request(app)
                                    .delete(`/api/groups/${seedGroupId}/members`)
                                    .set('Cookie', anotherUserSession)
                                    .send({userIds:[testUserId]});
        expect(response.text).toContain('Access denied.');
    });

    it('should return status:-1', async ()=>{
        const response = await request(app)
                                    .delete(`/api/groups/notagroupid/members`)
                                    .set('Cookie', sessionCookie)
                                    .send({userIds:[testUserId]});
        expect(response.text).toContain('"status":-1');
    });
    
    it('should return status:0', async ()=>{
        const response = await request(app)
                                    .delete(`/api/groups/${seedGroupId}/members`)
                                    .set('Cookie', sessionCookie)
                                    .send({userIds:[testUserId]});
        expect(response.text).toContain('"status":0');
    });

    it('should return status:1', async ()=>{
        //have another user join the group
        acceptGroupInvite(anotherUserId, seedGroupId);

        //delete another user from group
        const response = await request(app)
                                    .delete(`/api/groups/${seedGroupId}/members`)
                                    .set('Cookie', sessionCookie)
                                    .send({userIds:[anotherUserId]});
        expect(response.text).toContain('"status":1');
    });
});

describe('DELETE /api/groups/:id/members/leave', () =>{
    it('should return status:-1', async ()=>{
        const response = await request(app)
                                    .delete(`/api/groups/notagroupid/members/leave`)
                                    .set('Cookie', sessionCookie)
        expect(response.text).toContain('"status":-1');
    });
    
    it('should return status:0', async ()=>{
        const response = await request(app)
                                    .delete(`/api/groups/${seedGroupId}/members/leave`)
                                    .set('Cookie', sessionCookie)
        expect(response.text).toContain('"status":0');
    });

    it('should return status:1', async ()=>{
        //have another user join the group
        acceptGroupInvite(anotherUserId, seedGroupId);

        //delete another user from group
        const response = await request(app)
                                    .delete(`/api/groups/${seedGroupId}/members/leave`)
                                    .set('Cookie', anotherUserSession)
        expect(response.text).toContain('"status":1');
    });
});
