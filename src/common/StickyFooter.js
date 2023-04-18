import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export default function StickyFooter() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "10vh",
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
      }}
    >
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: "rgb(128,207,165)",
          position: "relative",
          overflow: "hidden",
          left: 0,
          bottom: 0,
          width: "100%",
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="white">
            {"Copyright © Health At Hand "}
            {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
