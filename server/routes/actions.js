const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const passport = require('passport');
const {getInitData} = require('../util/mongoUtil');
const {redisSet} = require('../util/redisUtil');

// route to login user
router.post('/login', (req,res,next) => {
    passport.authenticate('local', (err, user, info) => {
        if(info) return res.json(info.message);
        if(err) return next(err);
        req.login(user, (err) => {
            if(err) return next(err);
            //update in redis that user is online
            redisSet(user._id.toString(), 'online');
            return res.json({loggedIn:true});
        })
    })(req,res,next);
});

// route to log out users
router.get('/logout', (req, res) => {
    req.logout();
    res.json({loggedIn:false});
});

// route to check is a user is logged in
router.get('/loggedon', (req,res) => {
    if(req.isAuthenticated()){
        res.json({loggedIn:true});
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
});

module.exports = router;