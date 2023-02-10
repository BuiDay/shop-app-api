const Enquiry = require("../models/enqModel")
const asyncHandler = require('express-async-handler');


const createEnquiry = asyncHandler(async(req, res)=>{
    try{
        const newEnquiry = await Enquiry.create(req.body);
        res.json({
            status:"success",
            code:1,
            newEnquiry,
        })
    }catch(err){
        throw new Error(err);
    }
})

const getEnquiry = asyncHandler(async(req, res)=>{
    try{
        const newEnquiry = await Enquiry.find();
        res.json({
            status:"success",
            code:1,
            newEnquiry,
        })
    }catch(err){
        throw new Error(err);
    }
})



module.exports = {createEnquiry,getEnquiry}