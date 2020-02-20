const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const {verifyGroupMember, verifyCreator} = require('../middleware/groupsMiddleware')
const {addGroup, getGroupInfo, sendGroupInvite, deleteGroup, updateGroup, removeMembers} = require('../util/mongoUtil');

// route to add a new group to the database
router.post('/', isLoggedIn, (req,res) => {
    const groupName = req.body.newGroupName.trim();

    //check if groupName is empty string
    if(groupName === '') res.json({data: 'A group name cannot be an empty string.', status: 0})
    else{
        addGroup(groupName, req.body.description, req.user._id)
            .then( response => res.json(response))
            .catch( err => res.json(err));
    }
   
});

//route to get a specific group info
router.get('/:id', isLoggedIn, (req,res) => {
    const groupId = req.params.id; 
    getGroupInfo(groupId)
        .then(response => res.json(response))
        .catch(err => res.json(err));
});

//route to edit specific group description
router.put('/:id', isLoggedIn, verifyCreator, (req,res) => {
    const groupId = req.params.id;
    const groupDescription = req.body.groupDescription;

    updateGroup(groupId, groupDescription)
        .then( response => res.json(response))
        .catch(err => res.json(err));
});

//route to delete a specific group
router.delete('/:id', isLoggedIn, verifyCreator, (req,res) => {
    const groupId = req.params.id;
    deleteGroup(groupId)
        .then(response => res.json(response))
        .catch(err => res.json(err));
});

// route to get all members of a group
router.get('/:id/members', isLoggedIn, verifyGroupMember, (req,res) => {
    const groupId = req.params.id;
    getGroupInfo(groupId)
        .then(response => {
            if(response.status === 1){
                const {activeMembers, pendingMembers, pendingRequests, blocked} = response.data[0];
                res.json({data:{activeMembers: activeMembers, 
                          pendingMembers: pendingMembers,
                          pendingRequests: pendingRequests,
                          blocked: blocked},
                          status:1})
            } else {
                res.json(response)
            }
        })
        .catch(err => res.json(err));
});

// route to invite member to a group
router.post('/:id/members', isLoggedIn, verifyGroupMember, (req,res) => {
    const userId = req.body.userId;
    const groupId = req.params.id;
    sendGroupInvite(userId, groupId)
        .then(response => res.json(response))
        .catch(err => res.json(err));
});

// route to remove members from a group
router.delete('/:id/members', isLoggedIn, verifyCreator, (req,res) => {
    const userIds = req.body.userIds;
    const groupId = req.params.id;

    //check if the creator id is within the array 
    function creatorInArray(ids, user){
        for(let i = 0; i < ids.length; i++){
            //need to type coerce ids because of mongo ObjectId wrapper
            if(ids[i] == user) return true;
        }
        return false;
    };

    if(creatorInArray(userIds, req.user._id)){
        res.json({data:'The group creator cannot be removed from the group.',status:0})
    } else {
        removeMembers(userIds, groupId)
            .then(response => res.json(response))
            .catch(err => res.json(err));
    }
});

module.exports = router;