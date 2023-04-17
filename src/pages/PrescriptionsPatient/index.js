import { useAuth0 } from "@auth0/auth0-react";
import { Button, Container, Grid } from "@mui/material";
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

export default function PrescriptionsPatient() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);
  const [prescriptionsRetrieved, setPrescriptionsRetrieved] = useState([]);
  const [patientName, setPatientName] = useState("");
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
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <Container sx={{ padding: 5 }}>
      <h1>Dr {doctorname},</h1>
      <h3>Your past prescriptions for patient {patientName}</h3>
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
                Date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prescriptionsRetrieved.map((values) => (
              <TableRow key={values}>
                <TableCell>{patientName}</TableCell>
                <TableCell>{values.diagnosis}</TableCell>
                <TableCell> {values.drug_name}</TableCell>
                <TableCell>{values.dose}</TableCell>
                <TableCell>{values.frequency}</TableCell>
                <TableCell>{values.updatedAt.slice(0, 10)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <br></br>
      <Button variant="contained" color="success" onClick={() => navigate(-1)}>
        Back to previous page
      </Button>
    </Container>
  );
}
