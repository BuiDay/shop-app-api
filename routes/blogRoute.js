const express = require('express');
const router = express.Router();
const {createBlog,updateBlog,getBlog,getAllBlog,deleteBlog,likeBlog,dislikeBlog} = require('../controller/blogController')
const { authMiddleware,isAdmin} = require("../middlewares/authMiddleware.js");

router.post('/',authMiddleware,isAdmin,createBlog);
router.put('/:id',authMiddleware,isAdmin,updateBlog);
router.put('/likes',authMiddleware,likeBlog);
router.put('/dislikes',authMiddleware,dislikeBlog);
router.get('/:id',getBlog);
router.get('/',getAllBlog);
router.delete("/:id",authMiddleware,isAdmin,deleteBlog);
module.exports= router