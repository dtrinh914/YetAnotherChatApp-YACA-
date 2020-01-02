const bcrypt = require('bcrypt');

//Set up MongoClient
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const {MONGO_DB_URI} = require('../config/config');
const client = new MongoClient(MONGO_DB_URI, {poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true });

//Opens connection to database
client.connect()
    .then( ()=> console.log('Connected to database . . . ') )
    .catch( err => {
        console.log(err);
});

module.exports = {client}

const addUser = async (username, password) =>{
    try{
        // connects to proper connection and tests to see if user name exists
        const db = client.db('chat_app');
        const collection = db.collection('users');
        const usernameExist = await collection.findOne({username:username});
        
        // returns 0 if user exists, inserts the new user data if it doesn't and returns 1
        if(usernameExist){
            return 0;
        } else {
        //salt and hash password before inserting into db
            const saltRounds = 10;
            const hash = await bcrypt.hash(password, saltRounds);
            await collection.insertOne({username:username, password: hash, groups:[], ownerOf:[], adminOf:[]});
            return 1;
        }
        // returns and logs -1 if there is an error
    } catch(err){
        console.log(err);
        return -1;
    }
}

const loginUser = async (username, password) => {
    const db = client.db('chat_app');
    const collection = db.collection('users');
    const user = await collection.findOne({username:username});
    if(user){
        const verified = await bcrypt.compare(password,user.password);
        return {user: user, verified: verified};
    } else {
    //if user doesn't exist return 0
        return {verifed: undefined};
    }
}

//add new group to the database
const addGroup =  async (groupName, userId) => {
    try{
        const db = client.db('chat_app');
        const groupCol = db.collection('groups');
        const userCol = db.collection('users');
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
            await userCol.updateOne({_id:ObjectId(userId)}, {$push:{groups: groupId, ownerOf:groupId, adminOf:groupId}})
            return 1;
        }
        // returns and logs -1 if there is an error
    } catch(err){
        console.log(err);
        return -1;
    }
}

//remove group from database

//add message to group
const storeGroupMsg = async (groupId, newMessage) => {
    try{
        await client.db('chat_app').collection('groups')
                    .updateOne({_id:ObjectId(groupId)}, {$push:{messages: newMessage}} );
        return 1;
    } catch(err){
        console.log(err);
        return -1;
    }   
}

// get group data
const getGroupData = async (groupId) => {
    try{
        const data = await client.db('chat_app'.collection('groups')
                    .findOne({_id:ObjectId(groupId)}));
        return data;
    } catch(err){
        console.log(err);
        return -1;
    }
}


const findUserById = async (id) => {
    const db = client.db('chat_app');
    const collection = db.collection('users');
    const user = await collection.findOne({_id: ObjectId(id)});
    return user;
}


module.exports = {addUser, loginUser, findUserById, addGroup, storeGroupMsg, getGroupData};