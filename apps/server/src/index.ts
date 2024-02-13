import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "node:http";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.status(200).json({
    name: "anirudh",
    age: 21,
  });
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
