const Product = require("../models/productModel")
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId.js');
const slugify = require('slugify');
const { query } = require("express");

const createProduct = asyncHandler(async (req, res) =>{
   try{
    if(req.body.title){
        req.body.slug = slugify(req.body.title)
    }
    const newProduct = await Product.create(req.body);
    res.json({
        code:1,
        status:"success",
        data:newProduct,
    })
   }catch(err){
    throw new Error(err)
   }
})

const updateProduct = asyncHandler(async (req, res) =>{
    const {id} = req.params;
    try{
    validateMongodbId(id);
     if(req.body.title){
         req.body.slug = slugify(req.body.title);
     }
     const newProduct = await Product.findByIdAndUpdate(id,req.body,{new:true});
     res.json({
         code:1,
         status:"success",
         data:newProduct,
     })
    }catch(err){
     throw new Error(err);
    }
 })

const deleteProduct = asyncHandler(async (req, res) =>{
    const {id} = req.params;
    try{
    validateMongodbId(id);
        const newProduct = await Product.findByIdAndDelete(id);
        if(newProduct){
            res.json({
                code:1,
                status:"success",
            })
        }else{
            throw new Error("Not found");
        }
    }catch(err){
        throw new Error(err);
    }
})

const getProduct = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    try{
        validateMongodbId(id);
        const product = await Product.findById(id);
        if(product){
            res.json({
                code:1,
                status:"success",
                data:product
            })
        }
        else{
            throw new Error("Not found");
        }
    }catch(err){
        throw new Error(err)
    }
})

const getAllProducts = asyncHandler(async(req, res)=>{
    try{
        const allProduct = await Product.find(req.query);
        if(allProduct){
            res.json({
                code:1,
                status:"success",
                data:allProduct
            })
        }
    }catch(err){
        throw new Error(err)
    }
})

module.exports = {createProduct,getProduct,getAllProducts,updateProduct,deleteProduct}