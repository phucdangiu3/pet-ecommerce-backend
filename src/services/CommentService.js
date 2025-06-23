const mongoose = require("mongoose");
const Comment = require("../models/CommentModel");

// Create comment
const createComment = (newComment) => {
  return new Promise(async (resolve, reject) => {
    try {
      const createdComment = await Comment.create({
        content: newComment.content,
        productId: new mongoose.Types.ObjectId(newComment.productId),
        userId: new mongoose.Types.ObjectId(newComment.userId),
        images: newComment.images, // Store image paths
        rating: newComment.rating, // Store rating
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

// Get details of a single comment
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
const updateComment = (id, updateData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        {
          $set: {
            content: updateData.content,
            rating: updateData.rating,
            images: updateData.images || [],
          },
        },
        { new: true }
      );

      if (!updatedComment) {
        return resolve({
          status: "ERR",
          message: "Không tìm thấy bình luận để cập nhật",
        });
      }

      resolve({
        status: "OK",
        message: "Cập nhật bình luận thành công",
        data: updatedComment,
      });
    } catch (e) {
      reject(e);
    }
  });
};

//// Get all comments (Không lọc theo productId)
const getAllComment = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const comments = await Comment.find(); // Lấy tất cả bình luận mà không cần điều kiện lọc
      resolve({
        status: "OK",
        message: "Success",
        data: comments,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Delete comment
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
  updateComment,
  getAllComment, // Add the getAllComments function here
  deleteComment,
};
