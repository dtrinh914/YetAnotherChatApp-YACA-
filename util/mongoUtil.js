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
            await userCol.insertOne({username:username, password: hash, groups:[], friends:[]});
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

//
// GROUP FUNCTIONS
//

//add new group to the database
const addGroup =  async (groupName, userId) => {
    try{
        const groupExist = await groupCol.findOne({groupName:groupName});
                
        // returns 0 if group exists, inserts the new group data if it doesn't and returns 1
        if(groupExist){
            return 0;
        } else {
        //insert group data into db
            const groupId = new ObjectId();
            await groupCol.insertOne({_id: groupId, 
                                        groupName:groupName, 
                                        messages:[], 
                                        members:[ObjectId(userId)],
                                        creator: ObjectId(userId),
                                        admins: [ObjectId(userId)]
                                    });
            await userCol.updateOne({_id:ObjectId(userId)}, {$push:{groups: groupId}})
            return 1;
        }
        // returns and logs -1 if there is an error
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
const getGroupData = async (userId) => {
    try{
        const userData = await userCol.aggregate([
                                                    {$match: {_id: ObjectId(userId)}},
                                                    {$lookup: {
                                                        from: "groups",
                                                        localField: "groups",
                                                        foreignField: "_id",
                                                        as: "groups"
                                                    }},
                                                ]).toArray();
        const data = userData[0].groups;
        return {data:data, status: 1};
    } catch(err){
        errorHandler(err);
    }
}

const errorHandler = (err) => {
    console.log(err);
    return {data: err, status: -1}
}

module.exports = {addUser, loginUser, findUserById,
                  addGroup, storeGroupMsg, getGroupData};