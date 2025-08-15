const express = require("express");
const router = express.Router();
const districtController = require("../controllers/DistrictController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/create-district", authMiddleware, districtController.createDistrict);
router.put("/update-district/:id", authMiddleware, districtController.updateDistrict);
router.delete("/delete-district/:id", authMiddleware, districtController.deleteDistrict);
router.get("/get-detail-district/:id", districtController.getDetailsDistrict);
router.get("/get-all-district", districtController.getAllDistrict);

module.exports = router;
