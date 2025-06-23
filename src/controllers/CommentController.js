const CommentService = require("../services/CommentService");

// Create comment
const createComment = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { content, productId, userId, rating, images } = req.body;

    if (!content || !productId || !userId || !rating) {
      return res.status(400).json({
        status: "ERR",
        message: "Content, productId, and userId are required",
      });
    }
    const response = await CommentService.createComment(req.body);

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      status: "ERR",
      message: e.message || "Unknown error occurred",
      error: e, // Return the full error for debugging
    });
  }
};
const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const updateData = req.body;

    if (!commentId) {
      return res.status(400).json({
        status: "ERR",
        message: "Comment id is required",
      });
    }

    const response = await CommentService.updateComment(commentId, updateData);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Unknown error occurred",
      error: e,
    });
  }
};

// Get details of a single comment
const getDetailsComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    if (!commentId) {
      return res.status(200).json({
        status: "ERR",
        message: "The commentId is required",
      });
    }
    const response = await CommentService.getDetailsComment(commentId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

// Get all comments
const getAllComment = async (req, res) => {
  try {
    console.log("Request to /get-all received");
    const comments = await CommentService.getAllComment(); // Lấy tất cả bình luận mà không cần điều kiện lọc
    return res.status(200).json({
      status: "OK",
      message: "Success",
      data: comments,
    });
  } catch (e) {
    console.error("Error:", e); // Log lỗi
    return res.status(404).json({
      status: "ERR",
      message: e.message || "Unknown error occurred",
      error: e,
    });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    if (!commentId) {
      return res.status(400).json({
        status: "ERR",
        message: "Comment id is required",
      });
    }

    const response = await CommentService.deleteComment(commentId);

    if (response.status === "ERR") {
      return res.status(404).json(response);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Unknown error occurred",
      error: e,
    });
  }
};

module.exports = {
  createComment,
  getDetailsComment,
  getAllComment, // Add the getAllComments function here
  deleteComment,
  updateComment,
};
