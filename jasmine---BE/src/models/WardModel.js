const mongoose = require("mongoose");

const wardSchema = new mongoose.Schema(
  {
    wardCode: { type: String, required: true, unique: true },
    wardName: { type: String, required: true },
    districtCode: {
      type: mongoose.Schema.Types.String,
      ref: "District", // Liên kết với model District
      required: true,
    },
  },
  {
    timestamps: true, // Thêm createdAt và updatedAt tự động
  }
);

const Ward = mongoose.model("Ward", wardSchema);
module.exports = Ward;
