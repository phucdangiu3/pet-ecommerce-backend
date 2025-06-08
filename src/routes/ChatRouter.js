// routes/chatrouter.js
const express = require("express");
const chatController = require("../controllers/ChatController");

const router = express.Router();

// Route to send a message
router.post("/message", chatController.sendMessage);

// Route to get user conversations
router.get("/conversations/:userId", chatController.getUserConversations);

// Route to mark messages as seen
router.post("/markAsSeen", chatController.markAsSeen);

module.exports = router;
