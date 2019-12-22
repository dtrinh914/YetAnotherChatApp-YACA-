//Connect to MongoClient
const MongoClient = require('mongodb').MongoClient;
const uri = require('../config/MONGO_DB_URI');
const client = new MongoClient(uri, {poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true });
client.connect()
    .then( ()=> console.log('Connected to database . . . ') )
    .catch( err => {
        console.log(err);
    });

const addUser = async (data) =>{
    try{
        // connects to proper connection and tests to see if user name exists
        const db = client.db('chat_app');
        const collection = db.collection('users');
        const usernameExist = await collection.findOne({username:data.username});
        
        // returns 0 if user exists, inserts the new user data if it doesn't and returns 1
        if(usernameExist){
            return 0;
        } else {
            await collection.insertOne(data);
            return 1;
        }
        // returns and logs -1 if there is an error
    } catch(err){
        console.log(err);
        return -1;
    }
}


module.exports = {addUser};