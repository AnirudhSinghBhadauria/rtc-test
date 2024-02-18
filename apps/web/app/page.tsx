"use client";

import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

interface Room {
  name: String;
  users: { socket: String; messages: [] }[];
}

interface RoomMessageBucket {
  socket: String;
  message: String;
}

const Homepage = () => {
  const socket = useMemo(() => io("http://localhost:8080"), []);

  // Room States!

  const [roomDetails, setRoomDetails] = useState<Room>({
    name: "",
    users: [],
  });

  const [roomMessageBucket, setRoomMessageBucket] = useState<
    RoomMessageBucket[]
  >([]);

  // Room Handelers!

  const joinRoomHandeler = (formData: FormData) => {
    const roomName = formData.get("room");

    socket.emit("joinRoom", { socketId: socket.id, roomName });
  };

  const sendMessageToRoom = (formData: FormData) => {
    const message = formData.get("messages");

    socket.emit("messageSent", {
      roomName: roomDetails?.name,
      socketId: socket.id,
      message,
    });
  };

  const leaveRoomHandeler = () => {
    // Now this sokcet will get disconnected with all the rooms that it existed!
    socket.emit("leaveRoom", {socket: socket.id});
    
  };

  // Room Events!

  useEffect(() => {
    // Listners!
    socket.on("UserJoins", ({ socketName }) => {
      console.log(`New User Joined!, Hello, I am ${socketName}`);
    });

    // User joined Room!
    socket.on("joinRoom", ({ socketId, roomName }) => {
      // @ts-ignore
      setRoomDetails((prevDetails) => {
        // console.log(prevDetails);
        const currentUser = prevDetails?.users.find(
          (user) => user.socket === socketId
        );

        // console.log(currentUser);

        let newUser = currentUser
          ? { socket: socket.id, ...currentUser.messages }
          : { socket: socket.id, messages: [] };

        return {
          name: roomName,
          users: [...prevDetails!.users, newUser],
        };
      });

      console.log(`${socket.id} has joined Room - ${roomName}`);
    });

    socket.on(
      "messageSent",
      ({ socketId, message }: { socketId: string; message: string }) => {
        const user = roomDetails?.users.find(
          (user) => user.socket === socketId
        );

        // @ts-ignore
        user?.messages.push(message);

        setRoomMessageBucket((roomMessages) => [
          ...roomMessages,
          {
            socket: socketId,
            message,
          },
        ]);
      }
    );

    // socket.on("leaveRoom", ({ socketId }) => {
    //   console.log(`${socketId} left ${roomDetails.name}`);
    // });
  }, []);

  return (
    <div style={containerStyles}>
      {!roomDetails.name ? (
        <form action={joinRoomHandeler}>
          <input style={{ padding: "10px" }} type="text" name="room" />
          <button style={{ marginLeft: "10px", padding: "10px" }} type="submit">
            Join room
          </button>
        </form>
      ) : (
        <div>
          <h1 style={{ marginBottom: "20px" }}>{roomDetails?.name}</h1>
          <form action={sendMessageToRoom} style={{ marginBottom: "20px" }}>
            <input style={{ padding: "10px" }} type="text" name="messages" />
            <button
              style={{ marginLeft: "10px", padding: "10px" }}
              type="submit"
            >
              Send
            </button>
            <button
              onClick={leaveRoomHandeler}
              style={{ marginLeft: "10px", padding: "10px" }}
              type="button"
            >
              Leave room
            </button>
          </form>
          {roomMessageBucket.map(({ message, socket }) => (
            <p>
              {socket} : {message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Homepage;

const containerStyles: any = {
  width: "100%",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};
