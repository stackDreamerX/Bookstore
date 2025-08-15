const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema(
  {
    productImage: {
        type: String,
        //required: true,
        unique: true, // Mã thanh toán duy nhất
      },
  },)
  const productImage = mongoose.model("productImage", productImageSchema); // Đặt tên đúng cho model
  module.exports = productImage;