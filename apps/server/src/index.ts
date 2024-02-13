import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3001;
const io = new Server(server);

app.get("/", (req, res) => {
  res.status(200).json({
    name: "vanshika",
    age: 21,
  });
});

io.on("connection", (socket) => {
  socket.on("ping", ({ name, message }) => {
    console.log(`${name}: ${message}`);
  });
});

server.listen(port, () => {
  console.log(`Server running at ${port}`);
});
