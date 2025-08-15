const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/ReviewController");
const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");

// Public routes
router.get("/product/:productId", ReviewController.getAllReviewsByProduct);

// User routes (require user authentication)
router.post("/create", authUserMiddleware, ReviewController.createReview);
router.put("/update/:id", authUserMiddleware, ReviewController.updateReview);

// Admin routes (require admin authentication)
router.get("/admin/all", authMiddleware, ReviewController.getAllReviews);
router.put("/admin/toggle-visibility/:id", authMiddleware, ReviewController.toggleReviewVisibility);
router.delete("/admin/delete/:id", authMiddleware, ReviewController.deleteReview);

module.exports = router;