const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    billCode: { type: String, required: true, unique: true }, // Mã hóa đơn
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Thông tin khách hàng
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    }, // Liên kết với đơn hàng
    totalItemPrice: { type: Number, required: true }, // Tổng tiền hàng
    shippingFee: { type: Number, required: true, default: 30000 }, // Phí vận chuyển
    totalBill: { type: Number, required: true }, // Tổng hóa đơn
    paymentStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status", // Trạng thái thanh toán (liên kết đến StatusModel)
      required: true,
    },
    paymentDate: { type: Date }, // Ngày thanh toán (nếu có)
    note: { type: String }, // Ghi chú hóa đơn
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
