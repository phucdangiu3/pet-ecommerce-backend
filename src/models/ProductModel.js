const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    hoverImage: { type: String },
    images: [{ type: String }],
    type: { type: String, required: true },
    manufacturer: { type: String }, // Hãng sản xuất
    color: { type: String }, // Mảng màu sắc (vd: "Trắng", "Đen")
    tag: { type: String }, // Mảng tags (vd: "Flash Sale", "Giao Nhanh 24h")
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    description: { type: String },
    discount: { type: Number },
    selled: { type: Number },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
