const _ = require('lodash');
const bcrypt= require('bcrypt');
const Joi = require('joi');
const {User} = require('../models/user'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
router.use(express.json());
 
router.post('/', async(req,res)=>{
    const { error } = inputValidation(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid Username or password');
    const passwordValidation = await bcrypt.compare(req.body.password, user.password)
    if(!passwordValidation)  return res.status(400).send('Invalid Username or password');
    const token = user.generateAuthToken();
    res.send(token);
});
function inputValidation(input){
    const schema = {
        email: Joi.string().email().min(5).max(255).required(),
        password:Joi.string().min(6).max(255).required()
    }
    return Joi.validate(input, schema);
}
module.exports = router;