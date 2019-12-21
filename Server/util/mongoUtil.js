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
        const db = client.db('chat_app');
        const collection = db.collection('users');
        const usernameExist = await collection.findOne({username:data.username});
        
        if(usernameExist){
            return 0;
        } else {
            await collection.insertOne(data);
            return 1;
        }
    } catch(err){
        console.log(err);
        return -1;
    }
}


module.exports = {addUser};

// const insertDocuments = (db, callback) =>{
//     const collection = db.collection('documents');
//     collection.insertMany([{a:1},{a:2},{a:3}], (err,result) =>{
//         assert.equal(err, null);
//         assert.equal(3, result.result.n);
//         assert.equal(3, result.ops.length);
//         console.log("Inserted 3 documents into the collection");
//         callback(result);
//     });
// }
// const findDocuments = (db, callback) =>{
//     const collection = db.collection('documents');
//     collection.find({a:3}).toArray( (err,docs)=> {
//         assert.equal(err, null);
//         console.log('Found the following records');
//         console.log(docs);
//         callback(docs);
//     })
// }

// const updateDocument = (db, callback) => {
//     const collection = db.collection('documents');
//     collection.updateOne({a:2}, { $set: {b:1} }, (err, result) => {
//         assert.equal(err, null);
//         assert.equal(1, result.result.n);
//         console.log('Updated the document with the field a equal to 2');
//         callback(result);
//     });
// }

// const removeDocument = (db, callback) => {
//     const collection = db.collection('documents');
//     collection.deleteOne({a:3}, (err, result) => {
//         assert.equal(err, null);
//         assert.equal(1, result.result.n);
//         console.log('Removed the document with the field a equal to 3');
//         callback(result);
//     });
// }

