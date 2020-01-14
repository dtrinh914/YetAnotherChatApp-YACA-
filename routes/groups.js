const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const {verifyGroupMember} = require('../middleware/groupsMiddleware')
const {addGroup, getGroupInfo, sendGroupInvite} = require('../util/mongoUtil');

// route to add a new group to the database
router.post('/', isLoggedIn, (req,res) => {
    const groupName = req.body.newGroupName.trim();
    addGroup(groupName, req.body.description, req.user._id)
        .then( response => res.json(response))
        .catch( err => res.json(err));
});

//route to get a specific group info
router.get('/:id', isLoggedIn, (req,res) => {
    const groupId = req.params.id; 
    console.log('works');
    getGroupInfo(groupId)
        .then(response => res.json(response))
        .catch(err => res.json(err));
});

// route to invite member to a group
router.post('/:id/members', isLoggedIn, verifyGroupMember, (req,res) => {
    const userId = req.body.userId;
    const groupId = req.params.id;
    sendGroupInvite(userId, groupId).then(response => res.json(response));
});

module.exports = router;