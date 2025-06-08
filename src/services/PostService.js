const Post = require("../models/PostModel");

const createPost = async (postData) => {
  const { title, description, content, image, tags } = postData;

  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-");

  const existing = await Post.findOne({ slug });
  if (existing) {
    throw new Error("Slug already exists. Please change the title.");
  }

  const newPost = await Post.create({
    slug,
    title,
    description,
    content,
    image,
    tags,
  });

  return newPost;
};

const getPostBySlug = async (slug) => {
  const post = await Post.findOne({ slug });
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
};

const getAllPosts = async () => {
  return await Post.find().sort({ publishedAt: -1 });
};
const updatePost = async (id, updateData) => {
  const post = await Post.findById(id);
  if (!post) throw new Error("Post not found");

  // Nếu muốn cập nhật tiêu đề => cần cập nhật slug mới
  if (updateData.title && updateData.title !== post.title) {
    const newSlug = updateData.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-");

    // Kiểm tra trùng slug mới
    const existing = await Post.findOne({ slug: newSlug, _id: { $ne: id } });
    if (existing) throw new Error("Slug for new title already exists");

    updateData.slug = newSlug;
  }

  // Cập nhật các trường
  Object.assign(post, updateData);

  await post.save();

  return post;
};

// Xóa bài viết theo id
const deletePost = async (id) => {
  const post = await Post.findById(id);
  if (!post) throw new Error("Post not found");

  await Post.deleteOne({ _id: id });
  return { message: "Post deleted successfully" };
};
module.exports = {
  createPost,
  getPostBySlug,
  getAllPosts,
  updatePost,
  deletePost,
};
