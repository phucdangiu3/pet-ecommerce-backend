// app.js (hoặc server.js)
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
// const http = require("http"); // Create HTTP server for Socket.io
// const socketIo = require("socket.io"); // Import socket.io
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Create HTTP server for Express and Socket.io
// const server = http.createServer(app);

// Initialize Socket.io with CORS configuration
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000", // Allow frontend from localhost:3000 to connect
//     methods: ["GET", "POST"], // Allow GET and POST methods
//     credentials: true, // Allow cookies
//   },
// });

app.use(
  cors({
    origin: "https://pet-ecommerce-delta.vercel.app", // Allow frontend from Vercel
    methods: ["GET", "POST"],
    credentials: true, // Allow cookies
  })
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

// const userSocketMap = {}; // To map userIds to socketIds
// const adminSocketMap = {}; // To map adminIds to socketIds

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   socket.on("new_message", async (data) => {
//     const newMessage = await ChatService.createMessage(data);

//     // Emit message to sender and receiver
//     if (userSocketMap[data.sender]) {
//       io.to(userSocketMap[data.sender]).emit("message_received", newMessage);
//     }
//     if (userSocketMap[data.receiver]) {
//       io.to(userSocketMap[data.receiver]).emit("message_received", newMessage);
//     }

//     // Send message to all admins
//     for (let adminId in adminSocketMap) {
//       io.to(adminSocketMap[adminId]).emit("new_admin_message", newMessage);
//     }
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     for (let userId in userSocketMap) {
//       if (userSocketMap[userId] === socket.id) {
//         delete userSocketMap[userId];
//         console.log(`User ${userId} disconnected`);
//         break;
//       }
//     }
//     for (let adminId in adminSocketMap) {
//       if (adminSocketMap[adminId] === socket.id) {
//         delete adminSocketMap[adminId];
//         console.log(`Admin ${adminId} disconnected`);
//         break;
//       }
//     }
//   });
// });
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
