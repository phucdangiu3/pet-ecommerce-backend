const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");
const {
  authAdminMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware");

router.post("/create", authUserMiddleware, CommentController.createComment); // Tạo comment mới
router.get("/get-details/:id", CommentController.getDetailsComment); // Lấy danh sách comment theo postId
router.delete(
  "/delete/:id",
  authUserMiddleware,
  CommentController.deleteComment
); // Lấy danh sách comment theo postId
router.get("/get-all", CommentController.getAllComment);
router.put("/update/:id", authUserMiddleware, CommentController.updateComment);

module.exports = router;
