//Set up MongoClient
const MongoClient = require('mongodb').MongoClient;
const {MONGO_DB_URI} = require('../../config/config');
let client;
//Opens connection to database

const openConnection = async () => {
    try{
        client = new MongoClient(MONGO_DB_URI, {poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect()
        console.log('Connected to database . . . ');
    } catch (err) {
        errorHandler(err);
    }
}

const getClient = () => {
    return client;
}

const closeConnection = () => {
    client.close();
}

const errorHandler = (err) => {
    console.log(err);
    throw {data: err, status: -1}
}

module.exports = {getClient, openConnection, closeConnection, errorHandler};