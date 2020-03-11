const redis = require('redis');
const {promisify} = require('util');
const session = require('express-session');
const {REDIS_CONFIG} = require('../config/config');
const redisStore = require('connect-redis')(session);
const redisClient = redis.createClient(REDIS_CONFIG);

redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
});

const appRedisStore = new redisStore({...REDIS_CONFIG, client: redisClient, ttl: 86700});

const redisSet = promisify(redisClient.set).bind(redisClient);
const redisGet = promisify(redisClient.get).bind(redisClient);
const redisDel = promisify(redisClient.del).bind(redisClient);

const closeRedis = async () =>{
    await new Promise((resolve) => {
        redisClient.quit(() => {
            resolve();
        });
    });
    await new Promise(resolve => setImmediate(resolve));
}

const clearRedis = () => {
    redisClient.flushdb();
}

module.exports = {redisSet, redisGet, redisDel, appRedisStore, clearRedis, closeRedis}