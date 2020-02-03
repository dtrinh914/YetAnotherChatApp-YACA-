const request = require('supertest');
const {closeRedis} = require('../util/redisUtil');
const app = require('../app');

afterAll(async () =>{
    await closeRedis();
});

describe('/', () => {
    it('returns 200', async() => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('<!doctype html>')
    });
});