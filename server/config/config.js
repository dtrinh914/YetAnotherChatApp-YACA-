const MONGO_DB_URI = process.env.MONGO ? process.env.MONGO : 'mongodb://127.0.0.1:27017/';
const SESSION_SECRET = process.env.SESSION ? process.env.SESSION : 'keyboard cat';
const REDIS_CONFIG = process.env.REDIS ? JSON.parse(process.env.REDIS) : {host:'localhost', port:6379};
const DB = 'chat_app';

module.exports = {MONGO_DB_URI, SESSION_SECRET, REDIS_CONFIG, DB};