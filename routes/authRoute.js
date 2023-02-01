const express = require("express");
const router =express.Router();
const {createUser,loginUser, getAllUser,getUserById,deleteUser,updateUser,unblockUser,blockUser,handlerRefreshToken,logoutUser,updatePassword,forgotPassword,resetPassword} = require('../controller/userController.js');
const { authMiddleware,isAdmin} = require("../middlewares/authMiddleware.js");

router.post('/register',createUser);
router.post('/login',loginUser);
router.get('/logout',logoutUser)
router.get('/get-all-user',getAllUser);
router.get(`/?id=:id`,authMiddleware, isAdmin,getUserById);
router.delete(`/?id=:id`,deleteUser);
router.put(`/update-user`,authMiddleware ,updateUser);
router.put(`/block-user/id=:id`,authMiddleware,isAdmin ,blockUser);
router.put(`/unblock-user/id=:id`,authMiddleware,isAdmin ,unblockUser);
router.get('/refresh',handlerRefreshToken);
router.put('/password',authMiddleware,updatePassword);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:token",resetPassword);

module.exports = router