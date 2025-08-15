const mongoose = require("mongoose");

const introduceSchema = new mongoose.Schema(
  {
    introduceCode: {
      type: String,
      required: true,
      unique: true, // Mã giới thiệu duy nhất
    },
    introduceName: {
      type: String,
      required: true, // Tên giới thiệu
    },
    introduceTitle: {
      type: String,
      required: true, // Tiêu đề của giới thiệu
    },
    introduceContent: {
      type: String,
      required: true, // Nội dung chi tiết
    },
    introduceImage: {
      type: String,
      required: false, // Hình ảnh đại diện, không bắt buộc
    },
    // introduceAuthor: {
    //   type: String,
    //   required: false, // Tên tác giả, nếu có
    // },
    // introduceTags: [
    //   {
    //     type: String, // Các từ khóa hoặc thể loại liên quan đến giới thiệu
    //     required: false,
    //   },
    // ],
    isActive: {
      type: Boolean,
      default: true, // Trạng thái hiển thị (mặc định là active)
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Introduce = mongoose.model("Introduce", introduceSchema);
module.exports = Introduce;
