const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const { json } = require('body-parser');
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const { generateToken } = require('../config/jwtToken.js');
const { generateRefreshToken} = require("../config/refreshToken.js")
const validateMongodbId = require('../utils/validateMongodbId.js');

const createUser = asyncHandler(async (req, res) =>{
    const getEmail = req.body.email;
    const findUser = await User.findOne({email: getEmail});

    //hash password
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.password, salt);

    const {lastName, firstName, email, password, mobile} = req.body;
    if(!findUser){
        const newUser = User.create({
            lastName,
            firstName,
            email,
            password:newPassword,
            mobile
        })
        res.json({
            status:"success"             
        });
    }else{
        throw new Error("User already exists");
    }
    // if(!findUser){
    //     const newUser = User.create(req.body);
    //     res.json(newUser)
    // }else{
    //     throw new Error("User already exists")
    // };

}) 

const loginUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;
    try{
        const findUser = await User.findOne({email});
        //match password 
        const isPassword = await bcrypt.compareSync(password, findUser.password)
        if(findUser && isPassword){
            const refreshToken = await generateRefreshToken(findUser.id);
            const updateUser = await User.findByIdAndUpdate(findUser.id,{
                refreshToken
            },{
                new:true,
            })
            res.cookie("refreshToken",refreshToken,{
                httpOnly:true,
                maxAge:72*60*60*1000,
            });
            res.json({
                status:"success",
                data:{
                    _id:findUser._id,
                    firstName: findUser.firstName,
                    lastName: findUser.lastName,
                    email: findUser.email,
                    mobile: findUser.mobile,
                    token:generateToken(findUser.id),
                }
            })
        }else{
          throw new Error("Invalid Credentials")
        }
    }catch(err){
        throw new Error("User not exists")
    }
  
    // if(findUser && await findUser.isPasswordMatched(password)){
    //     res.json(findUser)
    // }else{
    //     throw new Error("Invalid Credentials");
    // }
})

const logoutUser = asyncHandler(async (req, res)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken){
        throw new Error("No refresh token in cookies");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user){
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true,
        });
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate(refreshToken,{
        refreshToken:"",
    })
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true,
    })
    return res.sendStatus(204);
})

const getAllUser = asyncHandler( async (req, res) => {
    try{ 
        const listUser = await User.find();
        res.json({
            status:"success",
            data:listUser
        })
    }catch(err){
        throw new Error(err)
    }
})

const handlerRefreshToken = asyncHandler( async(req, res)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = req.cookies.refreshToken;
    const user = await User.findOne({refreshToken})
    if(!user) throw new Error("No refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_KEY,(err, decode)=>{
       if(err || user.id !== decode.id){
        throw new Error("There is something wrong whitd refresh token");
       }
       const token = generateToken(user.id);
       res.json({token})
    })
})


const getUserById = asyncHandler(async (req, res)=>{
    try{
        const getId = req.params.id;
        validateMongodbId(getId);
        const getUser = await User.findById(getId)
        if(getUser){
            res.json(getUser);
        }
    }catch(err){
        throw new Error("Not found")
    }
})


const deleteUser = asyncHandler(async (req, res)=>{
    try{
        const getId = req.params.id;
        validateMongodbId(getId);
        const getUser = await User.findByIdAndDelete(getId);
        if(getUser){
            res.json({
                status:"success",
                code:"1",
            });
        }else{
            throw new Error("Error Delete")
        }
    }catch(err){
        throw new Error("Not found")
    }
})

const updateUser = asyncHandler(async (req, res)=>{
    try{
        const getId = req.user.id;
        const getUser = await User.findByIdAndUpdate(getId,{
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobile: req.body.mobile,
    },{
        new:true,
    })
        res.json({
            status:"success",
            code:"1",
            data:getUser
        })
    }catch(err)
    {
        throw new Error("Error Update")
    }
})

const blockUser = asyncHandler(async (req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const getUser = await User.findByIdAndUpdate(id,
        {
            isBlock:true
        },{
            new:true,
        })
        res.json({
            status:"success",
            code:'1',
            data:getUser
        })
    }catch(err){
        throw new Error(err)
    }
})

const unblockUser = asyncHandler(async (req, res)=>{
    const id = req.params.id;
    validateMongodbId(id);
    try{
        const getUser = await User.findByIdAndUpdate(id,
        {
            isBlock:false
        },{
            new:true,
        })
        res.json({
            status:"success",
            code:'1',
            data:getUser
        })
    }catch(err){
        throw new Error(err)
    }
})


module.exports = {createUser, loginUser,getAllUser,getUserById,deleteUser,updateUser,unblockUser, blockUser, handlerRefreshToken,logoutUser}