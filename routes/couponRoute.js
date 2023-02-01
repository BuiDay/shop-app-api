const express = require("express");
const router =express.Router();
const {createCoupon, updateCoupon,deleteCoupon,getaCoupon,getAllCoupon} = require('../controller/couponController');
const { authMiddleware,isAdmin} = require("../middlewares/authMiddleware.js");

router.post('/',createCoupon);
router.put('/:id',authMiddleware,isAdmin,updateCoupon);
router.delete('/:id',authMiddleware,isAdmin,deleteCoupon);
router.get('/:id',getaCoupon);
router.get('/',getAllCoupon);
module.exports = router