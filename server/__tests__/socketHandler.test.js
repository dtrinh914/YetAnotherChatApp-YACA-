const {openConnection, getClient, addGroup, getGroupInfo, closeConnection} = require('../util/mongoUtil');
const ObjectId = require('mongodb').ObjectId;
const {redisSet, redisGet, clearRedis, closeRedis} = require('../util/redisUtil');
const socketHandler = require('../util/socketHandler');
const httpServer = require('http').createServer().listen();
const ioServer = require('socket.io')(httpServer);
const ioClient = require('socket.io-client');
const wait = require('wait-for-expect');

//mock config file to use test DB
jest.mock('../config/config');

//define client sockets for testing
let socket1, socket2, socket3, clients, testGroupId;

let httpServerAddr = httpServer.address();

//shortened variable name for testing purposes
let serverRooms = ioServer.sockets.adapter.rooms;

beforeAll(async () => {
    // opens connection to test DB
    await openConnection();

    //create test group and store id
    const response = await addGroup('test_group', 'test_description', new ObjectId());
    testGroupId = response.data[0]._id.toString();

    //apply socket listeners
    socketHandler(ioServer);
});

afterAll(async () =>{
    // gets DB clients and deletes test data 
    const client = getClient();
    await client.db('test').dropDatabase();

    //Closes Redis / DB connection
    await clearRedis();
    await closeRedis();
    await closeConnection();

    await ioServer.close();
    await httpServer.close();
});

beforeEach(()=>{
    const url = `http://[${httpServerAddr.address}]:${httpServerAddr.port}`;
    const settings = {
                        'reconnection delay': 0,
                        'reopen delay': 0,
                        'force new connection': true,
                        transports: ['websocket'],
                     };

    //create client socket
    socket1 = ioClient.connect(url, settings);
    socket2 = ioClient.connect(url, settings);
    socket3 = ioClient.connect(url, settings);
    clients = [socket1,socket2,socket3];
});

afterEach(() => {
    // Cleanup
    clients.forEach(socket => {
        if(socket.connected){
            socket.disconnect();
        }
    });
  });

test('should join and leave room properly', async ()=>{
    const [socket1, socket2] = clients;

    socket1.emit('join_room', 'test_room');
    await wait(()=>{
        //test room should exists with length of 1
        expect(serverRooms['test_room'].length).toBe(1);
    });

    socket2.emit('join_room', 'test_room');
    await wait(()=>{
        //length should now be 2
        expect(serverRooms['test_room'].length).toBe(2);
    });

    socket2.emit('leave_room', 'test_room');
    await wait(()=>{
        expect(serverRooms['test_room'].length).toBe(1);
    });

    socket1.emit('leave_room', 'test_room');
    await wait(()=>{
        //once all users have left rooms should be cleared
        expect(serverRooms['test_room']).toBeFalsy();
    });
});

test('should create room for user and store id in redis', async() =>{
    const [socket1] = clients;

    socket1.emit('user', 'test_id');

    await wait(async()=>{
        expect(serverRooms['test_id'].length).toBe(1);
    });

    //socketId and userId should be stored in redis
    const response = await redisGet('socket'+socket1.id);
    expect(response).toBe('test_id');
});

test('should emit update_pendinglist message to proper user', async()=>{
    const [socket1, socket2] = clients;
    // client will send message to server to create a room specific for each user
    socket1.emit('user', 'user1');
    socket2.emit('user', 'user2');

    //variable to check which socket received the message
    let received1 = 0;
    let received2 = 0;


    //increment corresponding variable when client receives message
    socket1.on('update_pendinglist', ()=>{
        received1++;
    });
    socket2.on('update_pendinglist', ()=>{
        received2++;
    });

    await wait(()=>{
        expect(serverRooms['user1']).toBeTruthy();
        expect(serverRooms['user2']).toBeTruthy();
    });

    //sends update_pendinglist message to server
    socket2.emit('update_pendinglist', 'user1');

    //only socket1 should receive message
    await wait(()=>{
        expect(received1).toBe(1);
        expect(received2).toBe(0);
    });
});

test('should tell users in a specific room to leave', async () =>{
    const [socket1] = clients;

    //create a user room for each client, have client join the the test room
    let num = 1;
    clients.forEach(socket =>{
        socket.emit('user', `user${num}`);
        socket.emit('join_room', 'test_room');

        //client event listener to see if the remove_group message 
        //has been sent to client from server
        socket.on('remove_group', (groupId)=>{
            socket.emit('leave_room', groupId);
        });

        num++;
    });

    await wait(()=>{
        expect(serverRooms['test_room'].length).toBe(3);
    });

    //client sends message to server that user2 and user3 should leave test_room
    socket1.emit('remove_users', ['user2','user3'], 'test_room');

    await wait(()=>{
        expect(serverRooms['test_room'].length).toBe(1);
    });
});

test('should send update_memberlist message to all clients in a room', async()=>{
    const [socket1, socket2, socket3] = clients;

    socket1.emit('join_room', 'test_room1');
    socket2.emit('join_room', 'test_room1');
    socket3.emit('join_room', 'test_room2');

    //variable to call at end to see which clients received message
    let result = 0;
 
    clients.forEach(socket =>{
        socket.on('update_memberlist', (groupId) => {
            if(groupId === 'test_room1'){
                result++;
            }
        });
    });

    await wait(()=>{
        expect(serverRooms['test_room1'].length).toBe(2);
        expect(serverRooms['test_room2'].length).toBe(1);
    });

    socket1.emit('update_memberlist', 'test_room1');

    await wait(()=>{
        expect(result).toBe(2);
    });
});

test('should send update_status message to clients in room', async () => {
    const [socket1, socket2, socket3] = clients;

    socket1.emit('join_room', 'test_room1');
    socket2.emit('join_room', 'test_room1');
    socket3.emit('join_room', 'test_room2');
     
    let result = 0;

    clients.forEach(socket => {
        socket.on('update_status', (groupId, userId, status) =>{
            if(groupId === 'test_room1' && userId === 'test_user' && status) result++;
        });
    });
    
    socket3.emit('update_status', 'test_room1', 'test_user', true);

    await wait(()=>{
        expect(result).toBe(2);
    });
});

test('should send update_group message to clients in room', async () => {
    const [socket1, socket2, socket3] = clients;

    socket1.emit('join_room', 'test_room1');
    socket2.emit('join_room', 'test_room1');
    socket3.emit('join_room', 'test_room2');

    let result = 0;

    clients.forEach(socket => { 
        socket.on('update_group', (groupId, description)=>{
            if(groupId === 'test_room1' && description === 'test_description') result++;
        });
    });

    socket3.emit('update_group', 'test_room1', 'test_description');

    await wait(()=>{
        expect(result).toBe(2);
    });
});

test('should store message in DB and send to clients in room', async() =>{
    const [socket1, socket2, socket3] = clients;

    socket1.emit('join_room', testGroupId);
    socket2.emit('join_room', testGroupId);
    socket3.emit('join_room', 'test_room2');

    let result = 0;

    clients.forEach(socket => {
        socket.on('message', (groupId, message) =>{
            if(groupId === testGroupId && message === 'test_message') result++;
        });
    });

    socket3.emit('message', testGroupId, 'test_message');

    await wait(()=>{
        expect(result).toBe(2);
    });


    //retrieve group information from DB
    const response = await getGroupInfo(testGroupId);
    const messages = response.data[0].messages;
    expect(messages.length).toBe(1);
});

test('should remove client from redis and send message to all rooms that the client is in to update the status of client', async() =>{
    //initialize user and join two rooms
    const [socket1, socket2] = clients;
    socket1.emit('user', 'user1');
    socket1.emit('join_room', 'room1');
    socket1.emit('join_room', 'room2');

    //2nd socket for testing
    socket2.emit('join_room', 'room1');
    socket2.emit('join_room', 'room2');

    let result = 0;
    socket2.on('update_status', ()=>{
        result++;
    });

    //create room for user
    await wait(()=>{
        expect(serverRooms['user1'].length).toBe(1);
    });
    
    //set key in redis 
    await redisSet('user1', 'true');
    let response = await redisGet('user1');
    //key should exists
    expect(response).toBeTruthy();

    //should store socket id and user id
    response = await redisGet('socket'+socket1.id);
    expect(response).toBe('user1');

    socket1.close();

    
    await wait(async()=>{
        //check if socket2 received message to update status
        expect(result).toBe(2);
    });

    //key should be deleted
    response = await redisGet('user1');
    expect(response).toBeFalsy();

    response = await redisGet('socket'+socket1.id);
    expect(response).toBeFalsy();
});

test('should send message to close_client', async() =>{
    const [socket1, socket2,socket3] = clients;

    socket1.emit('user', 'user1');
    socket2.emit('user', 'user1');

    let result = 0;
    socket2.on('close_client', ()=>{
        result++;
    });

    socket3.emit('close_client', 'user1');

    await wait(()=>{
        expect(result).toBe(1);
    });
});