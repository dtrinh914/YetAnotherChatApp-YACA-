const app = require('./app');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const redisAdapter = require('socket.io-redis');
const {openConnection} = require('./util/mongoUtil');
const {REDIS_CONFIG} = require('./config/config');
const socketHandler = require('./util/socketHandler');

//connect socket-io to redis
io.adapter(redisAdapter({...REDIS_CONFIG}));

// open DB connection before starting server and socket listeners
openConnection()
.then( () =>{
    http.listen(5000, ()=> {
        console.log('Server has started');
    });
    socketHandler(io);
})
.catch(err => {
    console.log(err);
});

