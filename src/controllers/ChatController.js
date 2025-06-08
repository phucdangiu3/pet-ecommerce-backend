// controllers/chatcontroller.js
const ChatService = require("../services/ChatService");

// Controller for sending a new message
const sendMessage = async (req, res) => {
  const { sender, receiver, text, imageUrl, videoUrl, msgByUserId } = req.body;

  try {
    const newMessage = await ChatService.createMessage({
      sender,
      receiver,
      text,
      imageUrl,
      videoUrl,
      msgByUserId,
    });
    res.status(200).json(newMessage);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
};

// Controller for getting the conversation for the user
const getUserConversations = async (req, res) => {
  const { userId } = req.params;

  try {
    const conversations = await ChatService.getConversation(userId);
    res.status(200).json(conversations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching conversations", error: error.message });
  }
};

// Controller for marking messages as seen
const markAsSeen = async (req, res) => {
  const { userId, msgByUserId } = req.body;

  try {
    const updatedConversations = await ChatService.markMessagesAsSeen(
      userId,
      msgByUserId
    );
    res.status(200).json(updatedConversations);
  } catch (error) {
    res.status(500).json({
      message: "Error marking messages as seen",
      error: error.message,
    });
  }
};

module.exports = { sendMessage, getUserConversations, markAsSeen };
