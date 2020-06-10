const Joi =  require('joi');
const mongoose = require('mongoose');
const moment = require('moment');
const rentalSchema = new mongoose.Schema({
    customer: {
        type :new mongoose.Schema({
            name: {
                type:String,
                required:true,
                minlength:3,
                maxlength:255,
            },
            phone: {
                type:Number,
                required:true,
                minlength:5,
                maxlength:50
            },
            isGold:{
                type:Boolean,
                default:false
            }
        }),
        required:true
    },
    movie: {
        type :new mongoose.Schema({
        title: {
            type: String,
            minlength: 3,
            maxlength: 255,
            required: true,
            trim: true
        },
    
        dailyRentalRate: {
            type: Number,
            required:true,
            min:0,
            max:255
    }
        }),
        required:true
    },
    dateOut:{
        type: Date,
        required:true,
        default:Date.now
    },
    dateReturned:{
        type:Date,
    },
    rentalFee:{
        type:Number,
        min:0,
        max:255,
    }
});
rentalSchema.methods.return = function (){
    this.dateReturned = new Date();

    const rentalDays = moment().diff(this.dateOut, 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
    
}
rentalSchema.statics.lookup = function (custId, movieId){
    return this.findOne({
        'customer._id': custId,
        'movie._id': movieId
    });
}
const Rental = mongoose.model('rentals', rentalSchema);

function inputValidation(input){
    const schema={
    custId: Joi.objectId().required(),
    movieId:Joi.objectId().required()
    }
    return Joi.validate(input, schema);
}

module.exports={
    Rental,
    inputValidation
}