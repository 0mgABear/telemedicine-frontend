import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Grid, Paper } from "@mui/material";

export default function ChatPage() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(0);

  useEffect(() => {
    if (user && !accessToken) {
      getAccessTokenSilently().then((jwt) => {
        setAccessToken(jwt);
      });
    }
  }, [user, accessToken]);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    // 3
    newSocket.on("chatMessage", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: data[1], message: data[0] },
      ]);
    });

    // 4
    newSocket.on("joinRoom", (data) => {
      const { roomnow, messages } = data;
      setCurrentRoom(roomnow);
      setMessages(
        messages.map((message) => ({
          sender: message.sender,
          message: message.message,
        }))
      );
    });

    return () => newSocket.close();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!socket) return;

    socket.emit("chatMessage", [message, user.given_name, currentRoom]);
    setMessage("");
  };

  // 1
  const joinChatRoom = () => {
    socket.emit("subscribe", 1, 1); // doctor_id and patient_id
  };

  return (
    <Container sx={{ padding: 5 }}>
      <h1>Welcome to the chatroom</h1>
      <div>
        {user && <label htmlFor="username">Username: {user.given_name}</label>}
        {currentRoom !== 0 && (
          <div id="room">You are in Room: {currentRoom}</div>
        )}
      </div>
      <Grid
        container
        spacing={0}
        sx={{ border: "solid 1px black", margin: "auto" }}
      >
        <Grid item sx={{ border: "solid 1px red" }}>
          <button id="join" onClick={joinChatRoom}>
            Join Dr Yeo Yi's Chat Room
          </button>
        </Grid>
        <Grid item direction="column" sx={{ border: "solid 1px green" }}>
          <Grid
            item
            sx={{
              overflow: "auto",
              maxHeight: "50vh",
              border: "solid 1px blue",
            }}
          >
            {messages.length === 0 &&
              "Click on a doctor's name to join chat room"}
            <ul id="messages" style={{ listStyleType: "none" }}>
              {messages.map((msg, index) => (
                <li key={index}>
                  {msg.sender} : {msg.message}
                </li>
              ))}
            </ul>
          </Grid>
          <Grid item>
            <form id="msg" onSubmit={handleSendMessage}>
              <input
                id="m"
                autoComplete="off"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button>Send</button>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
