let server;
const {Genre}=require('../../models/genre');
const {User}=require('../../models/user');
const request = require('supertest');
const mongoose = require('mongoose');
describe('/api/genre',()=>{
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => { 
       await Genre.remove({});
       await server.close();
    });
    describe('GET /', ()=>{ 
   
        it('Returns all the genres', async()=>{
            await Genre.collection.insertMany([
                {name: "genre1"},
                {name: "genre2"},
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name="genre1")).toBeTruthy();
            expect(res.body.some(g => g.name="genre2")).toBeTruthy();
            
        });
    });
    describe('GET/:id', ()=>{
        it('Returns 404 for id not found', async()=>{
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get(`/api/genres/${id}`);
            expect(res.status).toBe(404);

        })
        it('Returns 404 for id not found', async()=>{
            const res = await request(server).get(`/api/genres/a`);
            expect(res.status).toBe(404);

        })
        it('Returns the genre found for specified id', async()=>{
            const g = new Genre({name:'genre3'});
            await g.save();
            const res = await request(server).get(`/api/genres/${g._id}`);
            expect(res.status).toBe(200);
            expect(res.body.name).toBe(g.name);
        })
    })
    describe('POST/', ()=>{
        let token;
        let name;
        const exec = async()=>{
            return await request(server)
            .post('/api/genres')
            .send({name})
            .set('x-auth-token', token);
        }
        beforeEach(()=>{token = new User({isAdmin:true}).generateAuthToken();
            name = "genre1";
        });

        it('returns 401 error if no token found',async()=>{
            token = ''
            const res = await exec();
            expect(res.status).toBe(401);
        });
        it('returns 403 error, if not an admin',async()=>{
            token = new User().generateAuthToken();
            const res = await exec();
            expect(res.status).toBe(403);
        }); 
        it('returns 400 error, if less then 5 chars',async()=>{
            name= 'aa'
            const res = await exec();
            expect(res.status).toBe(400);
        }); 
        it('returns 400 error if more then 50 chars',async()=>{
            name = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        }); 
        it('returns 200 OK, and returns the pushed value',async()=>{
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });

    describe('PUT /', ()=>{
        let token;
        let name;
        let genre;
        let newName;
        let id;
        const exec = async()=>{
            return await request(server)
            .put('/api/genres/'+id)
            .set('x-auth-token', token)
            .send({name:newName});
        }
        beforeEach(async ()=>{
            
            genre = new Genre({name:'genre1'}); 
            await genre.save();
            token = new User({isAdmin:true}).generateAuthToken();
            newName='updatedname' ;
            id = genre._id;
        });

        it('returns 401 error if no token found',async()=>{
            token = ''
            const res = await exec();
            expect(res.status).toBe(401);
        });
        it('returns 403 error, if not an admin',async()=>{
            token = new User().generateAuthToken(); 
            const res = await exec();
            expect(res.status).toBe(403);
        }); 
        it('returns 400 error, if less then 5 chars',async()=>{
            newName= 'aa'
            const res = await exec();
            expect(res.status).toBe(400);
        }); 
        it('returns 400 error if more then 50 chars',async()=>{
            newName = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('returns 404 error if id not proper',async()=>{
            id= mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('returns 404 error if id not proper',async()=>{
            id = 111;
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('returns 404 error if id not found',async()=>{
            id = '';
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('update the genre if id is valid',async()=>{
            await exec();
            const upgenre = await Genre.findById(genre._id);
            expect(upgenre.name).toBe(newName);
        });
        it('returns the updated value if its valid',async()=>{
            const res = await exec();
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', newName);
            
        });
    });
    describe('DELETE /', ()=>{
        let token;
        let name;
        let genre;
        let id;
        const exec = async()=>{
            return await request(server)
            .delete('/api/genres/'+id)
            .set('x-auth-token', token);
        }
        beforeEach(async ()=>{
            name = "genre1";
            genre = new Genre({name}); 
            await genre.save();
            token = new User({isAdmin:true}).generateAuthToken();
            id= genre._id;
        });

        it('returns 401 error if no token found',async()=>{
            token = ''
            const res = await exec();
            expect(res.status).toBe(401);
        });
        it('returns 403 error, if not an admin',async()=>{
            token = new User().generateAuthToken(); 
            const res = await exec();
            expect(res.status).toBe(403);
        }); 
        it('returns 404',async()=>{
            id= mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('returns 404',async()=>{
            id = 111;
            const res = await exec();
            expect(res.status).toBe(404);
        });
        it('delete the genre if the id is found',async()=>{
            await exec();
            const deleted = await Genre.findById(genre._id);
            expect(deleted).toBeNull();
        });
        it('return the removed genre',async()=>{
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', name);
            
        });
    });

});