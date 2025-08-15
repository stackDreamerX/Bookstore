const mongoose = require("mongoose");

const adminPaymentSchema = new mongoose.Schema(
  {
    adminBankName: { type: String, required: true }, // Tên ngân hàng
    adminBankNumber: { type: String, required: true }, // Số tài khoản
    adminBankImage: { type: String, required: true }, // Ảnh QR code
    isActive: { type: Boolean, default: true }, // Đánh dấu tài khoản đang hoạt động
  },
  {
    timestamps: true,
  }
);

const AdminPayment = mongoose.model("AdminPayment", adminPaymentSchema);
module.exports = AdminPayment;
