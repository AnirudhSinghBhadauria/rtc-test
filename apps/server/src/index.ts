import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3001;
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.status(200).json({
    name: "Anirudh Singh Bhadauria",
    age: 21,
  });
});

io.on("connection", (socket) => {
  // Listners!
  // socket.on("ping", ({ name, message }) => {
  //   console.log(`${name}: ${message}`);
  // });

  socket.on("SendMessage", (messageData) => {
    // console.log(`${socket.id}: ${message}`);

    io.emit("ReciveMessage", messageData);
  });

  // Emitters!

  // A new User joins!
  io.emit("UserJoins", { socketName: socket.id });
});

server.listen(port, () => {
  console.log(`Server running at ${port}`);
});
