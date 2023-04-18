import { useEffect, useState } from "react";
import { ChatGPT } from "./ChatGPT";
import { Container } from "@mui/material";
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
import { useAuth0 } from "@auth0/auth0-react";
import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useOutletContext } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
  const { user, logout } = useAuth0();
  const [openSuccess, setOpenSuccess] = useState(false);

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };

  // to delete away doctor's data stored in localstorage
  // to logout automatically when at welcome page
  const handleLoggingOut = async () => {
    localStorage.clear();
    await logout();
  };

  useEffect(() => {
    if (
      !user &&
      localStorage.getItem("doctorlogin") !== null &&
      localStorage.getItem("patientlogin") !== null
    ) {
      handleLoggingOut().then(setOpenSuccess(true));
    }
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Logout successful! See you next time!
        </Alert>
      </Snackbar>
    </Container>
  );
}
