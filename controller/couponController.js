const Coupon = require("../models/couponModel")
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId.js');

const createCoupon = asyncHandler(async(req, res)=>{
    try{
        const newCoupon = await Coupon.create(req.body);
        res.json({
            status:"success",
            code:1,
            newCoupon,
        })
    }catch(err){
        throw new Error(err);
    }
})

const updateCoupon = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const update = await Coupon.findByIdAndUpdate(id,req.body,{new:true})
        res.json({
            status:"success",
            code:1,
            update,
        })
    }catch(err){
        throw new Error(err);
    }
})

const deleteCoupon = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const deleteCoupon = await Coupon.findByIdAndDelete(id);
        res.json({
            status:"success",
            code:1,
        })
    }catch(err){
        throw new Error(err);
    }
})

const getaCoupon = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const getA = await Coupon.findById(id)
        if(getA){
            res.json({
                status:"success",
                code:1,
                data:getA,
            })
        }else{
            throw new Error("Not found");
        }
       
    }catch(err){
        throw new Error(err);
    }
})

const getAllCoupon= asyncHandler(async(req, res)=>{
    try{
        const getAll = await Coupon.find()
        res.json({
            status:"success",
            code:1,
            data:getAll,
        })
    }catch(err){
        throw new Error(err);
    }
})


module.exports = {createCoupon, updateCoupon,deleteCoupon,getaCoupon,getAllCoupon}