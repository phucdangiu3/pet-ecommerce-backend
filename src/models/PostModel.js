const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String, // Mô tả ngắn hiển thị ở danh sách
  image: { type: String, required: true },
  content: { type: String, required: true }, // HTML đầy đủ
  tags: [String],
  publishedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
