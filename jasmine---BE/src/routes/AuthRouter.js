const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");

// Route quên mật khẩu
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOTP);
router.post("/reset-password", authController.resetPassword);

// Route đăng nhập bằng Google/Facebook
router.post("/login/google", authController.loginWithGoogle);
router.post("/login/facebook", authController.loginWithFacebook);

module.exports = router;