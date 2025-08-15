const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    //productCode: { type: String, required: true },
    productName: { type: String, required: true, unique: true },
    productPrice: { type: Number, required: true },
    productImage: {type: String, require: true },
    productCategory:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "productImage",
      required: true,},
    bookFormat: { type: String, enum: ['Hardcover', 'Paperback', 'Ebook'], required: true },
    author: { type: String, required: true },
    publisher: { type: String, required: true },
    publicationDate: { type: Date },
    ISBN: { type: String },
    pageCount: { type: Number },
    language: { type: String, default: 'Vietnamese' },
    productQuantity: { type: Number, default:0}, //số lượng sách
    // productExpiry: { type: Date, required: true }, //hạn sd
    // productRating: { type: Number, required: false },
    productDescription: { type: String, required: true },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
