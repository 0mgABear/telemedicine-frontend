import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Container } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { hover } from "@testing-library/user-event/dist/hover";

const containerStyle = {
  width: "550px",
  height: "550px",
  margin: "15px auto",
};

const libraries = ["places"];

export default function LocateClinic() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API,
    libraries: libraries,
  });

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [error, setError] = useState(null);
  const [homePostal, setHomePostal] = useState();
  const [clinics, setClinics] = useState([]);
  const [zoom, setZoom] = useState(15);
  const { user } = useAuth0();
  const [query, setQuery] = useState("");
  const [hoveredMarker, setHoveredMarker] = useState(null);

  useEffect(() => {
    const fetchUserLocation = async () => {
      const response = await axios
        .get(`http://localhost:3000/patients/${user.email}`)
        .then((user) => {
          setHomePostal(user.data.postal_code);
        });
    };

    const getCurrentPosition = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter(
          {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          (error) => {
            setError(error.message);
          }
        );
      });
    };

    if (map && user) {
      fetchUserLocation();
    }
    getCurrentPosition();
  }, [map]);

  const onLoad = useCallback(
    function callback(map) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
      setMap(map);
    },
    [clinics]
  );

  const onUnmount = useCallback(function (map) {
    setMap(null);
  }, []);

  const nearbySearch = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCenter(
        {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        (error) => {
          setError(error.message);
        }
      );
    });
    setZoom(16);
    setQuery("near your current location");
    const request = {
      location: center,
      radius: "5000",
      query: "clinics near me",
    };
    const service = new window.google.maps.places.PlacesService(map);
    service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setClinics(results);
      }
    });
  };

  const homeSearch = () => {
    setQuery("near home");
    setZoom(16);
    axios
      .get(
        `https://developers.onemap.sg/commonapi/search?searchVal=${homePostal}&returnGeom=Y&getAddrDetails=Y`
      )
      .then((res) => {
        setCenter({
          lat: Number(res.data.results[0].LATITUDE),
          lng: Number(res.data.results[0].LONGITUDE),
        });

        const request = {
          location: center,
          radius: "5000",
          query: "clinics near me",
        };
        const service = new window.google.maps.places.PlacesService(map);
        service.textSearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setClinics(results);
          }
        });
      });
  };

  return isLoaded ? (
    <Container style={containerStyle}>
      {error ? (
        <div>
          We encountered an error: {error}. Please enable location services for
          this service.
        </div>
      ) : (
        <div>
          {query && <div>Showing clinics {query}</div>}

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            <Marker position={center} />
            {clinics.map((clinic) => (
              <Marker
                key={clinic.place_id}
                position={clinic.geometry.location}
                name={clinic.name}
                address={clinic.formatted_address}
              />
            ))}

            <button
              onClick={nearbySearch}
              style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
                zIndex: 1,
              }}
            >
              Clinic Near Me
            </button>
            <button
              onClick={homeSearch}
              style={{
                position: "absolute",
                bottom: "40px",
                left: "10px",
                zIndex: 1,
              }}
            >
              Home
            </button>
          </GoogleMap>
        </div>
      )}
    </Container>
  ) : (
    <></>
  );
}
