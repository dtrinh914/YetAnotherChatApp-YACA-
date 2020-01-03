const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users')
const groupRouter = require('./routes/groups');
const uuid = require('uuid/v4')
const passport = require('passport');
const session = require('express-session');
const {storeGroupMsg} = require('./util/mongoUtil');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const redisClient = redis.createClient();

redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
});

require('./util/pass')(passport);

// middleware configurations
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(
    session({
        genid: (req) => {
            return uuid();
        },
        store: new redisStore({host: 'localhost', port:6379, client: redisClient, ttl: 86700}),
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
    })
);
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/api/users', userRouter);
app.use('/api/groups', groupRouter);

//catch all route
app.get('/*', (req,res) => {
    res.redirect('/');
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    //Creates room specified by the client
    socket.on('room', (room) => {
        socket.join(room);
        console.log('a user has joined the room');
    });

    //Receives messages sent by client and broadcast messages to the specific room
    socket.on('message', (room, message) => {
        storeGroupMsg(room,message);
        socket.in(room).broadcast.emit('message', room, message);
    });
});

http.listen(5000, ()=> {
    console.log('Server has started');
});

