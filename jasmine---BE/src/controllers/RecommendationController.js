const mongoose = require("mongoose");
const { recommend } = require("../services/RecommendationService");

const getRecommendations = async (req, res) => {
  console.log("Request nhận được:", req.params); // Kiểm tra req.params
  // console.log("Full request:", req); // Kiểm tra toàn bộ request
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ error: "Thiếu userId" });

    const productIds = await recommend(userId);
    if (!productIds || productIds.length === 0) {
      console.log("Recommended product IDs:", productIds);
      return res.json([]); // Trả về mảng rỗng thay vì lỗi
    }

    const products = await mongoose
      .model("Product")
      .find({ _id: { $in: productIds } });
    res.json(products);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm khuyến nghị:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getRecommendations };
