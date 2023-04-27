import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { Button, Container, Grid, Paper, TextField } from "@mui/material";
import axios from "axios";
import "./index.css";
import nature from "../../assets/nature.png";
import SendIcon from "@mui/icons-material/Send";

export default function ChatPage() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(0);
  const [doctorsData, setDoctorsData] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const doctorLogin = localStorage.getItem("doctorlogin");
  const patientLogin = localStorage.getItem("patientlogin");

  const configs = {};
  if (accessToken) configs.headers = { Authorization: `Bearer ${accessToken}` };

  useEffect(() => {
    if (user && !accessToken) {
      getAccessTokenSilently().then((jwt) => {
        setAccessToken(jwt);
      });
    }
  }, [user, accessToken]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/alldoctors`, configs)
      .then(function (response) {
        console.log(response);
        setDoctorsData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    axios
      .get(`http://localhost:3000/allpatients`, configs)
      .then(function (response) {
        console.log(response);
        setPatientsData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  // when patient/doctor click on a particular patient/doctor's room button, join that patient/doctor's room
  const joinChatRoom = (valueId) => {
    if (patientLogin === "true" && doctorLogin === "false") {
      socket.emit("subscribe", valueId, localStorage.getItem("patientid"));
    } else if (patientLogin === "false" && doctorLogin === "true") {
      socket.emit("subscribe", localStorage.getItem("doctorid"), valueId);
    }
  };
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!socket) return;
    // prevent empty message from being sent
    if (message !== "") {
      socket.emit("chatMessage", [message, user.given_name, currentRoom]);
      setMessage("");
    }
  };

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("joinRoom", (data) => {
      const { roomnow, messages } = data;
      console.log(roomnow);
      console.log(messages);
      setCurrentRoom(roomnow);
      setMessages(
        messages.map((message) => ({
          sender: message.sender,
          message: message.message,
        }))
      );
    });

    newSocket.on("chatMessage", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: data[1], message: data[0] },
      ]);
    });

    return () => newSocket.close();
  }, [messages]);

  return (
    <Container sx={{ padding: 3 }}>
      <h1>Welcome to the chatroom, {user && user.given_name}</h1>
      <Grid container direction="row" spacing={0} sx={{ margin: "auto" }}>
        <Grid
          direction="column"
          sx={{
            border: "solid 1px grey",
            minWidth: "15vw",
          }}
        >
          {patientLogin === "true" &&
            doctorsData.map((values, key) => (
              <Grid item key={key} sx={{ border: "solid 1px grey" }}>
                <div
                  className="doctornames"
                  id="join"
                  onClick={() => joinChatRoom(values.id)}
                  style={{
                    padding: "10px",
                    fontWeight: "bold",
                    minWidth: "20vw",
                  }}
                >
                  Dr {values.full_name} ({values.mcr})
                </div>
              </Grid>
            ))}

          {doctorLogin === "true" &&
            patientsData.map((values, key) => (
              <Grid item key={key} sx={{ border: "solid 1px grey" }}>
                <div
                  className="doctornames"
                  id="join"
                  onClick={() => joinChatRoom(values.id)}
                  style={{
                    padding: "10px",
                    fontWeight: "bold",
                    minWidth: "20vw",
                  }}
                >
                  {values.last_name} {values.first_name} {values.ic_number}
                </div>
              </Grid>
            ))}
        </Grid>

        <Grid
          direction="column"
          sx={{ border: "solid 1px grey", maxWidth: "50vw" }}
        >
          <Grid
            item
            sx={{
              overflow: "auto",
              minWidth: "50vw",
              minHeight: "55vh",
              maxHeight: "55vh",

              backgroundImage: `url(${nature})`,
              backgroundSize: "stretch",
            }}
          >
            {messages.length === 0 && (
              <Paper
                elevation={3}
                style={{
                  backgroundColor: "white",
                  minHeight: "100%",
                  maxWidth: "70%",
                  display: "table",
                  margin: "20px",
                  padding: "10px",
                  fontWeight: "bold",
                }}
              >
                {patientLogin === "true" && (
                  <>
                    Click on a doctor's name to join chat room, and start
                    chatting!
                  </>
                )}
                {doctorLogin === "true" && (
                  <>
                    Click on a patient's name to join chat room, and start
                    chatting!
                  </>
                )}
              </Paper>
            )}
            <ul
              id="messages"
              style={{ listStyleType: "none", padding: "0px 10px" }}
            >
              {messages.map((msg, index) => (
                <li key={index}>
                  {msg.sender === user.given_name ? (
                    <Paper
                      elevation={2}
                      style={{
                        margin: "10px",
                        display: "table",
                        marginLeft: "auto",
                        backgroundColor: "rgb(190,230,155)",
                        maxWidth: "70%",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: "bold",
                          padding: "10px 10px 0px 10px",
                          margin: 0,
                        }}
                      >
                        {msg.sender}
                      </p>
                      <p style={{ padding: "0px 10px 10px 10px", margin: 0 }}>
                        {msg.message}
                      </p>
                    </Paper>
                  ) : (
                    <Paper
                      elevation={2}
                      style={{
                        margin: "10px",
                        display: "table",
                        maxWidth: "70%",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: "bold",
                          padding: "10px 10px 0px 10px",
                          margin: 0,
                        }}
                      >
                        {msg.sender}
                      </p>
                      <p style={{ padding: "0px 10px 10px 10px", margin: 0 }}>
                        {msg.message}
                      </p>
                    </Paper>
                  )}
                </li>
              ))}
            </ul>
          </Grid>
          <Grid item sx={{ minWidth: "100%" }}>
            <form id="msg" onSubmit={handleSendMessage}>
              <TextField
                id="m"
                autoComplete="off"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ minWidth: "88%", float: "left", padding: "5px" }}
                placeholder="Type a message"
              />

              <Button
                variant="contained"
                color="success"
                style={{ minWidth: "10%", marginTop: "5px", padding: "15px" }}
              >
                <SendIcon />
              </Button>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
