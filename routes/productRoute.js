const express = require('express');
const {createProduct,getProduct,getAllProducts,updateProduct,deleteProduct} = require('../controller/productController')
const router = express.Router();

router.post('/',createProduct);
router.put("/id=:id",updateProduct)
router.get('/id=:id',getProduct);
router.delete('/id=:id',deleteProduct);
router.get('/',getAllProducts);

module.exports= router