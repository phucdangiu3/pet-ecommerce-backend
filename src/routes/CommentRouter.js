const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");
const {
  authAdminMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware");

router.post("/create", CommentController.createComment); // Tạo comment mới
router.get("/get-details/:id", CommentController.getDetailsComment); // Lấy danh sách comment theo postId
router.delete(
  "/delete/:id",

  CommentController.deleteComment,
); // Lấy danh sách comment theo postId
router.get("/get-all", CommentController.getAllComment);
router.put("/update/:id", CommentController.updateComment);

module.exports = router;
