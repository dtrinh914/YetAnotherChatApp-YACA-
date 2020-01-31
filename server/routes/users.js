const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const {addUser, findUserById, findUserByUsername, acceptGroupInvite, 
       declineGroupInvite} = require('../util/mongoUtil')

// route to add new user to database
router.post('/new', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    addUser(username, password).then( response =>{
        if(response.status === 1){
            res.json({data: 'Created Account', status: 1});
        } else if(response.status === 0) {
            res.json({data: 'Username already exists', status: 0});
        } else {
            res.json({data: 'There is an error with processing your request', status: -1});
        }
    });
});

//route to find user based on username
router.get('/search/:username', isLoggedIn, (req,res) => {
    const username = req.params.username
    findUserByUsername(username)
        .then( response => res.json(response))
        .catch((err) => res.json(err));
});

// route to get all of a users pending invites
router.get('/pendinginvites', isLoggedIn, (req,res) => {
    findUserById(req.user._id)
        .then(response => {
            if(response.status === 1){
                res.json({data:response.data.user.groupInvites, status: 1});
            } else {
                res.json(response);
            }
        })
        .catch((err) => res.json(err));
});

// route to accept group invitation
router.post('/pendinginvites/:id', isLoggedIn, (req,res) =>{
    const groupId = req.params.id;
    acceptGroupInvite(req.user._id, groupId)
        .then(response => res.json(response))
        .catch(err => res.json(err));
});

// route to decline group invitation
router.delete('/pendinginvites/:id', isLoggedIn, (req,res) =>{
    const groupId = req.params.id;
    declineGroupInvite(req.user._id, groupId)
        .then(response => res.json(response))
        .catch(err => res.json(err));
});

module.exports = router;