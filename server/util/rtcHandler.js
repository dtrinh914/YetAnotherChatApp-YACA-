const {redisSet, redisGet, redisDel} = require('./redisUtil');

module.exports = function (io, socket){
    socket.on('join_video', async (channelId,userId) => {
        const formattedId = 'video' + channelId;
        socket.join(formattedId);
        //check to see if video channel exists
        let res = await redisGet(formattedId);
        if(res){
            res = JSON.parse(res);
            //add userId to list of users
            res.push(userId);
        } else {
            res = [userId];   
        }
        await redisSet(formattedId, JSON.stringify(res));
        //send the new userlist to everyone in room
        io.in(formattedId).emit('client_list', JSON.stringify(res));
    });

    socket.on('leave_video', async (channelId, userId) => {
        const formattedId = 'video' + channelId;
        let res = await redisGet(formattedId);

        if(res){
            res = JSON.parse(res);
            //iterate through array removing the userId
            res = res.filter(id => id !== userId);

            //check if array is empty
            //insert if not empty, else delete
            if(res.length > 0){
                await redisSet(formattedId, JSON.stringify(res));
                socket.in(formattedId).emit('client_list', JSON.stringify(res));
            } else {
                await redisDel(formattedId);
            }
        }
    });
};