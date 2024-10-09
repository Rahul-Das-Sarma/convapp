import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/user.js";
import bodyParser from "body-parser";
import mongoDBConnect from "./mongoDB/connection.js";
import authenticateUser from "./middleware/auth.js";
import messageRouter from "./routes/message.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { instrument } from "@socket.io/admin-ui";
import { sendMessage } from "./controller/message.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/", router);
app.use("/message", authenticateUser, messageRouter);

mongoDBConnect();

const server = createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: [process.env.CLIENT_URL, "https://admin.socket.io"],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
  mode: "development",
});

let onlineUsers = [];

io.on("connection", (socket) => {
  socket.emit("connected");

  socket.on("setup", (userDataId) => {
    socket.join(userDataId);
  });

  socket.on("join-chat", (room) => {
    socket.join(room);
  });
  socket.on("leave-chat", (room) => {
    console.log(room + " left");
    socket.leave(room);
  });

  socket.on("addNewUser", (userId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    }
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("removeUser", (userId) => {
    onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("typing", (room, userId) => {
    socket.in(room).emit("typing", userId);
  });

  socket.on("stop-typing", (room) => {
    socket.in(room).emit("stop-typing");
  });

  socket.on("new-message", async (message, sender, receiver) => {
    const result = await sendMessage(message, sender, receiver);

    if (result.status === 200) {
      socket.emit("message-sent", result.message);
      socket.to(receiver).emit("message-received", result.message);
    } else {
      socket.emit("error", result.error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("hello world");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
