const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;
const {getClient, errorHandler} = require('./connection.js');
const {getGroupInfo} = require('./group_util');
const {DB} = require('../../config/config');

//gets group/message/user data for a specific user
const getInitData = async (userId) => {
    try{
        const client = getClient();
        const userCol = client.db(DB).collection('users');
        
        const userData = await userCol.aggregate([  //retrieves user info based on id
                                                    {$match: {_id: ObjectId(userId)}},
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
                                                    }},
                                                ]).toArray();
        //extract user data object from array
        let user = userData[0];

        //formats group field of init data 
        let groups = [], selected = null, name = null
        if(user.groups.length > 0){
            const groupIds = user.groups;
            let formatedGroups = [];

            //fetches each of the group data for the user
            for(let i=0; i < groupIds.length; i++){
                const response = await getGroupInfo(groupIds[i]);
                formatedGroups.push(response.data[0]);
            }

            groups = formatedGroups;
            selected = formatedGroups[0]._id;
            name = formatedGroups[0].groupName;
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

const addUser = async (username, password) =>{
    try{
        if(!username.trim() || !password.trim()){
            return {status: -1};
        }
        const client = getClient();
        const userCol = client.db(DB).collection('users');

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
    const client = getClient();
    const userCol = client.db(DB).collection('users');

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
    try{
        const client = getClient();
        const userCol = client.db(DB).collection('users');

        const userData = await userCol.aggregate([  //retrieves user info based on id
            {$match: {_id: ObjectId(id)}},
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
            }},
        ]).toArray();
        return userData[0];
    } catch{
        errorHandler(err);
    }
}

const findUserByUsername = async(name) => {
    try{
        if(name.trim() === '') return {data:'Username cannot be an empty String', status: 0}; 

        const client = getClient();
        const userCol = client.db(DB).collection('users');

        //finds all user that matches with search string
        const user = await userCol.find({username: new RegExp(name, 'i')})
                                  .project({_id:1,username:1}).toArray(); 
        if(user.length > 0){
            return {data:user, status: 1}
        }
        return {data:'User Not Found', status:0}
    } catch(err){
        errorHandler(err);
    }
}

module.exports = {addUser, loginUser, findUserById, findUserByUsername, getInitData}