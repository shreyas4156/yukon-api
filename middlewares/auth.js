
const jwt = require('jsonwebtoken');

 function auth(req,res,next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('No Token to access');
    
    try{
        const data = jwt.verify(token, process.env.vidly_privateKey);
        req.user = data;
        next();
    }
    catch(ex){res.status(400).send('Invalid token..')}
}
module.exports= auth;