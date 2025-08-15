const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    storeCode: {
      type: String,
      required: true,
      unique: true, // Mã cửa hàng duy nhất
    },
    storeName: {
      type: String,
      required: true, // Tên cửa hàng
    },
    storePhone: {
      type: String,
      required: true, // Số điện thoại
      unique: true, // Không được trùng
    },
    storeEmail: {
      type: String,
      required: true, // Email liên hệ
      unique: true, // Không được trùng
    },
    storeAddress: {
      ward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ward", // Liên kết đến model Ward
        required: true,
      },
      district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "District", // Liên kết đến model District
        required: true,
      },
      city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City", // Liên kết đến model City
        required: true,
      },
    },
    storeLogo: {
      type: String, // URL logo
      required: false,
    },
    storeType: {
      type: String, // Loại cửa hàng (ví dụ: chính, chi nhánh)
      default: "Main", // Mặc định là cửa hàng chính
    },
    isActive: {
      type: Boolean,
      default: true, // Trạng thái hoạt động của cửa hàng
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Store = mongoose.model("Store", storeSchema);
module.exports = Store;
