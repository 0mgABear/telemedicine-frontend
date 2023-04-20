import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CreateProfile() {
  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openFailure, setOpenFailure] = useState(false);

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
  };

  const handleGenderSelectChange = (e) => {
    setFormValues({ ...formValues, gender: e.target.value });
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };

  const handleCloseFailure = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenFailure(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:3000/createpatient`, formValues, configs)
      .then(function (response) {
        console.log(response);
        setOpenSuccess(true);
        navigate("/home");
      })
      .catch(function (error) {
        console.log(error);
        setOpenFailure(true);
      });
  };

  useEffect(() => {
    if (user && !accessToken) {
      getAccessTokenSilently().then((jwt) => setAccessToken(jwt));
    }
  }, [user, accessToken]);

  const configs = {};
  if (accessToken) configs.headers = { Authorization: `Bearer ${accessToken}` };

  useEffect(() => {
    if (user) {
      setFormValues({
        email: user.email,
        last_name: user.family_name,
        first_name: user.given_name,
        ic_number: "",
        age: 0,
        gender: "Male",
        height: 0,
        weight: 0,
        address: "",
        postal_code: "",
        medical_history: "",
      });
    }
  }, [user]);

  return (
    <>
      {Object.keys(formValues).length !== 0 && (
        <Container sx={{ padding: 5 }}>
          <h1>Create Profile - Patient Information</h1>
          <Grid container direction="column">
            <Grid container direction="row">
              <Grid item style={{ padding: "10px" }}>
                <TextField
                  required
                  id="last_name"
                  label="Surname"
                  value={formValues.last_name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item style={{ padding: "10px" }}>
                <TextField
                  required
                  id="first_name"
                  label="Given Name"
                  value={formValues.first_name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item style={{ padding: "10px" }}>
                <FormControl fullWidth>
                  <InputLabel id="gender">Gender</InputLabel>
                  <Select
                    id="gender"
                    value={formValues.gender}
                    label="Gender"
                    onChange={handleGenderSelectChange}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Prefer not to say">
                      Prefer not to say
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container direction="row">
              <Grid item style={{ padding: "10px" }}>
                <TextField
                  required
                  id="ic_number"
                  label="NRIC Number"
                  value={formValues.ic_number}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item style={{ padding: "10px" }}>
                <TextField
                  disabled
                  id="email"
                  label="Email Address"
                  value={formValues.email}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>

            <Grid container direction="row">
              <Grid item style={{ padding: "10px" }}>
                <TextField
                  required
                  id="age"
                  label="Age"
                  type="number"
                  value={formValues.age}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item style={{ padding: "10px" }}>
                <TextField
                  required
                  id="height"
                  label="Height"
                  type="number"
                  value={formValues.height}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">cm</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item style={{ padding: "10px" }}>
                <TextField
                  required
                  id="weight"
                  label="Weight"
                  type="number"
                  value={formValues.weight}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Grid container direction="row">
              <Grid item style={{ padding: "10px" }}>
                <TextField
                  required
                  id="address"
                  label="Residential Address"
                  value={formValues.address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item style={{ padding: "10px" }}>
                <TextField
                  required
                  id="postal_code"
                  label="Postal Code"
                  value={formValues.postal_code}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        Singapore{" "}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Grid item style={{ padding: "10px" }}>
              <TextField
                multiline
                minRows={2}
                maxRows={4}
                required
                id="medical_history"
                label="Medical History"
                value={formValues.medical_history}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Create patient profile
          </Button>
        </Container>
      )}
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
          Profile successfully created!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openFailure}
        autoHideDuration={3000}
        onClose={handleCloseFailure}
      >
        <Alert
          onClose={handleCloseFailure}
          severity="error"
          sx={{ width: "100%" }}
        >
          Missing/incorrect information, check again!
        </Alert>
      </Snackbar>
    </>
  );
}
