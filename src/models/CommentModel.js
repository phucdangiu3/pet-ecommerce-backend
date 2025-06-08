const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [{ type: String }],
    rating: { type: Number, min: 1, max: 5, required: true }, // Rating from 1 to 5
  },
  { timestamps: true } // Add createdAt and updatedAt
);

module.exports = mongoose.model("Comment", CommentSchema);
