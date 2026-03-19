// app.js (hoặc server.js)
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const http = require("http"); // Create HTTP server for Socket.io
const { Server } = require("socket.io"); // ✅ fix đúng
const cookieParser = require("cookie-parser");
const { saveMessage } = require("./services/ChatService");
const { getMessagesBetween } = require("./services/ChatService");
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Tạo server HTTP và Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://pet-ecommerce-frontend.vercel.app", // hoặc vercel URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Biến toàn cục để quản lý người dùng và tin nhắn
const users = {};
const messages = {};

// 🎯 BẮT SỰ KIỆN SOCKET.IO
io.on("connection", (socket) => {
  console.log("📥 Client connected:", socket.id);

  socket.on("join", ({ userId, role }) => {
    users[userId] = socket.id;
    socket.join(userId);
    socket.role = role;
    if (!messages[userId]) messages[userId] = [];
    console.log(`🧑 ${userId} (${role}) joined`);
  });
  socket.on("sendMessage", async ({ from, to, text }) => {
    messages[to] = messages[to] || [];
    messages[to].push({ from, to, text });

    // Gửi đến người nhận nếu đang online
    if (users[to]) {
      io.to(to).emit("receiveMessage", { from, text });
    }

    // 🧠 Lưu vào MongoDB
    try {
      await saveMessage({ from, to, text });
    } catch (err) {
      console.error("❌ Lỗi khi lưu tin nhắn:", err);
    }
  });

  socket.on("getUserList", () => {
    const userList = Object.keys(users).filter((id) => id !== "admin");
    io.to(socket.id).emit("userList", userList);
  });

  socket.on("getMessages", async ({ userId }) => {
    try {
      const history = await getMessagesBetween(userId, "admin");
      socket.emit("chatHistory", history);
    } catch (err) {
      console.error("❌ Lỗi khi lấy chat history:", err);
    }
  });

  socket.on("disconnect", () => {
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`❌ User ${userId} disconnected`);
        break;
      }
    }
  });
});

app.use(
  cors({
    origin: "https://pet-ecommerce-frontend.vercel.app", // Allow frontend from Vercel
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow cookies
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Define routes
routes(app);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect DB success!");
  })
  .catch((err) => {
    console.log("Database connection failed: ", err);
  });

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
