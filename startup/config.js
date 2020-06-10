require('dotenv').config()
const winston = require('winston');
module.exports = function(){
    if(!process.env.vidly_privateKey){
        throw new Error('FATAL ERROR: Private key not defined...');
         
    }
}