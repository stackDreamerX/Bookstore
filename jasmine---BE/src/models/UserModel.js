const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    familyName: { type: String, required: true },
    userName: { type: String, required: true },
    userPhone: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true },
    userPassword: { type: String, required: true },
    userConfirmPassword: { type: String, required: true },
    userAddress: { type: String, required: false }, // Địa chỉ chi tiết
    userWard: { type: String, required: false }, // Xã/Phường
    userDistrict: { type: String, required: false }, // Quận/Huyện
    userCity: { type: String, required: false }, // Tỉnh/Thành phố
    // userAddress: {
    //   address: { type: String, required: false }, // Địa chỉ chi tiết
    //   ward: { type: String, required: false }, // Xã/Phường
    //   district: { type: String, required: false }, // Quận/Huyện
    //   city: { type: String, required: false }, // Tỉnh/Thành phố
    // type: String,
    // required: false,
    // ward: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Ward", // Liên kết đến model Ward
    //   // required: true,
    //   required: false,
    // },
    // district: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "District", // Liên kết đến model District
    //   // required: true,
    //   required: false,
    // },
    // city: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "City", // Liên kết đến model City
    //   // required: true,
    //   required: false,
    // },
    // },

    userImage: { type: String, required: false },
    isAdmin: { type: Boolean, default: false, required: true },
    // userRole: {
    //   type: String,
    //   enum: ["customer", "admin", "staff"],
    //   default: "customer",
    //   required: true,
    // },
    // access_token: { type: String },
    // refresh_token: { type: String },

    // Trường OTP
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
