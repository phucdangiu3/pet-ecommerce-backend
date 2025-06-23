const Chat = require("../models/ChatModel");

const saveMessage = async ({ from, to, text }) => {
  const message = new Chat({ from, to, text });
  return await message.save();
};

const getMessagesBetween = async (user1, user2) => {
  return await Chat.find({
    $or: [
      { from: user1, to: user2 },
      { from: user2, to: user1 },
    ],
  }).sort({ timestamp: 1 });
};

// ✅ Lấy danh sách user đã nhắn với admin
const getAllChatUsers = async () => {
  const messages = await Chat.find({ to: "admin" }).distinct("from");
  return messages;
};

module.exports = {
  saveMessage,
  getMessagesBetween,
  getAllChatUsers,
};
