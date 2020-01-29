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

require('./util/pass')(passport);

// middleware configurations
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(
    session({
        genid: (req) => {
            return uuid();
        },
        store: appRedisStore,
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
    })
);
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

