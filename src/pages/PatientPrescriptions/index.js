import { useAuth0 } from "@auth0/auth0-react";
import { Button, Container } from "@mui/material";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import * as React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PrescriptionsPDF from "../PrescriptionPDF";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

export default function PrescriptionsPatient() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);
  const [prescriptionsRetrieved, setPrescriptionsRetrieved] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [patientDrugAllergy, setPatientDrugAllergy] = useState("");
  const patientLogin = localStorage.getItem("patientid")

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
        `http://localhost:3000/prescriptions/patientown/${patientLogin}`,
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
      .get(`http://localhost:3000/patientid/${patientLogin}`, configs)
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
      <h1>{patientName}, your past prescriptions</h1>
      <h3>
        Drug allergies:{" "}
        <span style={{ color: "red" }}>{patientDrugAllergy}</span>
      </h3>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgb(128,207,165)" }}>
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
                Save as PDF?
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prescriptionsRetrieved.map((values, key) => (
              <TableRow key={key}>
                <TableCell>{values.diagnosis}</TableCell>
                <TableCell> {values.drug_name}</TableCell>
                <TableCell>{values.dose}</TableCell>
                <TableCell>{values.frequency}</TableCell>
                <TableCell>
                  {values.updatedAt.slice(0, 10)}
                  {" / "}
                  {values.updatedAt.slice(11, 16)}
                  {" hrs"}
                </TableCell>
                <TableCell>
                  <PDFDownloadLink
                    style={{ textDecoration: "none" }}
                    document={
                      <PrescriptionsPDF
                        patientName={patientName}
                        diagnosis={values.diagnosis}
                        drugName={values.drug_name}
                        dose={values.dose}
                        frequency={values.frequency}
                        date={values.updatedAt.slice(0, 10)}
                        time={values.updatedAt.slice(11, 16)}
                      />
                    }
                    fileName="prescription.pdf"
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? (
                        <p>Error loading PDF</p>
                      ) : (
                        <Button variant="contained" color="success">
                          <PictureAsPdfIcon />
                        </Button>
                      )
                    }
                  </PDFDownloadLink>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
