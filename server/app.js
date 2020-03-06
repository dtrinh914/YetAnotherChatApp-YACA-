const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const app = express();
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users')
const groupRouter = require('./routes/groups');
const actionRouter = require('./routes/actions');
const uuid = require('uuid/v4')
const passport = require('passport');
const session = require('express-session');
const {appRedisStore} = require('./util/redisUtil');
const {SESSION_SECRET} = require('./config/config');

require('./util/pass')(passport);

// middleware configurations
let sess = {
    genid: (req) => {
        return uuid();
    },
    store: appRedisStore,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1)
    sess.cookie.secure = true 
}

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/api/actions', actionRouter);
app.use('/api/groups', groupRouter);
app.use('/api/users', userRouter);


//catch all route
app.get('/*', (req,res) => {
    res.redirect('/');
})

module.exports = app;

