const express = require('express');
const router = express.Router();
const { authMiddleware,isAdmin} = require("../middlewares/authMiddleware.js");
const {createEnquiry,getEnquiry} = require('../controller/enqController.js')

router.post('/',authMiddleware,isAdmin,createEnquiry);
router.get('/',authMiddleware,isAdmin,getEnquiry);

module.exports= router