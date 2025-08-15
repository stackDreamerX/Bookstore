const mongoose = require("mongoose");

// Quận
const districtSchema = new mongoose.Schema(
  {
    districtCode: { type: String, required: true, unique: true },
    districtName: { type: String, required: true },
    cityCode: {
      type: mongoose.Schema.Types.String,
      ref: "City", // Liên kết với City
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const District = mongoose.model("District", districtSchema);
module.exports = District;
