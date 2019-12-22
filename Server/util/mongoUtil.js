//Connect to MongoClient
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
const uri = require('../config/MONGO_DB_URI');
const client = new MongoClient(uri, {poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true });
client.connect()
    .then( ()=> console.log('Connected to database . . . ') )
    .catch( err => {
        console.log(err);
    });

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
            await collection.insertOne({username:username, password: hash});
            return 1;
        }
        // returns and logs -1 if there is an error
    } catch(err){
        console.log(err);
        return -1;
    }
}


module.exports = {addUser};