const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: String,
    sender: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    msgByUserId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    }, // This is the field causing the error
  },
  { timestamps: true }
);
const conversationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("Message", messageSchema);
const ConversationModel = mongoose.model("Conversation", conversationSchema);

module.exports = {
  MessageModel,
  ConversationModel,
};
