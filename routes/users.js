const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const passport = require('passport');
const {addUser, getInitData, findUserByUsername} = require('../util/mongoUtil')

// route to log out users
router.get('/logout', (req, res) => {
    req.logout();
    res.json({loggedIn:false});
})

// route to check is a user is logged in
router.get('/loggedon', (req,res) => {
    if(req.isAuthenticated()){
        res.json({loggedIn:true, username:req.user.username});
    } else {
        res.json({loggedIn:false});
    }
});

// route to get all of users groups and messages
router.get('/data', isLoggedIn, (req,res) => {
    getInitData(req.user._id).then(response => {
        if(response.status === 1){
            res.json(response.data);
        } else {
            res.send('There is an error with processing your request');
        }
    })
})


// route to login user
router.post('/login', (req,res,next) => {
    passport.authenticate('local', (err, user, info) => {
        if(info) return res.json(info.message);
        if(err) return next(err);
        req.login(user, (err) => {
            if(err) return next(err);
            return res.json({loggedIn:true, username:req.user.username});
        })
    })(req,res,next);
});

// route to add new user to database
router.post('/new', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    addUser(username, password).then( response =>{
        if(response.status === 1){
            res.send('Created Account');
        } else if(response.status === 0) {
            res.send('Username already exists');
        } else {
            res.send('There is an error with processing your request');
        }
    });
});

//route to find user based on username
router.get('/search', isLoggedIn, (req,res) => {
    findUserByUsername(req.body.username)
    .then( (data) => {
        res.json(data);
    })
    .catch((err) => {
        console.log(err);
    })
});

module.exports = router;