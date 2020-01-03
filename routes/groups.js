const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const {addGroup} = require('../util/mongoUtil');

// route to add a new group to the database
router.post('/new', isLoggedIn, (req,res) => {
    const newGroupName = req.body.newGroupName;
    addGroup(newGroupName, req.user._id).then( response => {
        if(response === 1){
            res.send('Created Group');
        } else if(response === 0) {
            res.send('A Group with that name already exists');
        } else {
            res.send('There is an error with processing your request');
        }
    });
});

module.exports = router;