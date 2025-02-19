const jwt = require('jsonwebtoken');

const authenticate= (req,res ,next) => {
    const token =req.header.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({message: 'Authentication failed'});
    try{
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
        req.user= decoded;
        next();
    }catch(err){
        return res.status(403).json({message: 'Token is not valid'});
    }
};
module.exports= authenticate;
