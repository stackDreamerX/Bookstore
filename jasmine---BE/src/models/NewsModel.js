const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {

    newsTitle: {
      type: String,
      required: true,
    },
    newsContent: {
      type: String,
      required: true,
    },
    newsImage: {
      type: String,
      required: false,
    },
    // newsCategory: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Category", // Liên kết tới Category nếu có
    //   required: false,
    // },
    // newsAuthor: {
    //   type: String,
    //   required: false,
    // },
    isActive: {
      type: Boolean,
      default: true, // Trạng thái hiển thị tin tức (mặc định là active)
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const News = mongoose.model("News", newsSchema);
module.exports = News;
