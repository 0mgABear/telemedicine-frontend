import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoadingPage() {
  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);

  const configs = {};
  if (accessToken) configs.headers = { Authorization: `Bearer ${accessToken}` };

  useEffect(() => {
    if (user && !accessToken) {
      getAccessTokenSilently().then((jwt) => {
        setAccessToken(jwt);
      });
    }
    axios
      .get(`http://localhost:3000/allpatients`, configs)
      .then(function (response) {
        console.log(response.data);
        let userFoundInDatabase = false;
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].email === user.email) {
            userFoundInDatabase = true;
          }
        }
        if (!userFoundInDatabase) {
          navigate("/createprofile");
        } else {
          navigate(`/home`);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [user, accessToken]);
  console.log(accessToken);

  return (
    <div>
      <div>Checking login token and existence in database...</div>
    </div>
  );
}