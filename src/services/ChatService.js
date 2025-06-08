// services/chatservice.js
const { MessageModel, ConversationModel } = require("../models/ChatModel");
const createMessage = async (data) => {
  // Kiểm tra và đảm bảo sender và receiver không bị thiếu
  if (!data.sender || !data.receiver) {
    throw new Error("Sender or receiver is missing");
  }

  let conversation = await ConversationModel.findOne({
    $or: [
      { sender: data.sender, receiver: data.receiver },
      { sender: data.receiver, receiver: data.sender },
    ],
  });

  // Nếu không có cuộc trò chuyện, tạo mới
  if (!conversation) {
    conversation = new ConversationModel({
      sender: data.sender,
      receiver: data.receiver,
    });
    await conversation.save();
  }

  // Tạo tin nhắn mới
  const message = new MessageModel({
    text: data.text,
    sender: data.sender,
    receiver: data.receiver,
    msgByUserId: data.sender, // Người gửi tin nhắn
  });

  try {
    const savedMessage = await message.save();

    // Thêm tin nhắn vào cuộc trò chuyện
    conversation.messages.push(savedMessage._id);
    await conversation.save();

    return savedMessage;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};

const getConversation = async (currentUserId) => {
  const conversations = await ConversationModel.find({
    $or: [{ sender: currentUserId }, { receiver: currentUserId }],
  })
    .sort({ updatedAt: -1 })
    .populate("messages")
    .populate("sender")
    .populate("receiver");

  return conversations.map((conv) => {
    const countUnseenMsg = conv.messages.reduce((prev, curr) => {
      if (curr.msgByUserId.toString() !== currentUserId && !curr.seen) {
        return prev + 1;
      }
      return prev;
    }, 0);

    return {
      _id: conv._id,
      sender: conv.sender,
      receiver: conv.receiver,
      unseenMsg: countUnseenMsg,
      lastMsg: conv.messages[conv.messages.length - 1],
    };
  });
};

const markMessagesAsSeen = async (userId, msgByUserId) => {
  const conversation = await ConversationModel.findOne({
    $or: [
      { sender: userId, receiver: msgByUserId },
      { sender: msgByUserId, receiver: userId },
    ],
  });

  const messageIds = conversation?.messages || [];

  await MessageModel.updateMany(
    { _id: { $in: messageIds }, msgByUserId: msgByUserId },
    { $set: { seen: true } }
  );

  return getConversation(userId);
};

module.exports = { createMessage, getConversation, markMessagesAsSeen };
