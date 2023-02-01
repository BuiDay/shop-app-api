const express = require('express');
const router = express.Router();
const { authMiddleware,isAdmin} = require("../middlewares/authMiddleware.js");
const {createBrand, updateBrand, deleteBrand,getAllBrand,getaBrand} = require('../controller/brandController.js')

router.post('/',authMiddleware,isAdmin,createBrand);
router.put('/:id',authMiddleware,isAdmin,updateBrand);
router.delete('/:id',authMiddleware,isAdmin,deleteBrand);
router.get('/:id',getaBrand);
router.get('/',getAllBrand);

module.exports= router