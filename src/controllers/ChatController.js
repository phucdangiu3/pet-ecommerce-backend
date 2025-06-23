const ChatService = require("../services/ChatService");

// Gửi tin nhắn
const sendMessage = async (req, res) => {
  const { from, to, text } = req.body;
  const saved = await ChatService.saveMessage({ from, to, text });
  res.status(200).json({ status: "OK", data: saved });
};

// Lấy tin nhắn giữa 2 người (Admin/User đều dùng được)
const getUserConversations = async (req, res) => {
  const { id } = req.params; // id là đối tượng đối thoại với
  const from = req.userId;

  const messages = await ChatService.getMessagesBetween(from, id);
  res.status(200).json({ status: "OK", data: messages });
};

// ✅ LẤY DANH SÁCH USER ĐÃ TỪNG NHẮN (Admin dùng)
const getAllChatUsers = async (req, res) => {
  const users = await ChatService.getAllChatUsers();
  res.status(200).json({ status: "OK", data: users });
};

module.exports = {
  sendMessage,
  getUserConversations,
  getAllChatUsers,
};
