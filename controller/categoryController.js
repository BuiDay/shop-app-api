const Category = require("../models/categoryModel")
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId.js');

const createCategory = asyncHandler(async(req, res)=>{
    try{
        const newCategory = await Category.create(req.body);
        res.json({
            status:"success",
            code:1,
            newCategory,
        })
    }catch(err){
        throw new Error(err);
    }
})

const updateCategory = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const update = await Category.findByIdAndUpdate(id,req.body,{new:true})
        res.json({
            status:"success",
            code:1,
            update,
        })
    }catch(err){
        throw new Error(err);
    }
})

const deleteCategory = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const deleteCategory = await Category.findByIdAndDelete(id);
        res.json({
            status:"success",
            code:1,
        })
    }catch(err){
        throw new Error(err);
    }
})

const getaCategory = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const getA = await Category.findById(id)
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


const getAllCategory = asyncHandler(async(req, res)=>{
    try{
        const getAll = await Category.find()
        res.json({
            status:"success",
            code:1,
            data:getAll,
        })
    }catch(err){
        throw new Error(err);
    }
})


module.exports = {createCategory, updateCategory, deleteCategory,getAllCategory,getaCategory}