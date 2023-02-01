const express = require('express');
const router = express.Router();
const { authMiddleware,isAdmin} = require("../middlewares/authMiddleware.js");
const {createCategory,updateCategory,deleteCategory,getAllCategory,getaCategory} = require('../controller/categoryController.js')

router.post('/',authMiddleware,isAdmin,createCategory);
router.put('/:id',authMiddleware,isAdmin,updateCategory);
router.delete('/:id',authMiddleware,isAdmin,deleteCategory);
router.get('/:id',getaCategory);
router.get('/',getAllCategory);

module.exports= router