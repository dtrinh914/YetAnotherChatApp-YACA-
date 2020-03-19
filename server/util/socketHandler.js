const {redisSet, redisGet, redisDel} = require('./redisUtil');
const {storeGroupMsg} = require('./mongoUtil');

module.exports = function(io){
    io.on('connection', (socket) => {
        //joins room specified by the client
        socket.on('join_room', (room) => {
            socket.join(room);
        });

        //leave room specified by the client
        socket.on('leave_room', (room) => {
            socket.leave(room);
        });
    
        //creates a room specific for each user
        socket.on('user', async (userId) => {
            await redisSet('socket'+ socket.id, userId);
            socket.join(userId);
        })
    
        //tells a specific user to update their pending invite list
        socket.on('update_pendinglist', (userId) => {
            socket.in(userId).emit('update_pendinglist');
        });

        //tells a set of users to leave the group
        socket.on('remove_users', (userIds, groupId) => {
            userIds.forEach(id =>{
                socket.in(id).emit('remove_group', groupId)
            });
        });
    
        //receives msg from client to update a group's member list
        //and sends msg to all client in a group to update their member list
        socket.on('update_memberlist', (groupId) => {
            io.in(groupId).emit('update_memberlist', groupId);
        });

        socket.on('update_status', (groupId, userId, status) =>{
            socket.in(groupId).broadcast.emit('update_status', groupId, userId, status);
        });

        socket.on('update_group', (groupId, groupDescription) => {
            socket.in(groupId).broadcast.emit('update_group', groupId, groupDescription);
        });

        //broadcast to clients in group and then leaves group channel
        socket.on('remove_group', (groupId) => {
            socket.in(groupId).broadcast.emit('remove_group', groupId);
            socket.leave(groupId); 
        });
    
        //Receives messages sent by client and broadcast messages to the specific room
        socket.on('message', async (room, message) => {
            await storeGroupMsg(room,message);
            socket.in(room).broadcast.emit('message', room, message);
        });
        
        //broadcast to client to close their connection
        socket.on('disconnecting', async () => {
            //remove user Id from redis cache;
            const rooms = socket.rooms;
            const userId = await redisGet('socket'+socket.id);

            //check to see if the user is connected on other clients
            if(userId && !io.sockets.adapter.rooms[userId]){
                for(let key in rooms){
                    if(key === socket.id || key === userId) continue;
                    io.in(key).emit('update_status', key, userId, false);
                }

                await redisDel(userId);
            }

            await redisDel('socket'+socket.id);
        });

        //when user logs out, send message to all other sources that user is logged into
        socket.on('close_client', async(userId)=>{
            socket.in(userId).broadcast.emit('close_client');
        });
    });
};