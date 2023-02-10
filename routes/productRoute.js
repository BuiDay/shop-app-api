const express = require('express');
const router = express.Router();
const { authMiddleware,isAdmin} = require("../middlewares/authMiddleware.js");
const {createProduct,getProduct,getAllProducts,updateProduct,deleteProduct,addToWishlist,rating} = require('../controller/productController.js')

router.post('/',authMiddleware,isAdmin,createProduct);
router.put("/id=:id",authMiddleware,updateProduct)
router.put("/wishlist",authMiddleware,addToWishlist)
router.put("/rating",authMiddleware,rating)
router.get('/id=:id',getProduct);
router.delete('/id=:id',authMiddleware,isAdmin,deleteProduct);
router.get('/',getAllProducts);


module.exports= router
