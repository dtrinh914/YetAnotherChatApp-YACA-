const {redisSet, redisGet, redisDel, clearRedis, closeRedis} = require('../util/redisUtil');
const httpServer = require('http').createServer().listen();
const ioServer = require('socket.io')(httpServer);
const ioClient = require('socket.io-client');
const wait = require('wait-for-expect');
const rtcHandler = require('../util/rtcHandler');

//mock config file to use test DB
jest.mock('../config/config');

//define client sockets for testing
let socket1, socket2, socket3, clients;

let httpServerAddr = httpServer.address();

beforeAll(async () => {
    //apply socket listeners
    ioServer.on('connection', socket => {
        rtcHandler(ioServer, socket);
    });
});

afterAll(async () =>{
    //Closes Redis / DB connection
    await clearRedis();
    await closeRedis();
     
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

test('should have user join room and receive client list', async () =>{
    //store message received by client1
    let clientMsgs = [];

    socket1.on('client_list', (list) =>{
        clientMsgs.push(JSON.parse(list));
    });
    
    //client sends join video msg to server
    socket1.emit('join_video', 'test_channel', 'test_user1');
    
    //should receive msg on client side
    await wait(()=>{
        expect(clientMsgs.length).toBe(1);
        expect(clientMsgs[0].includes('test_user1')).toBe(true);
    });

    //server should store client list in redis
    let clientList = await redisGet('videotest_channel');
    clientList = JSON.parse(clientList);
    expect(clientList.length).toBe(1);
    expect(clientList.includes('test_user1')).toBe(true);

    //another client joins video channel
    socket2.emit('join_video', 'test_channel', 'test_user2');

    //server should send another message to client1 with new client list
    await wait(()=>{
        expect(clientMsgs.length).toBe(2);
        expect(clientMsgs[1].includes('test_user2')).toBe(true);
    });

    //client list in redis should update
    clientList = await redisGet('videotest_channel');
    clientList = JSON.parse(clientList);
    expect(clientList.length).toBe(2);
    expect(clientList.includes('test_user2')).toBe(true);
});

test('user should not be able to join full room', async()=>{
    //create a full room
    const fullClientList = ['test_user1', 'test_user2', 'test_user3', 'test_user4'];
    await redisSet('videotest_channel', JSON.stringify(fullClientList));

    let clientMsgs = [];
    socket1.on('client_list', list => {
        clientMsgs.push(JSON.parse(list));
    });

    //user shouldn't be able to join full room
    socket1.emit('join_video', 'test_channel', 'test_user');
    await wait(()=>{
        expect(clientMsgs.length).toBe(1);
        expect(clientMsgs[0]).toBe(false);
    });

    await redisDel('videotest_channel');
});

test('users should leave room and update client list', async()=>{
    let clientMsgs = [];
    socket1.on('client_list', list => {
        clientMsgs.push(JSON.parse(list));
    });

    //two clients join video room
    socket1.emit('join_video', 'test_channel', 'test_user1');
    socket2.emit('join_video', 'test_channel', 'test_user2');
    
    //one client leaves
    socket2.emit('leave_video', 'test_channel', 'test_user2');

    //client 1 should receive three clients list updates
    //most current update should only include one client
    await wait(()=>{
        expect(clientMsgs.length).toBe(3);
        expect(clientMsgs[2].length).toBe(1);
        expect(clientMsgs[2].includes('test_user1')).toBe(true);
    });

    //redis should also update client list to reflect that change
    let clientList = await redisGet('videotest_channel');
    clientList = JSON.parse(clientList);
    expect(clientList.length).toBe(1);
    expect(clientList.includes('test_user1')).toBe(true);

    socket1.emit('leave_video', 'test_channel', 'test_user1');
    await wait(async ()=>{
        //when last user leaves, the channel info should be cleared from redis
        clientList = await redisGet('videotest_channel');
        expect(clientList).toBe(null);
    });
});