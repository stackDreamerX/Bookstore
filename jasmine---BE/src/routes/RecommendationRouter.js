const express = require("express");
const router = express.Router();
const {
  getRecommendations,
} = require("../controllers/RecommendationController");

router.get("/get-recommend/:userId", getRecommendations);

module.exports = router;
