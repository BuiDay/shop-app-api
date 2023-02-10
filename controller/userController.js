const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const uniqid = require("uniqid");
const { generateToken } = require('../config/jwtToken.js');
const { generateRefreshToken} = require("../config/refreshToken.js")
const validateMongodbId = require('../utils/validateMongodbId.js');
const {sendEmail} = require('../controller/emailController.js');
const Cart= require('../models/cartModel.js');
const Product = require("../models/productModel.js")
const Coupon = require("../models/couponModel.js")
const Order = require("../models/orderModel.js");
const console = require('console');

const createUser = asyncHandler(async (req, res) =>{
    const getEmail = req.body.email;
   
    try {
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
    } catch (error) {
        throw new Error(error)
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
        console.log
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
        throw new Error("Invalid Credentials")
    }
  
    // if(findUser && await findUser.isPasswordMatched(password)){
    //     res.json(findUser)
    // }else{
    //     throw new Error("Invalid Credentials");
    // }
})

const loginAdmin = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;

        const findAdmin = await User.findOne({email});
        //match password 
        const isPassword = await bcrypt.compareSync(password, findAdmin.password)
        console.log(findAdmin.role)
        if(findAdmin.role !== "admin"){
            throw new Error("Not Authorised");
        } 
        else{
        if(findAdmin && isPassword){
            const refreshToken = await generateRefreshToken(findAdmin.id);
            const updateAdmin = await User.findByIdAndUpdate(findAdmin.id,{
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
                    _id:findAdmin._id,
                    firstName: findAdmin.firstName,
                    lastName: findAdmin.lastName,
                    email: findAdmin.email,
                    mobile: findAdmin.mobile,
                    token:generateToken(findAdmin.id),
                }
            })
        }else{
          throw new Error("Invalid Credentials")
        }
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

const updatePassword = asyncHandler(async(req, res)=>{
    const {id} = req.user;
    const {password} = req.body;
    console.log(password)
    validateMongodbId(id);
    const user = await User.findById(id);
    console.log(user)
    if(password){
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(req.body.password, salt);
        user.password = newPassword;
        const updatePassword = await user.save();
        res.json({
            status:"succees",
            code:1
            }
        )
    }else{
        res.json(user)
    }
    
})

const forgotPassword = asyncHandler(async(req, res)=>{
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw new Error("User not found with email")
    }
    try{
        const token = crypto.randomBytes(32).toString("hex");
        user.passwordResetToken = crypto.createHash("SHA256").update(token).digest("hex")
        user.passwordResetExpires = Date.now() + 30*60*1000;
        await user.save();
        const resetURL = `Hi, please follow this link to reset your password. This link <a href='http://localhost:3000/comfirm-password/${token}'>Click me </a>`
        const data ={
            to:email,
            text:"hey you",
            subject:"Forgot password Link",
            html:resetURL,
        }
        sendEmail(data);
        res.json({
            status:"success",
            code:"1"
        })
    }catch(err){
        throw new Error(err)
    }
})

const resetPassword = asyncHandler(async(req, res)=>{
    const {password} = req.body;
    const {token} = req.params;
    const hashToken = crypto.createHash("SHA256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken:hashToken,
        passwordResetExpires:{$gt:Date.now()}
    })
    if(!user){
        throw new Error("token expired, please try again later");
    }
    if(password){
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(req.body.password, salt);
        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.passwordChangedAt = Date.now();
    }
    await user.save();
    res.json(
        {
            status:"success",
            code:'1'
        }
    )
})

const getWishlist = asyncHandler(async(req, res)=>{
    const {id} = req.user;
    try{
        const user = await User.findById(id).populate("wishlist");
        res.json({
            status:"success",
            code:1,
            data:user
        })
    }catch(err){
        throw new Error (err)
    }
})

const updateAddress = asyncHandler(async(req, res)=>{
    const {id} = req.user;
    validateMongodbId(id)
    try{
        const user = await User.findByIdAndUpdate(
            id,
            {
                address:req.body?.address
            },
            {
                new:true
            }
        )
        res.json({
            status:"success",
            code:1,
            data:user
        })
    }catch(err){
        throw new Error (err)
    }
})

const addCart = asyncHandler(async(req, res)=>{
   const {cart} = req.body;
   console.log(cart)
   const {id} = req.user;
   validateMongodbId(id);
   try {
    let products = [];
    const user = await User.findById(id);
    const alreadyExistCart = await Cart.findOne({orderby:user.id});
    if(alreadyExistCart){
        alreadyExistCart.remove();
    }

    for(let i = 0; i < cart.length; i++){
        let object = {};
        object.product = cart[i].id;
        object.count = cart[i].count;
        object.color = cart[i].color;
        let getPrice = await Product.findById(cart[i].id).select("price").exec();
        object.price = getPrice.price
        products.push(object)
    }
   let cartTotal = 0;
   for(let i = 0; i < products.length; i++){
    cartTotal = cartTotal + products[i].price * products[i].count;
   }
   let newCart = await new Cart({
    products,
    cartTotal,
    orderby:user?.id
   }).save();
   res.json({
    status:"success",
    code:1,
    data:newCart
   })
   } catch (error) {
    throw new Error(error)
   }
})

const getCart = asyncHandler(async(req, res)=>{
    const {id} = req.user;
    validateMongodbId(id);
    try {
        const cart = await Cart.findOne({orderby:id}).populate("products.product");
        res.json({
            status:"success",
            code:1,
            data:cart
        })
    } catch (error) {
        throw new Error(error)
    }
})

const emptyCart = asyncHandler(async(req, res)=>{
    const {id} = req.user;
    validateMongodbId(id);
    try {
        const user = await User.findOne(id)
        const cart = await Cart.findByIdAndRemove({orderby:user.id})
        res.json({
            status:"success",
            code:1,
            data:cart
        })
    } catch (error) {
        throw new Error(error)
    }
})

const applyCoupon = asyncHandler(async(req, res)=>{
    const {coupon} = req.body;
    const {_id} = req.user;
    validateMongodbId(_id);
    const validCoupon = await Coupon.findOne({name:coupon});
    if(validCoupon === null){
        throw new Error("Invalid Coupon");
    }
    const user = await User.findOne({_id});
    let {cartTotal} = await Cart.findOne({
        orderby:user._id
    }).populate("products.product");
    let totalAfterDiscount = (
        cartTotal-(cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    console.log(totalAfterDiscount)
    await Cart.findOneAndUpdate(
        {
            orderby:user._id
        },
        {
            totalAfterDiscount
        },
        {
            new:true
        }
    )
    res.json(totalAfterDiscount)
})

const createOrder = asyncHandler(async (req, res)=>{
    const {COD, couponApplied} = req.body;
    const {_id} = req.user;
    validateMongodbId(_id);
    try {
        if(!COD){
            throw new Error("Create cash order failed");
        }
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({orderby:user._id});
        let finalAmout = 0;
        if(couponApplied && userCart.totalAfterDiscount){
            finalAmout = userCart.totalAfterDiscount;
        }else{
            finalAmout = userCart.cartTotal;
        }
        let newOrder = await new Order({
            products:userCart.products,
            paymentIntent:{
                id:uniqid(),
                method:"COD",
                amout:finalAmout,
                status:"Cash on Delivery",
                created:Date.now(),
                currency:"usd"
            },
            orderby:user.id,
            orderStatus:"Cash on Delivery"
        }).save();
        let update = userCart.products.map((item)=>{
            return{
                updateOne:{
                    filter:{_id:item.product._id},
                    update:{$inc:{quantity:-item.count,sold:+item.count}}
                },
            }
        })
        const updated = await Product.bulkWrite(update,{});
        res.json({
            message:"success",
            code:1
        })
    } catch (error) {
        throw new Error(error)
    }
})

const getOrder = asyncHandler(async (req, res)=>{
    const {_id} = req.user;
    validateMongodbId(_id);
    console.log(_id)
    try {
       const userOrder = await Order.find({orderby:_id})
       .populate("products.product")
       .exec();
       res.json({
        message:"success",
        code:1,
        data:userOrder
       })
    } catch (error) {
        throw new Error(error)
    }
})

const getOrders = asyncHandler(async (req, res)=>{
    try {
       const userOrder = await Order.find()
       .populate("products.product")
       .populate("orderby")
     
       res.json({
        message:"success",
        code:1,
        data:userOrder
       })
    } catch (error) {
        throw new Error(error)
    }
})

const updateOrderStatus = asyncHandler(async (req, res)=>{
    const {status} = req.body;
    const {id} = req.params;
    validateMongodbId(id)
    console.log(status)
    const findOrder = await Order.findByIdAndUpdate(
        id,
        {
            orderStatus:status,
        },
        {
            new:true,
        }
    )
    res.json({
        message:"success",
        code:1,
        data:findOrder
       })
})

module.exports = {createUser,createOrder,getOrder, loginUser,getAllUser,getUserById,deleteUser,updateOrderStatus,
    updateUser,unblockUser, blockUser, handlerRefreshToken,logoutUser,updatePassword,
    forgotPassword,resetPassword,loginAdmin,emptyCart,getWishlist,updateAddress,addCart,getCart,applyCoupon,getOrders}