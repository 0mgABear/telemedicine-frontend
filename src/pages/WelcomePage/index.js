import * as React from "react";
import { ChatGPT } from "./ChatGPT";
import { Container } from "@mui/material";

export default function WelcomePage() {
  return (
    <Container sx={{ padding: 5 }}>
      <ChatGPT />
    </Container>
  );
}
