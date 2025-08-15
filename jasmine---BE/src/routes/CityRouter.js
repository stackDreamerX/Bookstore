const express = require("express");
const router = express.Router();
const cityController = require("../controllers/CityController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/create-city", cityController.createCity);
router.put("/update-city/:id", authMiddleware, cityController.updateCity);
router.delete("/delete-city/:id", authMiddleware, cityController.deleteCity);
router.get("/get-detail-city/:id", cityController.getDetailsCity);
router.get("/get-all-city", cityController.getAllCity);

module.exports = router;
