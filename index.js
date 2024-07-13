const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const fs = require("fs");
const { Server } = require("socket.io");

const httpServer = http.createServer(app);

app.use(express.json());
app.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  const chats = fs.readFileSync("messages.json", "utf8");

  io.emit("send-message", JSON.parse(chats));

  socket.on("get-message", (data) => {
    const array = fs.readFileSync("messages.json", "utf8");
    const parseArray = JSON.parse(array);

    parseArray.push(data);
    fs.writeFileSync("messages.json", JSON.stringify(parseArray));

    const chats = fs.readFileSync("messages.json", "utf8");
    io.emit("send-message", JSON.parse(chats));
  });

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Hello");
});

httpServer.listen(7777, () => {
  console.log("Server is running on port 7777");
});
