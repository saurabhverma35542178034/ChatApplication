const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

const users = {};

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  // When a new user joins
  socket.on("new-user-joined", (name) => {
    console.log("New User:", socket.id, name);
    users[socket.id] = name;

    // Notify other users
    socket.broadcast.emit("user-joined", name);
  });

  // When a user sends a message
  socket.on("send", (message) => {
    const data = {
      name: users[socket.id],
      message: message,
    };

    // Send to all users, including sender
    socket.broadcast.emit("receive", data);
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

http.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
