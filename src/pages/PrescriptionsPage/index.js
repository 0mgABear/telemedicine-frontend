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
import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function PrescriptionsPage() {
  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);
  const doctorId = localStorage.getItem("doctorid");
  const [formValues, setFormValues] = useState({
    doctor_id: +doctorId,
    patient_id: "",
    diagnosis: "",
    drug_name: "",
    dose: "",
    frequency: "",
    remarks: "",
    delivered: false,
  });
  const [patientData, setPatientData] = useState([]);
  const [drugData, setDrugData] = useState([]);
  const [maxDosePerFrequency, setMaxDosePerFrequency] = useState(false);
  const [maxDosePerDay, setMaxDosePerDay] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openFailure, setOpenFailure] = useState(false);
  const [disableEditButton, setDisableEditButton] = useState(false);

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

  const calculateMaxDosePerFrequency = () => {
    let particularDrug = {};
    for (let x = 0; x < drugData.length; x++) {
      if (drugData[x].name === formValues.drug_name) {
        particularDrug = drugData[x];
      }
    }
    if (+formValues.dose > particularDrug.max_dose_per_frequency) {
      setMaxDosePerFrequency(true);
    } else {
      setMaxDosePerFrequency(false);
    }
  };

  const calculateMaxDosePerDay = () => {
    let particularDrug = {};
    for (let x = 0; x < drugData.length; x++) {
      if (drugData[x].name === formValues.drug_name) {
        particularDrug = drugData[x];
      }
    }

    if (
      +formValues.dose * formValues.frequency >
      particularDrug.max_dose_per_day
    ) {
      setMaxDosePerDay(true);
    } else {
      setMaxDosePerDay(false);
    }
  };

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
    console.log(formValues);
  };

  const handleNameSelectChange = (e) => {
    setFormValues({ ...formValues, patient_id: e.target.value });
    console.log(formValues);
  };

  const handleDrugSelectChange = (e) => {
    setFormValues({ ...formValues, drug_name: e.target.value });
    console.log(formValues);
  };

  const handleFrequencySelectChange = (e) => {
    setFormValues({ ...formValues, frequency: +e.target.value });
    console.log(formValues);
  };

  const moveToPrescriptionsSummary = () => {
    navigate("/prescriptions");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formValues.patient_id !== "" &&
      formValues.diagnosis !== "" &&
      formValues.drug_name !== "" &&
      formValues.dose !== "" &&
      formValues.frequency !== "" &&
      formValues.remarks !== ""
    ) {
      axios
        .post(`http://localhost:3000/createprescription`, formValues, configs)
        .then(function (response) {
          console.log(response);
          setOpenSuccess(true);
          setDisableEditButton(true);
          setTimeout(moveToPrescriptionsSummary, 3000);
        })
        .catch(function (error) {
          console.log(error);
          setOpenFailure(true);
        });
    } else {
      setOpenFailure(true);
    }
  };

  useEffect(() => {
    if (user && !accessToken) {
      getAccessTokenSilently().then((jwt) => setAccessToken(jwt));
    }
  }, [user, accessToken]);

  const configs = {};
  if (accessToken) configs.headers = { Authorization: `Bearer ${accessToken}` };

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

  useEffect(() => {
    axios
      .get(`http://localhost:3000/alldrugs`, configs)
      .then(function (response) {
        console.log(response);
        setDrugData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    calculateMaxDosePerFrequency();
    calculateMaxDosePerDay();
  }, [formValues]);

  return (
    <Container>
      <h1>Add new prescription</h1>

      <Grid container direction="column">
        <Grid container direction="row">
          <Grid item style={{ padding: "10px" }}>
            <FormControl>
              <InputLabel id="patient_id">Patient name</InputLabel>
              <Select
                id="patient_id"
                value={formValues.patient_id}
                label="Patient Name"
                onChange={handleNameSelectChange}
                style={{ minWidth: "250px" }}
                required
              >
                {patientData.map((values, key) => (
                  <MenuItem value={+values.id} key={key}>
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

        <Grid container direction="row">
          <Grid item style={{ padding: "10px" }}>
            <FormControl>
              <InputLabel id="drug_name">Drug name</InputLabel>
              <Select
                id="drug_name"
                value={formValues.drug_name}
                label="Drug Name"
                onChange={handleDrugSelectChange}
                style={{ minWidth: "250px" }}
                required
              >
                {drugData.map((values, key) => (
                  <MenuItem key={key} value={values.name}>
                    {values.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item style={{ padding: "10px" }}>
            {maxDosePerFrequency && maxDosePerDay && (
              <TextField
                required
                id="dose"
                label="Dose"
                type="number"
                value={formValues.dose}
                onChange={handleInputChange}
                error
                helperText="Exceeded max dose per interval and per day!"
              />
            )}
            {maxDosePerFrequency && !maxDosePerDay && (
              <TextField
                required
                id="dose"
                label="Dose"
                type="number"
                value={formValues.dose}
                onChange={handleInputChange}
                error
                helperText="Exceeded max dose per interval!"
              />
            )}
            {!maxDosePerFrequency && maxDosePerDay && (
              <TextField
                required
                id="dose"
                label="Dose"
                type="number"
                value={formValues.dose}
                onChange={handleInputChange}
                error
                helperText="Exceeded max dose per day!"
              />
            )}
            {!maxDosePerFrequency && !maxDosePerDay && (
              <TextField
                required
                id="dose"
                label="Dose"
                type="number"
                value={formValues.dose}
                onChange={handleInputChange}
              />
            )}
          </Grid>
          <Grid item style={{ padding: "10px" }}>
            <FormControl>
              <InputLabel id="frequency">Frequency</InputLabel>
              <Select
                labelId="frequency"
                id="frequency"
                value={formValues.frequency}
                label="Frequency"
                onChange={handleFrequencySelectChange}
                style={{ minWidth: "250px" }}
                required
              >
                <MenuItem value={0}>PRN</MenuItem>
                <MenuItem value={1}>ON</MenuItem>
                <MenuItem value={2}>BD</MenuItem>
                <MenuItem value={3}>TDS</MenuItem>
                <MenuItem value={4}>QDS</MenuItem>
                <MenuItem value={6}>4 hourly</MenuItem>
                <MenuItem value={12}>2 hourly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid item style={{ padding: "10px" }}>
          <TextField
            multiline
            minRows={2}
            maxRows={4}
            required
            id="remarks"
            label="Any remarks?"
            value={formValues.remarks}
            onChange={handleInputChange}
            style={{ minWidth: "490px" }}
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="success"
        onClick={handleSubmit}
        disabled={disableEditButton}
      >
        Prescribe
      </Button>
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
          Prescription successfully saved!
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
    </Container>
  );
}
