const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/CategoryController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/create-category", categoryController.createCategory);
router.put("/update-category/:id", categoryController.updateCategory);
router.delete("/delete-category/:id", categoryController.deleteCategory);
router.get("/get-detail-category/:id", categoryController.getDetailsCategory);
router.get("/get-all-category", categoryController.getAllCategory);

module.exports = router;
