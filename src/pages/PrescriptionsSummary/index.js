import { useAuth0 } from "@auth0/auth0-react";
import { Button, Container, Grid } from "@mui/material";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function PrescriptionsSummary() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);
  const [specialty, setSpecialty] = useState("");
  const [patientsList, setPatientsList] = useState([]);
  const [patientsNames, setPatientsNames] = useState([]);
  const doctorname = localStorage.getItem("doctorname");
  const doctorId = localStorage.getItem("doctorid");
  const specialtyId = localStorage.getItem("specialtyid");
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !accessToken) {
      getAccessTokenSilently().then((jwt) => setAccessToken(jwt));
    }
  }, [user, accessToken]);

  const configs = {};
  if (accessToken) configs.headers = { Authorization: `Bearer ${accessToken}` };

  useEffect(() => {
    if (doctorname !== "") {
      axios
        .get(`http://localhost:3000/specialty/${specialtyId}`, configs)
        .then(function (response) {
          console.log(response);
          setSpecialty(response.data.name);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/prescriptions/${doctorId}`, configs)
      .then(function (response) {
        console.log(response);
        const tempSet = new Set();
        for (let x = 0; x < response.data.length; x++) {
          tempSet.add(response.data[x].patient_id);
        }
        setPatientsList([...tempSet]);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const tempArray = [];
    const promises = [];
    for (let x = 0; x < patientsList.length; x++) {
      promises.push(
        axios
          .get(`http://localhost:3000/patientid/${patientsList[x]}`, configs)
          .then(function (response) {
            console.log(response);
            tempArray.push(response.data);
          })
          .catch(function (error) {
            console.log(error);
          })
      );
    }

    Promise.all(promises).then(() => {
      setPatientsNames(tempArray);
    });
  }, [patientsList]);

  return (
    <Container sx={{ padding: 5 }}>
      <h1>
        Welcome, Dr {doctorname} ({specialty.toLocaleUpperCase()})
      </h1>
      <h3>Your past patients' prescriptions</h3>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgb(128,207,165)" }}>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                Patients' names
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                Date of prescription
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>
                View more
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patientsNames.map((values, key) => (
              <TableRow key={key}>
                <TableCell>
                  {values.last_name} {values.first_name}
                </TableCell>
                <TableCell>{values.updatedAt.slice(0, 10)}</TableCell>
                <TableCell>
                  <Link
                    to={`http://localhost:3001/prescriptions/patient/${values.id}`}
                  >
                    <VisibilityOutlinedIcon color="success" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br></br>
      <Button
        variant="contained"
        color="success"
        onClick={() => navigate("/prescriptions/doctor")}
      >
        Add new prescription
      </Button>
    </Container>
  );
}
