"use client";
import React, { useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

const Homepage = () => {
  socket.emit("ping", {
    name: "anirudh",
    message: "hello from client!",
  });

  return <div>Homepage</div>;
};

export default Homepage;
