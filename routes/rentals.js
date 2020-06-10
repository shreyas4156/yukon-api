const {inputValidation, Rental} =require('../models/rental');
const {Movie} = require('../models/movie')
const {Customer} = require('../models/customer')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
router.use(express.json());

router.get('/', async(req,res)=>{
    const rentals = await Rental.find()
    res.send(rentals);
});
Fawn.init(mongoose);

router.post('/', async(req,res)=>{
    const{error} = inputValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    const cust=await Customer.findById(req.body.custId)
        .catch(()=>console.log('Cust ID not found'));
    if(!cust) return res.status(404).send('Customer ID not found')
    const movie=await Movie.findById(req.body.movieId)
        .catch(error=>console.log(console.log('Movie ID not found')));
    if(!movie) return res.status(404).send('Movie ID not found')

    if(movie.numberInStock === 0) return res.status(400).send('Movie is out of stock');     
    const rental = new Rental({
        customer: {
            _id: cust._id,
            name: cust.name,
            phone: cust.phone,
            isGold: cust.isGold
        },
        movie: {
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
            _id: movie._id,
        }
    });
    try{
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: movie._id},{
                $inc: {numberInStock: -1}
            })
            .run();
        res.send(rental);
    }
    catch(ex){res.status(500).send('error occured')}
});
module.exports = router;