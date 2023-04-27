import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export function ChatGPT({ language }) {
  const [chatResponse, setChatResponse] = useState("");
  const [waitingResponse, setWaitingResponse] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [disabled, setDisabled] = useState(false);

  const question = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: `${searchValue}` }],
  };

  const configs = {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
    },
  };

  const generateResponse = () => {
    setWaitingResponse(true);
    setDisabled(true);

    axios
      .post("https://api.openai.com/v1/chat/completions", question, configs)
      .then(function (response) {
        console.log(response);
        let text = response.data.choices[0].message.content;

        if (text.includes("\n")) {
          // This is a regexp to split the text by finding the delimiter \n but still keep the delimiter in array
          text = text.split(/(\n)/g);
          // ChatGPT response always come back with first 2 elements as \n, so need to slice 2 to remove them
          text = text.slice(2);
          console.log(text);
          setChatResponse(text);
        } else {
          console.log(text);
          setChatResponse(text);
        }
      })
      .then(() => {
        setWaitingResponse(false);
        setDisabled(false);
      })
      .catch(function (error) {
        console.log(error);
        setWaitingResponse(false);
        setDisabled(false);
      });
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        {language === "English" && (
          <>
            <TextField
              id="outlined-name"
              label="Ask Health At Hand anything!"
              value={searchValue}
              onChange={handleChange}
              style={{ minWidth: "100%" }}
            />
            <div style={{ minWidth: "100%", textAlign: "center" }}>
              <Button
                variant="contained"
                color="success"
                onClick={generateResponse}
                disabled={disabled}
              >
                Ask!
              </Button>
            </div>
          </>
        )}

        {language === "Chinese" && (
          <>
            <TextField
              id="outlined-name"
              label="询问 Health At Hand 任何问题!"
              value={searchValue}
              onChange={handleChange}
              style={{ minWidth: "100%" }}
            />
            <div style={{ minWidth: "100%", textAlign: "center" }}>
              <Button
                variant="contained"
                color="success"
                onClick={generateResponse}
                disabled={disabled}
              >
                询问!
              </Button>
            </div>
          </>
        )}
      </Box>

      <Paper elevation={3} sx={{ overflow: "auto", padding: 5, marginTop: 2 }}>
        {!waitingResponse &&
          chatResponse !== "" &&
          Array.isArray(chatResponse) &&
          chatResponse.map((info, key) =>
            info === "\n" ? (
              <div key={key}>
                <br></br>
              </div>
            ) : (
              info
            )
          )}
        {!waitingResponse &&
          chatResponse !== "" &&
          !Array.isArray(chatResponse) &&
          chatResponse}
        {waitingResponse && language === "English" && (
          <>
            <CircularProgress />{" "}
            <p>Waiting for response from Health At Hand ChatGPT...</p>
          </>
        )}
        {waitingResponse && language === "Chinese" && (
          <>
            <CircularProgress /> <p>等待 Health At Hand ChatGPT 的回复...</p>
          </>
        )}
        {!waitingResponse &&
          chatResponse === "" &&
          language === "English" &&
          "Your answer will appear here!"}
        {!waitingResponse &&
          chatResponse === "" &&
          language === "Chinese" &&
          "你询问的答案会出现在这里!"}
      </Paper>
    </>
  );
}
