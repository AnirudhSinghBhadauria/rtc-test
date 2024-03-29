import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
// import { db } from "drizzle/db";
// import { user } from "drizzle/schema/main";

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
    name: "Anirudh",
    age: 21,
  });
});

// app.get("/users", async (req, res) => {
//   const allUsers = await db.select().from(user);

//   res.status(201).json(allUsers);
// });

io.on("connection", (socket) => {
  // Listners!

  // socket.on("ping", ({ name, message }) => {
  //   console.log(`${name}: ${message}`);
  // });

  socket.on("SendMessage", (messageData) => {
    io.emit("ReciveMessage", messageData);
  });

  socket.on("joinRoom", ({ socketId, roomName }) => {
    socket.join(roomName);

    // console.log(`${socket.id} has joined Room - ${roomName}`);
    // sending the joining information to frontend!
    socket.emit("joinRoom", { socket: socketId, roomName });
  });

  socket.on("messageSent", ({ socketId, message, roomName }) => {
    // Sending messsage to the whole room!
    io.to(roomName).emit("messageSent", { socketId, message });
  });

  socket.on("leaveRoom", ({ socketId }) => {
    socket.on("disconnecting", () => {
      console.log(socket.rooms); // the Set contains at least the socket ID
    });

    socket.on("disconnect", () => {
      socket.rooms.size === 0;
    });
  });

  // Emitters!

  // A new User joins!
  io.emit("UserJoins", { socketName: socket.id });
});

server.listen(port, () => {
  console.log(`Server running at ${port}`);
});
