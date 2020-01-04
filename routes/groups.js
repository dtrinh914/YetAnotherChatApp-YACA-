const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const {verifyGroupMember} = require('../middleware/groupsMiddleware')
const {addGroup} = require('../util/mongoUtil');

// route to add a new group to the database
router.post('/new', isLoggedIn, (req,res) => {
    const groupName = req.body.newGroupName.trim();
    addGroup(groupName, req.body.description, req.user._id).then( response => {
        res.json(response);
    });
});

// // route to add a new group member to the database
// router.post('/:id/members/', isLoggedIn, verifyGroupMember, (req,res) => {

// });

module.exports = router;