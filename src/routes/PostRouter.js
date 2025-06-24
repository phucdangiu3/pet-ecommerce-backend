const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");
const {
  authAdminMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware");

router.post("/create", authAdminMiddleware, PostController.createPost);
router.get("/get-all", PostController.getAllPosts);
router.get("/get-details/:slug", PostController.getPostDetail);
router.put("/update/:id", authAdminMiddleware, PostController.updatePost);
router.delete("/delete/:id", authAdminMiddleware, PostController.deletePost);

module.exports = router;
