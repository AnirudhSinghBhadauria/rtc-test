"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const Homepage = () => {
  const socket = useMemo(() => io("http://localhost:8080"), []);

  const [message, setMessage] = useState("");

  const submitHandeler = (event: FormEvent) => {
    event.preventDefault();
    // console.log("submitted!");
    socket.emit("SendMessage", { id: socket.id, message });
  };

  useEffect(() => {
    // Listners!
    socket.on("UserJoins", ({ socketName }) => {
      console.log(`New User Joined!, Hello, I am ${socketName}`);
    });

    // Reciveing message!
    socket.on("ReciveMessage", ({ id, message }) =>
      console.log(`${id}: ${message}`)
    );

    // Emmiters!
    // socket.emit("ping", {
    //   name: "anirudh",
    //   message: "hello from client!",
    // });
  }, []);

  return (
    <form
      onSubmit={submitHandeler}
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <input
        onChange={(event) => setMessage(event.target.value)}
        type="text"
        value={message}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default Homepage;
