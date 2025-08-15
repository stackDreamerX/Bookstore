const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");

router.post("/sign-up", userController.createUser);
router.post("/log-in", userController.loginUser);
router.post("/log-out", userController.logoutUser);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.put("/change-password", authUserMiddleware, userController.changePassword);
router.put("/update-avatar", userController.updateAvatar);
router.put("/update-user/:id",authUserMiddleware, userController.updateUser);
router.delete("/delete-user/:id", authMiddleware, userController.deleteUser); //xoá user
router.get("/get-all-user", authMiddleware, userController.getAllUser); //lấy info user cho admin
router.get("/get-detail-user/:id", authUserMiddleware, userController.getDetailsUser); //lấy info user cho user
router.post("/refresh-token", userController.refreshToken); //cấp access token mới sau khi token cũ hết hạn dựa vào refresh token
router.put("/update-role/:id", authMiddleware, userController.updateUserRole);
router.get("/order-history", authUserMiddleware, userController.getOrderHistory);
router.get("/order-details/:orderId", authUserMiddleware, userController.getOrderDetails);
router.get("/news", userController.getAllNews);
router.get("/introduce", userController.getIntroduce);

module.exports = router;
