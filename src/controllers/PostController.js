const PostService = require("../services/PostService");

const createPost = async (req, res) => {
  try {
    const result = await PostService.createPost(req.body);
    res.status(201).json({ status: "OK", data: result });
  } catch (error) {
    res.status(400).json({ status: "ERR", message: error.message });
  }
};

const getPostDetail = async (req, res) => {
  try {
    const result = await PostService.getPostBySlug(req.params.slug);
    res.status(200).json({ status: "OK", data: result });
  } catch (error) {
    res.status(404).json({ status: "ERR", message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const result = await PostService.getAllPosts();
    res.status(200).json({ status: "OK", data: result });
  } catch (error) {
    res.status(500).json({ status: "ERR", message: error.message });
  }
}; // Cập nhật bài viết theo id hoặc slug
const updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    const updatedPost = await PostService.updatePost(id, updateData);
    res.status(200).json({ status: "OK", data: updatedPost });
  } catch (error) {
    res.status(400).json({ status: "ERR", message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await PostService.deletePost(id);
    res.status(200).json({ status: "OK", data: result });
  } catch (error) {
    res.status(404).json({ status: "ERR", message: error.message });
  }
};
module.exports = {
  createPost,
  getPostDetail,
  getAllPosts,
  updatePost,
  deletePost,
};
