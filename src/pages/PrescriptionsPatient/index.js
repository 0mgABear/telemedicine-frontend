import { useAuth0 } from "@auth0/auth0-react";
import { Alert, Button, Container, Snackbar } from "@mui/material";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function PrescriptionsPatient() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);
  const [prescriptionsRetrieved, setPrescriptionsRetrieved] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [patientDrugAllergy, setPatientDrugAllergy] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [singlePrescription, setSinglePrescription] = useState("");
  const [openDeleteSuccess, setOpenDeleteSuccess] = useState(false);
  const [openDeleteFailure, setOpenDeleteFailure] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const doctorId = localStorage.getItem("doctorid");
  const doctorname = localStorage.getItem("doctorname");

  useEffect(() => {
    if (user && !accessToken) {
      getAccessTokenSilently().then((jwt) => setAccessToken(jwt));
    }
  }, [user, accessToken]);

  const configs = {};
  if (accessToken) configs.headers = { Authorization: `Bearer ${accessToken}` };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDeleteSuccess(false);
  };

  const handleCloseFailure = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDeleteFailure(false);
  };

  const handleDelete = (value) => {
    setSinglePrescription(value);
    setOpenDeleteDialog(true);
  };

  const handleDialogCloseDisagree = () => {
    setOpenDeleteDialog(false);
  };

  const handleDialogCloseAgree = () => {
    setOpenDeleteDialog(false);
    axios
      .delete(
        `http://localhost:3000/deleteprescription/${singlePrescription}`,
        configs
      )
      .then(function (response) {
        console.log(response);
        setOpenDeleteSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(function (error) {
        console.log(error);
        setOpenDeleteFailure(true);
      });
  };

  useMemo(() => {
    axios
      .get(
        `http://localhost:3000/prescriptions/patient/${doctorId}/${params.patient_id}`,
        configs
      )
      .then(function (response) {
        console.log(response);
        setPrescriptionsRetrieved(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/patientid/${params.patient_id}`, configs)
      .then(function (response) {
        console.log(response);
        let patient = "";
        patient += response.data.last_name;
        patient += " ";
        patient += response.data.first_name;
        setPatientName(patient);
        setPatientDrugAllergy(response.data.drug_allergy);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <Container sx={{ padding: 5 }}>
      <h1>Dr {doctorname},</h1>
      <h3>Your past prescriptions for patient {patientName}</h3>
      <h3>
        Drug allergies:{" "}
        <span style={{ color: "red" }}>{patientDrugAllergy}</span>
      </h3>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgb(128,207,165)" }}>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                Patient name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                Diagnosis
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                Drug name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                Dose
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                Frequency
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                Date / Time
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                Delete?
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prescriptionsRetrieved.map((values, key) => (
              <TableRow key={key}>
                <TableCell>{patientName}</TableCell>
                <TableCell>{values.diagnosis}</TableCell>
                <TableCell> {values.drug_name}</TableCell>
                <TableCell>{values.dose}</TableCell>
                <TableCell>{values.frequency}</TableCell>
                <TableCell>
                  {values.updated_at.slice(0, 10)}
                  {" / "}
                  {values.updated_at.slice(11, 16)}
                  {" hrs"}
                </TableCell>
                <TableCell>
                  <DeleteForeverIcon
                    color="error"
                    onClick={() => {
                      handleDelete(values.id);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <br></br>
      <Button variant="contained" color="success" onClick={() => navigate(-1)}>
        Back to previous page
      </Button>
      <Dialog
        open={openDeleteDialog}
        onClose={handleDialogCloseDisagree}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete prescription for this patient?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This step is irreversible. Prescription data will be deleted from
            database forever.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogCloseAgree}
            autoFocus
            variant="contained"
            color="success"
          >
            Agree
          </Button>
          <Button
            onClick={handleDialogCloseDisagree}
            variant="contained"
            color="error"
          >
            Disagree
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openDeleteSuccess}
        autoHideDuration={2000}
        onClose={handleCloseSuccess}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Prescription successfully deleted!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openDeleteFailure}
        autoHideDuration={2000}
        onClose={handleCloseFailure}
      >
        <Alert
          onClose={handleCloseFailure}
          severity="error"
          sx={{ width: "100%" }}
        >
          Error! Prescription isn't deleted!
        </Alert>
      </Snackbar>
    </Container>
  );
}
