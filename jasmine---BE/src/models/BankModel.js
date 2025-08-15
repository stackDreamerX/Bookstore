const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema(
  {
    bankCode: { type: String, required: true, unique: true },
    bankName: { type: String, required: true },
    bankBranch: {
      type: String,
      required: false, // Chi nhánh ngân hàng
    },
    bankLogo: {
      type: String, // URL hoặc tên file của logo
      required: false, // Không bắt buộc
    },
    isActive: {
      type: Boolean,
      default: true, // Mặc định là hoạt động
    },
  },
  {
    timestamps: true,
  }
);

// Middleware tự động chuyển mã ngân hàng thành chữ hoa
bankSchema.pre("save", function (next) {
  this.bankCode = this.bankCode.toUpperCase();
  next();
});

const Bank = mongoose.model("bank", bankSchema);
module.exports = Bank;
