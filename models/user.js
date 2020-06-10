const Joi = require('joi');
const mongoose = require('mongoose');
const jwt= require('jsonwebtoken');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true, 
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:5,
        maxlength:255
    },
    password:{
        type:String,
        minlength:6,
        maxlength:255,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})


userSchema.methods.generateAuthToken = function() {
    var token = jwt.sign({_id :this._id, isAdmin:this.isAdmin}, process.env.vidly_privateKey );
    return token;
};
const User = mongoose.model('users', userSchema);

function inputValidation(input){
    const schema = {
        name: Joi.string().min(6).max(255).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password:Joi.string().min(6).max(255).required()
    }
    return Joi.validate(input, schema);
}

module.exports ={
    inputValidation,
    User
}