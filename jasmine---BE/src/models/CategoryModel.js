const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryCode: { type: String, required: true, unique: true },
    categoryName: { type: String, required: true },
    isActive: {
      type: Boolean,
      default: true, // Trạng thái (true: hoạt động, false: không hoạt động)
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
