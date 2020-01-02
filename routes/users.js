const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const passport = require('passport');

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

router.get('/data', isLoggedIn, (req,res) => {
    // const data = [];
    // req.user.groups.map(groupId => {
    //     getGroupData(groupId)
    //     .then(res => data.push(res))
    //     .catch(err => res.json({error:true}))
    // })
    // res.json(data);
})


// route to login user
router.post('/login', (req,res,next) => {
    console.log('loggin in')
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
        if(response === 1){
            res.send('Created Account');
        } else if(response === 0) {
            res.send('Username already exists');
        } else {
            res.send('There is an error with processing your request');
        }
    });
});

module.exports = router;