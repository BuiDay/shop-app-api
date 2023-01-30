const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');


const authMiddleware = asyncHandler(async (req, res, next) =>{
    let token;
    if(req?.headers?.authorization?.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
        try{
            if(token){
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            }
        }catch(error){
            throw new Error("Not Authorized token expired, Please Logon again");
        }
    }else{
        throw new Error("There is no token attached to header");
    }
}) 

const isAdmin = asyncHandler(async (req, res, next)=>{
    const {email} = req.user;
    try{
        const getUser = await User.findOne({email})
        if(getUser.role === 'admin'){
            next();
        }else{
            throw new Error("You are not an Admin")
        }
    }catch(err){
        throw new Error(err);
    }
}) 


module.exports = {authMiddleware, isAdmin}