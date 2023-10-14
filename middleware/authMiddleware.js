const { verify } = require('jsonwebtoken');
const User = require('../models/user');

const authGuard = async (req,res,next) => {
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            const token = req.headers.authorization.split(" ")[1];
            const { id } = verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(id).select("-password");
            next();
        } catch {
            let error = new Error('Invalid Token');
            error.statusCode = 401;
            next(error);
        }
    }else{
        let error = new Error('Unauthorized. Abdullah Wakeup.');
        error.statusCode = 401;
        next(error);
    }
}

const adminGaurd = (req, res, next) => {
    if(req.user && req.user.admin){
        next();
    }else{
        let error = new Error('Not authorized. To create a post you must be an admin.')
        next(error);
    }
}
module.exports = {
    authGuard,
    adminGaurd,
}