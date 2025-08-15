const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    cityCode: { type: String, required: true, unique: true },
    cityName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const City = mongoose.model("City", citySchema);
module.exports = City;
