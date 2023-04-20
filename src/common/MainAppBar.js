import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import companylogo from "../assets/health_at_hand_logo.png";
import { Grid, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function MainAppBar() {
  const { getAccessTokenSilently, user, loginWithRedirect, logout } =
    useAuth0();
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (user && !accessToken) {
      getAccessTokenSilently().then((jwt) => setAccessToken(jwt));
    }
  }, [user, accessToken]);

  return (
    <Box sx={{ flexGrow: 1, width: "100vw", maxHeight: 100 }}>
      <AppBar
        position="static"
        sx={{ maxHeight: 100, backgroundColor: "rgb(128,207,165)" }}
      >
        <Toolbar>
          <img src={companylogo} alt="company logo" width={100} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Health At Hand
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Grid container>
              {user && (
                <Grid item>
                  <ListItem key="Locate a clinic" disablePadding>
                    <ListItemButton>
                      <Link to="/locate" style={{ textDecoration: "none" }}>
                        <ListItemText
                          primary="Locate"
                          sx={{ color: "white" }}
                        />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                </Grid>
              )}

              {user && (
                <Grid item>
                  <ListItem key="Profile" disablePadding>
                    <ListItemButton>
                      <Link to="/home" style={{ textDecoration: "none" }}>
                        <ListItemText
                          primary="Profile"
                          sx={{ color: "white" }}
                        />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                </Grid>
              )}

              {user && (
                <Grid item>
                  <ListItem key="Chatroom" disablePadding>
                    <ListItemButton>
                      <Link to="/chat" style={{ textDecoration: "none" }}>
                        <ListItemText
                          primary="Chatroom"
                          sx={{ color: "white" }}
                        />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                </Grid>
              )}

              {!user && (
                <Grid item>
                  <ListItem key="Login" disablePadding>
                    <ListItemButton
                      sx={{ textAlign: "center" }}
                      onClick={loginWithRedirect}
                    >
                      <ListItemText primary="Login"></ListItemText>
                    </ListItemButton>
                  </ListItem>
                </Grid>
              )}

              {user && (
                <Grid item>
                  <ListItem key="Logout" disablePadding>
                    <ListItemButton
                      sx={{ textAlign: "center" }}
                      onClick={logout}
                    >
                      <ListItemText primary="Logout"></ListItemText>
                    </ListItemButton>
                  </ListItem>
                </Grid>
              )}
            </Grid>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
