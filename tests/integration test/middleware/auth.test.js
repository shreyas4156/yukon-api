const request = require('supertest');
const {User} = require('../../../models/user');
const mongoose = require('mongoose');
const {Genre} = require('../../../models/genre');
let server;
describe('auth middleware',()=>{
    beforeEach(()=>{server = require('../../../index')});
    afterEach(async()=>{
        await server.close();
        await Genre.remove({});
    });
    let token;
    const exec = ()=>{
        return request(server)
            .post('/api/genres')
            .set('x-auth-token',token)
            .send({name: 'genre1'});
    }
    beforeEach(()=>{token = new User({isAdmin:true}).generateAuthToken();})

    it('401 error if no access to the token',async()=>{
        token=''
        const res =await exec();
        expect(res.status).toBe(401);
    });
    it('400 error if invalid token',async()=>{
        token='a'
        const res =await exec();
        expect(res.status).toBe(400);
    });
    it('200 if valid token',async()=>{
        
        const res =await exec();
        expect(res.status).toBe(200);
    });
});