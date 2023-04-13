import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import companylogo from "../assets/health_at_hand_logo.png";
import { Grid, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function MainAppBar() {
  const { getAccessTokenSilently, user, loginWithRedirect, logout } =
    useAuth0();

  return (
    <Box sx={{ flexGrow: 1, width: "100vw", maxHeight: 100 }}>
      <AppBar
        position="static"
        sx={{ maxHeight: 100, backgroundColor: "rgb(128,207,165)" }}
      >
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <img src={companylogo} width={100} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Health At Hand
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Grid container >
              <Grid item>
                <ListItem key="Profile" disablePadding>
                  <ListItemButton sx={{ textAlign: "center" }}>
                    <Link to="/home">
                       <ListItemText primary="Profile" />
                    </Link>
                   
                  </ListItemButton>
                </ListItem>
              </Grid>
              <Grid item>
                <ListItem key="Chatroom" disablePadding>
                  <ListItemButton sx={{ textAlign: "center" }}>
                    <Link to="/chat">
                      <ListItemText primary="Chatroom" />
                    </Link>
                  </ListItemButton>
                </ListItem>
              </Grid>

              <Grid item>
                <ListItem key="Login" disablePadding>
                  <ListItemButton
                    sx={{ textAlign: "center" }}
                    onClick={loginWithRedirect}
                  >
                    <ListItemText primary="Login">
                      {/* <Link to="/login" /> */}
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              </Grid>
              <Grid item>
                <ListItem key="Logout" disablePadding>
                  <ListItemButton sx={{ textAlign: "center" }} onClick={logout}>
                    <ListItemText primary="Logout">
                      {/* <Link to="/" /> */}
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              </Grid>
            </Grid>
          </Box>

          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
