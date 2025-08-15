const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "discount", // Tên folder trên Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "gif"], // Định dạng cho phép
  },
});
const uploadCloudinary = multer({ storage });
module.exports = uploadCloudinary