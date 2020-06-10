const express = require('express');
const router = express.Router();
const{Rental} = require('../models/rental');
const mongoose = require('mongoose');
const auth = require('../middlewares/auth');  
const moment = require('moment');  
const {Movie} = require('../models/movie');
const Joi = require('joi');
const validate =  require('../middlewares/validate')


router.post('/',[auth, validate(validatereturn)], async(req,res)=>{    
    const rental = await Rental.lookup(req.body.custId, req.body.movieId); 
    if(!rental) return res.status(404).send("rental not found");
    if(rental.dateReturned) return res.status(400).send("rental already processed");
    
   
    rental.return();
    await rental.save();

    const movie = await Movie.incStock(rental.movie._id);
    res.send(rental);
});

function validatereturn(genre) {
    const schema = {
      custId: Joi.objectId().required(),
      movieId: Joi.objectId().required()
      
    };
    return Joi.validate(genre, schema);
  }

module.exports = router;