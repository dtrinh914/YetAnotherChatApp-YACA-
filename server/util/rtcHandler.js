const {redisSet, redisGet, redisDel} = require('./redisUtil');

module.exports = function (io, socket){
    socket.on('join_video', async (channelId,userId) => {
        try{
            const formattedId = 'video' + channelId;
            socket.join(formattedId);
            //check to see if video channel exists
            let res = await redisGet(formattedId);
            if(res){
                res = JSON.parse(res);

                //check if maximum number of clients in room
                if(res.length === 4){
                    //send message to user
                    socket.emit('client_list', false);
                    //exit out early
                    return;
                }            
                //add userId to list of users
                res.push(userId);
            } else {
                res = [userId];   
            }
            await redisSet(formattedId, JSON.stringify(res));

            //send the new userlist to everyone in room
            io.in(formattedId).emit('client_list', JSON.stringify(res));
        } catch(e){
            console.log(e);
        }
    });

    socket.on('leave_video', async (channelId, userId) => {
        try{
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
        } catch(e){
            console.log(e);
        }
    });


    //RTC signaling
    socket.on('send_offer', (to, from, offer) => {
        socket.in(to).emit('receive_offer', from, offer);
    });

    socket.on('send_answer', (to, from, answer) => {
        socket.in(to).emit('receive_answer', from, answer);
    });

    socket.on('send_candidate', (to, from, candidate) => {
        socket.in(to).emit('receive_candidate', from, candidate);
    });


    //used to keep video tools state in sync between users
    socket.on('update_counters', (channelId, state) => {
        socket.in(channelId).emit('update_counters', state);
    });

    socket.on('get_counters', (to,from)=>{
        socket.in(to).emit('get_counters', from);
    });

    socket.on('send_counters', (to, state)=>{
        socket.in(to).emit('update_counters', state);
    });

    socket.on('share_card', (to, url) => {
        socket.in(to).emit('get_card', url);
    });
};