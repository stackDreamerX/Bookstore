const express = require("express");
const router = express.Router();
const discountController = require("../controllers/DiscountController");
const { authMiddleware } = require("../middleware/authMiddleware");
const uploadCloudinary = require("../Helper/DiscountUploadCloudinary")
// Routes chính
router.post("/create-discount", authMiddleware,uploadCloudinary.single('discountImage'), discountController.createDiscount);
router.put("/update-discount/:id", authMiddleware,uploadCloudinary.single('discountImage'),  discountController.updateDiscount);
router.delete("/delete-discount/:id", authMiddleware, discountController.deleteDiscount);
router.get("/get-details/:id", discountController.getDetailsDiscount);
router.get("/get-all-discount", discountController.getAllDiscount);

// Các routes bổ sung
router.post("/apply-discount", authMiddleware, discountController.applyDiscount);
router.post("/validate-discount", discountController.validateDiscount);
router.get("/user-discounts", authMiddleware, discountController.getUserDiscounts);
router.patch("/toggle-status/:id", authMiddleware, discountController.toggleDiscountStatus);

module.exports = router;
