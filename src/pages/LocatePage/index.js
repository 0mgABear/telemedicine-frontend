import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Container } from "@mui/material";

const containerStyle = {
  width: "600px",
  height: "600px",
  margin: "15px auto",
};

export default function LocateClinic (){
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API,
  });

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        setError(error.message);
      }
    );
  }, []);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleSearchClick = () => {
    console.log("hello");
  };

  return isLoaded ? (
    <Container style={containerStyle}>
      {error ? (
        <div>{error}</div>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={17}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <Marker position={center} />
          <button
            onClick={handleSearchClick}
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              zIndex: 1,
            }}
          >
            Search
          </button>
        </GoogleMap>
      )}
    </Container>
  ) : (
    <></>
  );
};
