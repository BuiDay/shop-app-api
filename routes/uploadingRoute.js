const {uploadImage,deleteImage} = require('../controller/uploadController')
const express = require('express');
const router = express.Router();
const { authMiddleware,isAdmin} = require("../middlewares/authMiddleware.js");
const { uploadPhoto,productImageResize} = require("../middlewares/uploadImages");

router.put(
    '/',
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images",10),
    productImageResize,
    uploadImage
);

router.delete("/delete-img/:id",authMiddleware,isAdmin,deleteImage)


module.exports= router