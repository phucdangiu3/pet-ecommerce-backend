const express = require("express");
const router = express.Router();
const chatController = require("../controllers/ChatController");
const {
  authAdminMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware");

// Chỉ người dùng có quyền chat
router.post("/message", authUserMiddleware, chatController.sendMessage);

// Lấy tin nhắn – cho Admin hoặc chính chủ
router.get(
  "/conversations/:id",
  authUserMiddleware,
  chatController.getUserConversations
);
// ChatRouter.js
router.get("/users", authAdminMiddleware, chatController.getAllChatUsers);

module.exports = router;
