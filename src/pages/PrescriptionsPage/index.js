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
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export default function PrescriptionsPage() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [patientData, setPatientData] = useState([]);
  const doctorId = localStorage.getItem("doctorid");

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
  };

  const handleNameSelectChange = (e) => {
    setFormValues({ ...formValues, first_name: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // axios
    //   .post(
    //     `http://localhost:3000/`,
    //     formValues,
    //     configs
    //   )
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
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
        doctor_id: +doctorId,
        patient_id: 0,
        diagnosis: "",
        drug_name: "",
        dose: "",
        frequency: "",
        remarks: "",
        delivered: false,
      });
    }
  }, [user]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/allpatients`, configs)
      .then(function (response) {
        console.log(response);
        setPatientData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <Container>
      <h1>Add new prescription</h1>

      <Grid container direction="column">
        <Grid item style={{ padding: "10px" }}>
          <FormControl fullWidth>
            <InputLabel id="gender">Patient name</InputLabel>
            <Select
              id="patient_id"
              value={formValues.patient_id}
              label="Patient Name"
              onChange={handleNameSelectChange}
            >
              {patientData.map((values) => (
                <MenuItem value={values.id}>
                  {values.last_name} {values.first_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item style={{ padding: "10px" }}>
          <TextField
            required
            id="diagnosis"
            label="Diagnosis"
            value={formValues.diagnosis}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="success"
        onClick={handleSubmit}
        // disabled={disableEditButton}
      >
        Prescribe
      </Button>
    </Container>
  );
}
