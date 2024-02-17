"use client";

import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

type Room = {
  name: String;
  users: { socket: String; messages: [] }[];
};

type RoomMessageBucket = {
  socket: String;
  message: String;
}[];

const containerStyles: any = {
  width: "100%",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const Homepage = () => {
  const socket = useMemo(() => io("http://localhost:8080"), []);

  const [messageBucket, setMessageBucket] = useState<
    { id: String; message: String }[]
  >([]);

  const [roomDetails, setRoomDetails] = useState<Room>({
    name: "",
    users: [],
  });

  const [roomMessageBucket, setRoomMessageBucket] = useState<RoomMessageBucket>(
    []
  );

  // Non-room message Handeler!
  // const submitHandeler = async (formData: FormData) => {
  //   const message = formData.get("messages");
  //   socket.emit("SendMessage", { id: socket.id, message });
  // };

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

    // ROOM EVENTS!

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

    // Send Messages to the room!
    socket.on(
      "messageSent",
      ({ socketId, message }: { socketId: string; message: string }) => {
        // Save message to a state variable and display on the screen!

        const user = roomDetails?.users.find(
          (user) => user.socket === socketId
        );
        // console.log(roomDetails);

        // @ts-ignore
        user?.messages.push(message);

        // roomDetails && console.log(roomDetails);

        setRoomMessageBucket((roomMessages) => [
          ...roomMessages,
          {
            socket: socketId,
            message,
          },
        ]);
      }
    );
  }, []);

  return (
    <div style={containerStyles}>
      <form action={joinRoomHandeler}>
        <input style={{ padding: "10px" }} type="text" name="room" />
        <button style={{ marginLeft: "10px", padding: "10px" }} type="submit">
          Join room
        </button>
      </form>

      {/* Make this "submitHandeler" for sending normal messages! */}
      <div>
        <h1>{roomDetails?.name}</h1>
        <form action={sendMessageToRoom}>
          <input style={{ padding: "10px" }} type="text" name="messages" />
          <button style={{ marginLeft: "10px", padding: "10px" }} type="submit">
            Send Message to Room
          </button>
        </form>
        {roomMessageBucket.map(({ message }) => (
          <p>{message}</p>
        ))}
      </div>

      {/* These hyderate DOM with normal non-room messages! */}

      {/* <div style={{ marginTop: "20px" }}> */}
      {/*   {messageBucket.map(({ id, message }) => ( */}
      {/*     <p> */}
      {/*       {id} : {message} */}
      {/*     </p> */}
      {/*   ))} */}
      {/* </div> */}
    </div>
  );
};

export default Homepage;
