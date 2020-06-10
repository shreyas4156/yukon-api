const request = require('supertest');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
describe('/api/auth', ()=>{

    let user;

    beforeEach(async() => { server = require('../../index'); 
        user = new User({
            name:'123455',
            email:'12345@gmail.com',
            password:'Sk@41562'
        });
        const salt = await bcrypt.genSalt(15);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
    });
    afterEach(async () => { 
       await server.close();
       await User.remove({});
    });

    it('returns 400 if not valid email', async()=>{

        const res = await request(server)
            .post('/api/auth')
            .send({email:'dgdf', password:'Sh@12345'});
        expect(res.status).toBe(400);

    });
    it('returns 400 if not valid password', async()=>{

        const res = await request(server)
            .post('/api/auth')
            .send({email:'dgdf@gmail.com', password:'12345'});
        expect(res.status).toBe(400);

    });
    it('returns 400 if email not found', async()=>{

        const res = await request(server)
            .post('/api/auth')
            .send({email:'dgdf@gmail.com', password:'Sk@41562'});
        expect(res.status).toBe(400);

    });
    it('returns 400 if password not found', async()=>{

        const res = await request(server)
            .post('/api/auth')
            .send({email:'12345@gmail.com', password:'Skj@41562'});
        expect(res.status).toBe(400);

    });
    it('returns 200 if everything goes right', async()=>{

        const res = await request(server)
            .post('/api/auth')
            .send({email:'12345@gmail.com', password:'Sk@41562'});
        expect(res.status).toBe(200);
});

});