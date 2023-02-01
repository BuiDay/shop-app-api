const express = require('express');
const {createProduct,uploadImages,getProduct,getAllProducts,updateProduct,deleteProduct,addToWishlist,rating} = require('../controller/productController.js')
const router = express.Router();
const { authMiddleware,isAdmin} = require("../middlewares/authMiddleware.js");
const { uploadPhoto,productImageResize} = require("../middlewares/uploadImages");

router.post('/',authMiddleware,isAdmin,createProduct);
router.put("/id=:id",authMiddleware,updateProduct)
router.put("/wishlist",authMiddleware,addToWishlist)
router.put("/rating",authMiddleware,rating)
router.get('/id=:id',getProduct);
router.delete('/id=:id',authMiddleware,isAdmin,deleteProduct);
router.get('/',getAllProducts);
router.put('/upload/:id',uploadPhoto.array("images",10),productImageResize,uploadImages)

module.exports= router