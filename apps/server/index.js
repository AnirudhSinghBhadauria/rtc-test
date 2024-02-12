import express from "express";
import http from "http";
import { Server } from "socket.io";

const port = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.status(200).json({
    name: "anriudh singh bhadauria",
    age: 21,
  });
});

io.on("connection", (socket) => {
  console.log("User connected!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
