import { useEffect } from "react";
import { ChatGPT } from "./ChatGPT";
import { Container } from "@mui/material";
import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import sgh from "../../assets/sgh-logo.png";
import cgh from "../../assets/cgh-logo.png";
import skh from "../../assets/skh-logo.png";
import kkwch from "../../assets/kkwch-logo.png";
import nccs from "../../assets/nccs-logo.png";
import ndcs from "../../assets/ndcs-logo.png";
import nhcs from "../../assets/nhcs-logo.png";
import nni from "../../assets/nni-logo.png";
import snec from "../../assets/snec-logo.png";
import shcomm from "../../assets/shcommunity-logo.png";
import polyclinics from "../../assets/polyclinics-logo.png";

const items = [
  sgh,
  cgh,
  skh,
  kkwch,
  nccs,
  ndcs,
  nhcs,
  nni,
  snec,
  shcomm,
  polyclinics,
];

export default function WelcomePage() {
  // to delete away doctor's data stored in localstorage
  useEffect(() => {
    localStorage.clear();
  }, []);
  return (
    <Container sx={{ padding: 5 }}>
      <ChatGPT />
      <div style={{ textAlign: "center", paddingTop: "20px" }}>
        <h1>Our trusted healthcare partners</h1>
        <Carousel indicators={false}>
          {items.map((item, i) => (
            <Paper key={i} sx={{ padding: 5 }} elevation={0}>
              <div style={{ textAlign: "center" }}>
                <img
                  src={item}
                  style={{ width: "370px", height: "110px", objectFit: "fill" }}
                  alt="logos"
                />
              </div>
            </Paper>
          ))}
        </Carousel>
      </div>
    </Container>
  );
}
