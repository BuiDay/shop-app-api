const Blog = require("../models/blogModel")
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId.js');
const User = require("../models/userModel")

const createBlog = asyncHandler(async(req, res)=>{
    try{
        const newBlog = await Blog.create(req.body);
        res.json({
            status:"success",
            code:1,
            newBlog,
        })
    }catch(err){
        throw new Error(err);
    }
})

const updateBlog = asyncHandler(async(req, res)=>{
    const {id} = req.params
    validateMongodbId(id)
    try{
        const updateBlog = await Blog.findByIdAndUpdate(id,req.body,{new:true})
        res.json({
            status:"success",
            updateBlog,
        })
    }catch(err){
        throw new Error(err);
    }
})

const getBlog = asyncHandler(async(req, res)=>{
    const {id} = req.params
    validateMongodbId(id)
    try{
        const getBlog = await Blog.findById(id)
            .populate("likes")
            .populate("dislikes")
        const updateBlog = await Blog.findByIdAndUpdate(
            id,
            {
                $inc:{numViews:1},
            },{
                new:true,
            }
        )
        res.json({
            status:"success",
            code:1,
            getBlog,
        })
    }catch(err){
        throw new Error(err);
    }
})

const getAllBlog = asyncHandler(async(req, res)=>{
    try{
        const getAllBlog = await Blog.find()
        res.json({
            status:"success",
            code:1,
            getAllBlog,
        })
    }catch(err){
        throw new Error(err);
    }
})

const deleteBlog = asyncHandler(async(req, res)=>{
    const {id} = req.params
    validateMongodbId(id)
    try{
        const deleteBlog = await Blog.findByIdAndDelete(id)
        res.json({
            status:"success",
            code:1,
        })
    }catch(err){
        throw new Error(err);
    }
})

const likeBlog = asyncHandler(async(req, res)=>{
    const {blogId} = req.body
    validateMongodbId(blogId);

    const blog = await Blog.findById(blogId);
    const loginUserId = req?.user?.id;
    const isLiked = blog?.isLiked;
    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    if(alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull:{dislikes:loginUserId},
                isDisliked:false,
            },{
                new:true
            }
        )
        res.json(blog)
    }
    if(isLiked){
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull:{likes:loginUserId},
                isLiked:false,
            },{
                new:true
            }
        )
        res.json(blog)
    }else{
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull:{likes:loginUserId},
                isLiked:true,
            },{
                new:true
            }
        )
        res.json(blog)
    }
})

const dislikeBlog = asyncHandler(async(req, res)=>{
    const {blogId} = req.body
    validateMongodbId(blogId);

    const blog = await Blog.findById(blogId);
    const loginUserId = req?.user?.id;
    const isDisliked = blog?.isDisliked;
    const alreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    if(alreadyLiked){
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull:{likes:loginUserId},
                isLiked:false,
            },{
                new:true
            }
        )
        res.json(blog)
    }
    if(isDisliked){
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull:{dislikes:loginUserId},
                isDisliked:false,
            },{
                new:true
            }
        )
        res.json(blog)
    }else{
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull:{dislikes:loginUserId},
                isDisliked:true,
            },{
                new:true
            }
        )
        res.json(blog)
    }
})


module.exports = {createBlog,updateBlog,getBlog,getAllBlog,deleteBlog,likeBlog,dislikeBlog}