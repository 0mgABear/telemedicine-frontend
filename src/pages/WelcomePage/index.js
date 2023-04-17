import { useEffect } from "react";
import { ChatGPT } from "./ChatGPT";
import { Container } from "@mui/material";

export default function WelcomePage() {
  // to delete away doctor's data stored in localstorage
  useEffect(() => {
    localStorage.clear();
  }, []);
  return (
    <Container sx={{ padding: 5 }}>
      <ChatGPT />
    </Container>
  );
}
