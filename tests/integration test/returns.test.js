const {Rental}=require('../../models/rental');
const mongoose = require('mongoose');
const request = require('supertest');
const {User} = require('../../models/user');
const moment  = require('moment');
const {Movie} = require('../../models/movie');

describe('/api/rentals',()=>{
    let rental;
    let token;
    let custId;
    let movieId;
    let movie;
    let id;
    async function exec(){
        return request(server)
        .post('/api/returns')
        .send({ custId, movieId })
        .set('x-auth-token', token);
    }
    beforeEach(async() => { 

        custId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        server = require('../../index'); 
        movie = new Movie({
            _id:movieId,
            title:'12345',
            dailyRentalRate:3,
            genre: {name: '12345'},
            numberInStock: 5
        });
        await movie.save();
        rental = new Rental({
            customer:{
                _id:custId,
                name: '12345',
                phone: 12345
            },
            movie:{ 
                _id:movieId,
                title:'12345',
                dailyRentalRate:3
            }
        });
        await rental.save();
        id = rental._id;
        token = new User({isAdmin:true}).generateAuthToken();
       
    });
    afterEach(async () => { 
        await Rental.remove({});
        await Movie.remove({});
        await server.close();
    });
    it('Returns 401 for unauthorized access',async()=>{
        token = '';
        const res= await exec();
        expect(res.status).toBe(401);
    });
    it('Returns 400 if movieId not provided',async()=>{
        movieId = '';
        const res= await exec();
        expect(res.status).toBe(400);
    });

    it('Returns 400 if custId not provided',async()=>{
        custId = '';
        const res= await exec();
        expect(res.status).toBe(400);
    });
    it('Returns 404 if no rental available',async()=>{
        await Rental.remove({});
        const res= await exec();
        expect(res.status).toBe(404);
    });
    it('Returns 400 if rental already processed',async()=>{await Rental.findOneAndUpdate({_id:id}, {dateReturned:545}, {new : true});
        rental.dateReturned = new Date();
        await rental.save();
        const res= await exec();
        expect(res.status).toBe(400);
    });
    it('Returns 200 if rental giving successfull',async()=>{
        const res= await exec();
        expect(res.status).toBe(200);
    });
    it('Set return Date if input is valid',async()=>{
        const res= await exec();
        const rental_ = await Rental.findById(id);
        const diff = new Date() - rental_.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });
    it('Set Rental Cost',async()=>{
        rental.dateOut = moment().add(-7, 'days').toDate();
        
        await rental.save();
        const res= await exec();
        const rental_ = await Rental.findById(id);
        expect(rental_.rentalFee).toBe(21);
    });
    it('Increase the stock in movie',async()=>{
        const res= await exec();
        const movie_ = await Movie.findById(movieId);
        expect(movie_.numberInStock).toBe(6);
    });
    it('Return the rental',async()=>{
        const res= await exec();
        const rental_ = await Rental.findById(id);
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'movie', 'customer'])
        );
    });
});