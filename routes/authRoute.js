const express = require("express");
const router =express.Router();
const {createUser,loginUser, getAllUser,getUserById,deleteUser,updateUser,unblockUser,getCart,getOrders,
    blockUser,handlerRefreshToken,createOrder,updateOrderStatus,emptyCart,logoutUser,updatePassword,addCart,forgotPassword,getOrder,resetPassword,loginAdmin,getWishlist,updateAddress,applyCoupon} = require('../controller/userController.js');
const { authMiddleware,isAdmin} = require("../middlewares/authMiddleware.js");

router.post('/register',createUser);
router.post('/login',loginUser);
router.post('/login-admin',loginAdmin);
router.get('/logout',logoutUser)
router.get('/get-all-users',getAllUser);

router.get(`/id=:id`,authMiddleware, getUserById);

router.delete(`/?id=:id`,deleteUser);
router.put(`/update-user`,authMiddleware ,updateUser);
router.put(`/block-user/id=:id`,authMiddleware,isAdmin ,blockUser);
router.put(`/unblock-user/id=:id`,authMiddleware,isAdmin ,unblockUser);
router.get('/refresh',handlerRefreshToken);
router.put('/password',authMiddleware,updatePassword);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:token",resetPassword);
router.get('/wishlist',authMiddleware,getWishlist);
router.put('/address',authMiddleware,updateAddress);

router.post("/cart",authMiddleware,addCart);
router.get("/cart",authMiddleware,getCart);
router.delete("/cart",authMiddleware,emptyCart);

router.post("/cart/apply-coupon",authMiddleware,applyCoupon);
router.post("/cart/cash-order",authMiddleware,createOrder);
router.get("/order/get-order",authMiddleware,getOrder);
router.put("/order/update-order/:id",authMiddleware,isAdmin,updateOrderStatus);
router.get("/get-orders",authMiddleware,isAdmin,getOrders);


module.exports = router