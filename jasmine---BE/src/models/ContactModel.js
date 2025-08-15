const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    contactCode: {
      type: String,
      required: true,
      unique: true, // Mã liên lạc duy nhất
    },
    contactName: {
      type: String,
      required: true, // Tên liên lạc
    },
    contactPhone: {
      type: String,
      required: true, // Số điện thoại
      unique: true, // Số điện thoại phải là duy nhất (nếu áp dụng)
    },
    contactEmail: {
      type: String,
      required: true, // Email liên hệ
      unique: true, // Email phải duy nhất (nếu áp dụng)
    },
    contactAddress: {
      type: String,
      required: true, // Địa chỉ liên lạc
    },
    contactImage: {
      type: String, // URL hình ảnh (nếu có)
      required: false,
    },
    contactType: {
      type: String, // Loại liên lạc (ví dụ: Hỗ trợ, Quản lý, Kỹ thuật)
      required: false,
      default: "General", // Mặc định là "General" nếu không chỉ định
    },
    isActive: {
      type: Boolean,
      default: true, // Trạng thái hoạt động của liên lạc
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
