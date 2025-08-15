const express = require("express");
const router = express.Router();
const wardController = require("../controllers/WardController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/create-ward", authMiddleware, wardController.createWard);
router.put("/update-ward/:id", authMiddleware, wardController.updateWard);
router.delete("/delete-ward/:id", authMiddleware, wardController.deleteWard);
router.get("/get-detail-ward/:id", wardController.getDetailsWard);
router.get("/get-all-ward", wardController.getAllWard);

module.exports = router;
