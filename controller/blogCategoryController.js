const BlogCategory = require("../models/blogCategoryModel")
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId.js');

const createBlogCategory = asyncHandler(async(req, res)=>{
    try{
        const newBlogCategory = await BlogCategory.create(req.body);
        res.json({
            status:"success",
            code:1,
            newBlogCategory,
        })
    }catch(err){
        throw new Error(err);
    }
})

const updateBlogCategory = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const update = await BlogCategory.findByIdAndUpdate(id,req.body,{new:true})
        res.json({
            status:"success",
            code:1,
            update,
        })
    }catch(err){
        throw new Error(err);
    }
})

const deleteBlogCategory = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const deleteBlogCategory = await BlogCategory.findByIdAndDelete(id);
        res.json({
            status:"success",
            code:1,
        })
    }catch(err){
        throw new Error(err);
    }
})

const getaBlogCategory = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const getA = await BlogCategory.findById(id)
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


const getAllBlogCategory= asyncHandler(async(req, res)=>{
    try{
        const getAll = await BlogCategory.find()
        res.json({
            status:"success",
            code:1,
            data:getAll,
        })
    }catch(err){
        throw new Error(err);
    }
})


module.exports = {createBlogCategory, updateBlogCategory, deleteBlogCategory,getAllBlogCategory,getaBlogCategory}