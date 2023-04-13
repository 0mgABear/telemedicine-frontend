import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Container } from "@mui/material";

export default function HomePage() {
  const { getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();
  const [patientDetails, setPatientDetails] = useState({});
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (user && !accessToken) {
      getAccessTokenSilently().then((jwt) => {
        setAccessToken(jwt);
        axios
          .get(`http://localhost:3000/patients/${user.email}`)
          .then(function (response) {
            console.log(response.data);
            setPatientDetails(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      });
    }
  }, [user, accessToken]);

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/editprofile");
  };

  return (
    <Container sx={{ padding: 5 }}>
      <h1>
        Welcome, {patientDetails.last_name} {patientDetails.first_name}
      </h1>
      <h2>Patient details:</h2>
      <p>Email address: {patientDetails.email}</p>
      <p>NRIC number: {patientDetails.ic_number}</p>
      <p>Age: {patientDetails.age} years old</p>
      <p>Gender: {patientDetails.gender}</p>
      <p>Height: {patientDetails.height} cm</p>
      <p>Weight: {patientDetails.weight} kg</p>
      <p>
        Address: {patientDetails.address} Singapore {patientDetails.postal_code}
      </p>
      <p>Medical history: {patientDetails.medical_history}</p>
      <Button variant="contained" color="success" onClick={handleClick}>
        Edit patient profile
      </Button>
    </Container>
  );
}
