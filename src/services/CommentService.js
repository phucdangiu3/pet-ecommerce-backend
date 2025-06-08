const mongoose = require("mongoose");
const Comment = require("../models/CommentModel");

const createComment = (newComment) => {
  return new Promise(async (resolve, reject) => {
    try {
      const createdComment = await Comment.create({
        content: newComment.content,
        productId: new mongoose.Types.ObjectId(newComment.productId),
        userId: new mongoose.Types.ObjectId(newComment.userId),
        images: newComment.images, // Lưu trữ đường dẫn đến ảnh
        rating: newComment.rating, // Lưu trữ điểm đánh giá
      });
      return resolve({
        status: "OK",
        message: "SUCCESS",
        data: createdComment,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsComment = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const comment = await Comment.findOne({ _id: id });

      if (!comment) {
        resolve({
          status: "ERR",
          message: "The comment is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Success",
        data: comment,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteComment = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deleted = await Comment.findByIdAndDelete(id);
      if (!deleted) {
        return resolve({
          status: "ERR",
          message: "Comment not found",
        });
      }
      resolve({
        status: "OK",
        message: "Comment deleted successfully",
        data: deleted,
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createComment,
  getDetailsComment,
  deleteComment,
};
