"use client";

import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const Homepage = () => {
  const socket = useMemo(() => io("http://localhost:8080"), []);

  const [messageBucket, setMessageBucket] = useState<
    { id: String; message: String }[]
  >([]);

  const submitHandeler = async (formData: FormData) => {
    const message = formData.get("messages");
    socket.emit("SendMessage", { id: socket.id, message });
  };

  useEffect(() => {
    // Listners!
    socket.on("UserJoins", ({ socketName }) => {
      console.log(`New User Joined!, Hello, I am ${socketName}`);
    });

    // Reciveing message!
    socket.on("ReciveMessage", ({ id, message }) => {
      console.log(`${id}: ${message}`);
      setMessageBucket((bucket) => [...bucket, { id, message }]);
    });

    // Emmiters!
    // socket.emit("ping", {
    //   name: "anirudh",
    //   message: "hello from client!",
    // });
  }, []);

  return (
    <div>
      <form action={submitHandeler}>
        <input type="text" name="messages" />
        <button type="submit">Send</button>
      </form>
      <div style={{ marginTop: "20px" }}>
        {messageBucket.map(({ id, message }) => (
          <p>
            {id} : {message}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
