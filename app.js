const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const uuid = require('uuid/v4')
const redis = require('redis');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const {addUser, loginUser, findUserById} = require('./util/mongoUtil');

const redisStore = require('connect-redis')(session);
const redisClient = redis.createClient();
redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
});

// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
    (username, password, done) => {
        loginUser(username, password)
        .then( response => {
            if(response.verified){
                return done(null, response.user);
            } else if(response.verified === false) {
                return done(null, false, {message: 'Incorrect Password'});
            } else {
                return done(null, false, {message: "User Doesn't Exist"});
            }
        })
        .catch( err => done(err)); 
    }
));

//tell passport how to serialize user
passport.serializeUser((user,done) => {
    done(null, user._id);
});
passport.deserializeUser((id, done) => {
    findUserById(id)
    .then(user =>  {done(null, user)})
    .catch(error => done(error, false));
});

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

// isLoggedIn middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/')
    }
}

// index route serves client application build in react 
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// route to log out users
app.get('/api/users/logout', (req, res) => {
    req.logout();
    res.json({loggedIn:false});
})

// route to check is a user is logged in
app.get('/api/users/loggedon', (req,res) => {
    if(req.isAuthenticated()){
        res.json({loggedIn:true});
    } else {
        res.json({loggedIn:false});
    }
});


// route to login user
app.post('/api/users/login', (req,res,next) => {
    passport.authenticate('local', (err, user, info) => {
        if(info) return res.json(info.message);
        if(err) return next(err);
        req.login(user, (err) => {
            if(err) return next(err);
            return res.json({loggedIn:true});
        })
    })(req,res,next);
});

// route to add new user to database
app.post('/api/users/new', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    addUser(username, password).then( response =>{
        if(response === 1){
            res.send('Created Account');
        } else if(response === 0) {
            res.send('Username already exists');
        } else {
            res.send('There is an error with processing your request');
        }
    });
});

//catch all route
app.get('/*', (req,res) => {
    res.redirect('/');
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (message)=>{
        socket.broadcast.emit('chat message', message);
    });
});

http.listen(5000, ()=> {
    console.log('Server has started');
});

