const express = require('express');
const router = express.Router();
const { authMiddleware,isAdmin} = require("../middlewares/authMiddleware.js");
const {createBlogCategory, updateBlogCategory, deleteBlogCategory,getAllBlogCategory,getaBlogCategory} = require('../controller/blogCategoryController.js')

router.post('/',authMiddleware,isAdmin,createBlogCategory);
router.put('/:id',authMiddleware,isAdmin,updateBlogCategory);
router.delete('/:id',authMiddleware,isAdmin,deleteBlogCategory);
router.get('/:id',getaBlogCategory);
router.get('/',getAllBlogCategory);

module.exports= router