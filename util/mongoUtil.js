const bcrypt = require('bcrypt');

//Set up MongoClient
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const {MONGO_DB_URI} = require('../config/config');
const client = new MongoClient(MONGO_DB_URI, {poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true });

//variables for different collections
let userCol;
let groupCol;

//Opens connection to database
client.connect()
    .then( ()=> {
        console.log('Connected to database . . . ');
        const db = client.db('chat_app');
        userCol = db.collection('users');
        groupCol = db.collection('groups');
    })
    .catch( err => {
        console.log(err);
});

//
// USER FUNCTIONS
//

const addUser = async (username, password) =>{
    try{
        // connects to proper connection and tests to see if user name exists
        const usernameExist = await userCol.findOne({username:username});
        
        // returns 0 if user exists, inserts the new user data if it doesn't and returns 1
        if(usernameExist){
            return {status: 0};
        } else {
        //salt and hash password before inserting into db
            const saltRounds = 10;
            const hash = await bcrypt.hash(password, saltRounds);
            await userCol.insertOne({username:username, 
                                     password: hash, 
                                     groups:[], 
                                     friends:[], 
                                     groupInvites:[],
                                     friendInvites:[],
                                     blocked:[]});
            return {status: 1};
        }
    } catch(err){
        errorHandler(err)
    }
}

const loginUser = async (username, password) => {
    const user = await userCol.findOne({username:username});
    if(user){
        const verified = await bcrypt.compare(password,user.password);
        return {user: user, verified: verified};
    } else {
    //if user doesn't exist return 0
        return {verifed: undefined};
    }
}

const findUserById = async (id) => {
    const user = await userCol.findOne({_id: ObjectId(id)});
    return user;
}

const findUserByUsername = async(name) => {
    try{
        //finds all user that matches with search string
        const user = await userCol.find({username: new RegExp(name, 'i')})
                                  .project({_id:1,username:1}).toArray(); 
        if(user.length > 0){
            return {data:user, status: 1}
        }
        return {data:[], status:0}
    } catch(err){
        errorHandler(err);
    }
}

//
// GROUP FUNCTIONS
//

//add new group to the database
const addGroup =  async (groupName, description, userId) => {
    try{
        const groupExist = await groupCol.findOne({groupName:groupName});
                
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

            const groupData = await groupCol.findOne({_id: groupId});
            return {data:groupData, status: 1};
        }
    } catch(err){
        errorHandler(err);
    }
}

//remove group from database

//add message to group
const storeGroupMsg = async (groupId, newMessage) => {
    try{
        await groupCol.updateOne({_id:ObjectId(groupId)}, {$push:{messages: newMessage}} );
        return 1;
    } catch(err){
        errorHandler(err);
    }   
}

//gets group/message data for a user
const getInitData = async (userId) => {
    try{
        const userData = await userCol.aggregate([  //retrieves user info based on id
                                                    {$match: {_id: ObjectId(userId)}},
                                                    //joins groups field
                                                    {$lookup: {
                                                        from: 'groups',
                                                        let: {groups: '$groups'},
                                                        pipeline:[
                                                            {$match: {$expr:{$in:['$_id', '$$groups']}}},
                                                            { '$addFields': {
                                                                'sort': {
                                                                    '$indexOfArray': [ '$$groups', '$_id' ]
                                                                }
                                                            }},
                                                            { '$sort': { 'sort': 1 } },
                                                            { '$addFields': { 'sort': '$$REMOVE' }}
                                                        ],
                                                        as: 'groups'
                                                    }},
                                                    //joins groupInvite field
                                                    {$lookup:{
                                                        from:'groups',
                                                        let: {groupInvites:'$groupInvites'},
                                                        pipeline:[
                                                            {$match: {$expr:{$in:['$_id', '$$groupInvites']}}},
                                                            {$project: {_id: 1, 
                                                                        groupName:1,
                                                                        description: 1}},
                                                            { '$addFields': {
                                                                'sort': {
                                                                    '$indexOfArray': [ '$$groupInvites', '$_id' ]
                                                                }
                                                            }},
                                                            { '$sort': { 'sort': 1 } },
                                                            { '$addFields': { 'sort': '$$REMOVE' }}
                                                        ],
                                                        as: 'groupInvites'
                                                    }}
                                                ]).toArray();
        //extract user data object from array
        let user = userData[0];

        //formats group field of init data 
        let groups = [], selected = null, name = null
        if(user.groups.length > 0){
            groups = userData[0].groups;
            selected = userData[0].groups[0]._id;
            name = userData[0].groups[0].groupName;
        }
        // removes unnecessary infomation before sending to client
        delete user.password;
        delete user.groups;

        const data = {user:user, groups:groups, selected: {_id: selected, name: name, type:'group', index: 0}};
        return {data:data, status: 1};
    } catch(err){
        errorHandler(err);
    }
}

//gets group info
const getGroupInfo = async (groupId) =>{
    try{
        const groupData = await groupCol.findOne({_id:ObjectId(groupId)});
        if(groupData){
            return {data:groupData, status: 1}
        } else {
            return {data:"This group ID doesn't exist" ,status: 0}
        }
    }catch(err){
        errorHandler(err);
    }
}


//
// GROUP MIDDLEWARE FUNCTIONS
//

const isGroupMember = async (userId, groupId) => {
    try{
        const isMember = await groupCol.find({activeMembers:ObjectId(userId), _id: ObjectId(groupId)}).count();
        return isMember ? {status:1} : {status:0};
    } catch (err){
        errorHandler(err);
    }
}

const isAdmin = async (userId, groupId) => {
    try{
        const isAdmin = await groupCol.find({admins:ObjectId(userId), _id: ObjectId(groupId)}).count();
        return isAdmin ? {status:1} : {status:0};
    } catch (err){
        errorHandler(err);
    }
}

const isCreator = async (userId, groupId) => {
    try{
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
        const hasInvite = await userCol.find({_id:userObjId, groupInvites:groupObjId}).count();
        // returns 1 if user has invite and 0 if the user does not have invite
        return hasInvite;
    } catch(err){
        errorHandler(err);
    }
}


const errorHandler = (err) => {
    console.log(err);
    throw {data: err, status: -1}
}

module.exports = {addUser, loginUser, findUserById, findUserByUsername,
                  addGroup, storeGroupMsg, getGroupInfo, getInitData,
                  isGroupMember, isAdmin, isCreator,
                  sendGroupInvite, acceptGroupInvite, declineGroupInvite
                 };