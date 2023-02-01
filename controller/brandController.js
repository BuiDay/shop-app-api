const Brand = require("../models/brandModel")
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId.js');


const createBrand = asyncHandler(async(req, res)=>{
    try{
        const newBrand = await Brand.create(req.body);
        res.json({
            status:"success",
            code:1,
            newBrand,
        })
    }catch(err){
        throw new Error(err);
    }
})

const updateBrand = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const update = await Brand.findByIdAndUpdate(id,req.body,{new:true})
        res.json({
            status:"success",
            code:1,
            update,
        })
    }catch(err){
        throw new Error(err);
    }
})

const deleteBrand = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const deleteBrand = await Brand.findByIdAndDelete(id);
        res.json({
            status:"success",
            code:1,
        })
    }catch(err){
        throw new Error(err);
    }
})

const getaBrand = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const getA = await Brand.findById(id)
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


const getAllBrand= asyncHandler(async(req, res)=>{
    try{
        const getAll = await Brand.find()
        res.json({
            status:"success",
            code:1,
            data:getAll,
        })
    }catch(err){
        throw new Error(err);
    }
})


module.exports = {createBrand, updateBrand, deleteBrand,getAllBrand,getaBrand}