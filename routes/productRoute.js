const express = require('express');
const router = express.Router();
const { authMiddleware,isAdmin} = require("../middlewares/authMiddleware.js");
const { uploadPhoto,productImageResize} = require("../middlewares/uploadImages");
const {createProduct,uploadImage,getProduct,getAllProducts,updateProduct,deleteProduct,addToWishlist,rating} = require('../controller/productController.js')

router.put(
    '/upload/:id',authMiddleware,isAdmin,
    uploadPhoto.array("images",10),
    productImageResize,
    uploadImage
);
router.post('/',authMiddleware,isAdmin,createProduct);
router.put("/id=:id",authMiddleware,updateProduct)
router.put("/wishlist",authMiddleware,addToWishlist)
router.put("/rating",authMiddleware,rating)
router.get('/id=:id',getProduct);
router.delete('/id=:id',authMiddleware,isAdmin,deleteProduct);
router.get('/',getAllProducts);


module.exports= router
