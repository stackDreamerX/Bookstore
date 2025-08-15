const express = require("express");
const router = express.Router();
const blogController = require("../controllers/BlogController");
const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");
const uploadCloudinary = require("../Helper/UploadCloudinary");

// Blog management routes - Admin
router.post("/create-blog", authMiddleware, uploadCloudinary.single('blogImage'), blogController.createBlog);
router.put("/update-blog/:id", authMiddleware, uploadCloudinary.single('blogImage'), blogController.updateBlog);
router.delete("/delete-blog/:id", authMiddleware, blogController.deleteBlog);
router.patch("/update-status-blog/:id", authMiddleware, blogController.updateStatusBlog);
router.get("/check-status-blog/:id", authMiddleware, blogController.checkBlogStatus);

// Public routes - Available to all users
router.get("/get-detail-blog/:id", blogController.getDetailsBlog);
router.get("/get-all-blogs", blogController.getAllBlogs);

// Comment routes
router.post("/add-comment", authUserMiddleware, blogController.addComment);
router.get("/get-blog-comments/:id", blogController.getBlogComments);

module.exports = router;