const {User} = require('../../../models/user');
const JWT = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();
describe('generateAuthToken',()=>{
    it('checks if the user has valid token',()=>{
        const payload = {_id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true };
        const user = new User(payload);
        const token = user.generateAuthToken()
        const decode = JWT.verify(token, process.env.vidly_privateKey);
        expect(decode).toMatchObject(expect.objectContaining(payload));
    })
})