const mongoose = require('mongoose');
const winston = require('winston');
require('dotenv').config()
const config = require('config');
module.exports = function(){
    mongoose.set('useUnifiedTopology', true);
      mongoose.connect(config.get('db'), {useNewUrlParser: true,useCreateIndex: true})
      .then(() => winston.info(`Connected to ${config.get('db')}`));
      console.log(process.env.NODE_ENV)     
}
