const express = require("express");
const router = express.Router();
const chatController = require("../controllers/ChatController");
const {
  authAdminMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware");

// Chỉ người dùng có quyền chat
router.post("/message", chatController.sendMessage);

// Lấy tin nhắn – cho Admin hoặc chính chủ
router.get("/conversations/:id", chatController.getUserConversations);
// ChatRouter.js
router.get("/users", chatController.getAllChatUsers);

module.exports = router;
