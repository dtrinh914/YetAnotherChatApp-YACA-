const ObjectId = require('mongodb').ObjectId;
const {getClient, errorHandler} = require('./connection');
const {DB} = require('../../config/config');
const {redisGet} = require('../redisUtil');


//add new group to the database
const addGroup =  async (groupName, description, userId) => {
    try{
        const client = getClient();
        const userCol = client.db(DB).collection('users');
        const groupCol = client.db(DB).collection('groups');

        const re = new RegExp('^'+groupName+'$', 'i');
        const groupExist = await groupCol.findOne({groupName:re});
                
        // returns 0 if group exists, inserts the new group data if it doesn't and returns 1
        if(groupExist){
            return {data:'The group already exists.',status: 0};
        } else {
        //insert group data into db
            const groupId = new ObjectId();
            await groupCol.insertOne({_id: groupId, 
                                        groupName:groupName, 
                                        description: description,
                                        messages:[], 
                                        activeMembers:[ObjectId(userId)],
                                        pendingMembers: [],
                                        pendingRequests: [],
                                        blocked:[],
                                        creator: ObjectId(userId),
                                        admins: [ObjectId(userId)]
                                    });
            await userCol.updateOne({_id:ObjectId(userId)}, {$push:{groups: groupId}})

            const response = await getGroupInfo(groupId);
            const groupData = response.data;
            
            return {data:groupData, status: 1};
        }
    } catch(err){
        errorHandler(err);
    }
}

//remove user from group
const removeMember = async (userId, groupId) => {
    try{
        const client = getClient();
        const userCol = client.db(DB).collection('users');
        const groupCol = client.db(DB).collection('groups');
        const userObjId = ObjectId(userId);
        const groupObjId = ObjectId(groupId);

        //remove groupID from user's list of groups
        await userCol.updateOne({_id:userObjId}, {$pull:{groups: groupObjId}});
        //remove userID from group list of active members
        await groupCol.updateOne({_id:groupObjId}, {$pull:{activeMembers: userObjId}})

        return {data:'Successfully removed member from group.' , status:1}
    } catch(err){
        errorHandler(err);
    }
}

const removeMembers = async (userIds, groupId) => {
    try{
        const client = getClient();
        const userCol = client.db(DB).collection('users');
        const groupCol = client.db(DB).collection('groups');

        const userObjIds = userIds.map(id => ObjectId(id));
        const groupObjId = ObjectId(groupId);

         //remove groupID from user's list of groups
         await userCol.updateMany({_id:{$in:userObjIds}}, {$pull:{groups: groupObjId}});
         //remove userID from group list of active members
         await groupCol.updateOne({_id:groupObjId}, {$pull:{activeMembers: {$in:userObjIds}}})
 
         return {data:'Successfully removed members from group.' , status:1}
    } catch(err){
        errorHandler(err);
    }
}

//add message to group
const storeGroupMsg = async (groupId, newMessage) => {
    try{
        const client = getClient();
        const groupCol = client.db(DB).collection('groups');

        await groupCol.updateOne({_id:ObjectId(groupId)}, {$push:{messages: newMessage}} );
        return 1;
    } catch(err){
        errorHandler(err);
    }   
}

//gets group info
const getGroupInfo = async (groupId) =>{
    try{
        const client = getClient();
        const groupCol = client.db(DB).collection('groups');

        const groupData = await groupCol.aggregate([  //retrieves info based on id
                                                    {$match: {_id: ObjectId(groupId)}},
                                                    //joins activeMembers field
                                                    {$lookup:{
                                                        from:'users',
                                                        let: {activeMembers:'$activeMembers'},
                                                        pipeline:[
                                                            {$match: {$expr:{$in:['$_id', '$$activeMembers']}}},
                                                            {$project: {_id: 1, 
                                                                        username:1}},
                                                            { '$addFields': {
                                                                'sort': {
                                                                    '$indexOfArray': [ '$$activeMembers', '$_id' ]
                                                                }
                                                            }},
                                                            { '$sort': { 'sort': 1 } },
                                                            { '$addFields': { 'sort': '$$REMOVE' }}
                                                        ],
                                                        as: 'activeMembers'
                                                    }},
                                                ]).toArray();
        if(groupData.length > 0){
            //retrieves online status of all members
            let currMembers = groupData[0].activeMembers;
            let count = 0;

            for(let member of currMembers){
                const res = await redisGet(member._id.toString());
                const status = res === 'online' ? true : false;
                currMembers[count] = {...member, online:status};
                count++;
            }

            return {data:groupData, status: 1}
        } else {
            return {data:"This group ID doesn't exist" ,status: 0}
        }
    }catch(err){
        errorHandler(err);
    }
}

//delete group
const deleteGroup = async (groupId) => {
    try{
        const client = getClient();
        const groupCol = client.db(DB).collection('groups');
        const userCol = client.db(DB).collection('users');
    
        const response = await groupCol.findOneAndDelete({_id:ObjectId(groupId)});
        const activeMemberIds = response.value.activeMembers.map(id => ObjectId(id));
        await userCol.updateMany({_id:{$in:activeMemberIds}}, {$pull: {groups:ObjectId(groupId)}});

        return {status:1};
    } catch(err){
        errorHandler(err);
    }
};

//update group
const updateGroup = async (groupId, groupDescription) => {
    try{
        const client = getClient();
        const groupCol = client.db(DB).collection('groups');
        await groupCol.updateOne({_id:ObjectId(groupId)}, {$set:{description: groupDescription}});
        return {status:1};
    } catch(err){
        errorHandler(err);
    }
};

//
// GROUP MIDDLEWARE FUNCTIONS
//

const isGroupMember = async (userId, groupId) => {
    try{
        const client = getClient();
        const groupCol = client.db(DB).collection('groups');

        const isMember = await groupCol.find({activeMembers:ObjectId(userId), _id: ObjectId(groupId)}).count();
        return isMember ? {status:1} : {status:0};
    } catch (err){
        errorHandler(err);
    }
}

const isAdmin = async (userId, groupId) => {
    try{
        const client = getClient();
        const groupCol = client.db(DB).collection('groups');

        const isAdmin = await groupCol.find({admins:ObjectId(userId), _id: ObjectId(groupId)}).count();
        return isAdmin ? {status:1} : {status:0};
    } catch (err){
        errorHandler(err);
    }
}

const isCreator = async (userId, groupId) => {
    try{
        const client = getClient();
        const groupCol = client.db(DB).collection('groups');

        const isCreator = await groupCol.find({creator:ObjectId(userId), _id: ObjectId(groupId)}).count();
        return isCreator ? {status:1} : {status:0};
    } catch (err){
        errorHandler(err);
    }
}

//
// INVITES/ADD FUNCTIONS
//

// send group invite to a user
const sendGroupInvite = async (userId, groupId) => {
    const userObjId = ObjectId(userId);
    const groupObjId = ObjectId(groupId);
    try{
        const client = getClient();
        const userCol = client.db(DB).collection('users');
        const groupCol = client.db(DB).collection('groups');

        //check if user is already a group member
        const isMember = await isGroupMember(userId, groupId);
        if(isMember.status === 1){
            return {data:'User is already a member.',status:0}
        }
        //check to see if user already has the group invite
        const hasInvite = await hasGroupInvite(userObjId,groupObjId);
        if(hasInvite){
            return {data:'Invite already has been sent.',status:0}
        }
        //add group invite to user data
        await userCol.updateOne({_id:userObjId}, {$push:{groupInvites: groupObjId}});
        //add user invite to group pending list
        await groupCol.updateOne({_id:groupObjId}, {$push:{pendingMembers:userObjId}});
        
        return {data:'Invite sent.', status: 1};
    } catch(err){
        errorHandler(err);
    }
}

// accept group invite
const acceptGroupInvite = async (userId, groupId) =>{
    const userObjId = ObjectId(userId);
    const groupObjId = ObjectId(groupId);
    try{
        const client = getClient();
        const userCol = client.db(DB).collection('users');
        const groupCol = client.db(DB).collection('groups');

        //check if user has a pending group invite
        const hasInvite = await hasGroupInvite(userObjId,groupObjId);
        if(hasInvite){
            //add groupID to list of user's groups & remove groupID from user's list of pending invites
            await userCol.updateOne({_id:userObjId}, {$push:{groups: groupObjId}, 
                                                      $pull:{groupInvites: groupObjId}});
            await groupCol.updateOne({_id:groupObjId}, {$push:{activeMembers: userObjId}, 
                                                          $pull:{pendingMembers: userObjId}})
            return {data: 'Successfully added user to the group.', status: 1};
        } else {
            return {data:'The group invite for this user does not exist', status: 0};
        }
    } catch(err){
        errorHandler(err);
    }
}
// decline group invite
const declineGroupInvite = async (userId, groupId) =>{
    const userObjId = ObjectId(userId);
    const groupObjId = ObjectId(groupId);
    try{
        const client = getClient();
        const userCol = client.db(DB).collection('users');
        const groupCol = client.db(DB).collection('groups');

        //check if user has a pending group invite
        const hasInvite = await hasGroupInvite(userObjId,groupObjId);
        if(hasInvite){
            //remove groupID from user's list of pending invites
            await userCol.updateOne({_id:userObjId}, {$pull:{groupInvites: groupObjId}});
            //remove userID from group list of pending members
            await groupCol.updateOne({_id:groupObjId}, {$pull:{pendingMembers: userObjId}})
            return {data: 'Successfully declined invite.', status: 1};
        } else {
            return {data:'The group invite for this user does not exist', status: 0};
        }
    } catch(err){
        errorHandler(err);
    }
}


//check if user has a pending group invite
const hasGroupInvite = async (userObjId, groupObjId) => {
    try{
        const client = getClient();
        const userCol = client.db(DB).collection('users');
        const groupCol = client.db(DB).collection('groups');
        
        const hasInvite = await userCol.find({_id:userObjId, groupInvites:groupObjId}).count();
        const isPendingMember = await groupCol.find({_id:groupObjId, pendingMembers:userObjId}).count();
        // returns 1 if user has invite and 0 if the user does not have invite
        return hasInvite && isPendingMember;
    } catch(err){
        errorHandler(err);
    }
}

module.exports = {addGroup, storeGroupMsg, getGroupInfo, deleteGroup,
                  updateGroup, removeMember, removeMembers,
                  isGroupMember, isAdmin, isCreator,
                  sendGroupInvite, acceptGroupInvite, declineGroupInvite}