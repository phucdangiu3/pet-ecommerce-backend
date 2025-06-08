const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");

router.post("/create", PostController.createPost);
router.get("/get-all", PostController.getAllPosts);
router.get("/get-details/:slug", PostController.getPostDetail);
router.put("/update/:id", PostController.updatePost);
router.delete("/delete/:id", PostController.deletePost);

module.exports = router;
