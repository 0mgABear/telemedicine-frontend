import React, { useEffect, useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Container, Typography } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

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
  const [selectedClinic, setSelectedClinic] = useState(null);

  const handleMarkerClick = (clinic) => {
    setSelectedClinic(clinic);
  };

  const handleClose = () => {
    setSelectedClinic(null);
  };

  const getGoogleMapsUrl = (placeId) => {
    const baseUrl = "https://www.google.com/maps/place/";
    const url = new URL(baseUrl);
    url.searchParams.append("q", `place_id:${placeId}`);
    return url.toString();
  };

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
      query: "clinics near me",
    };

    const service = new window.google.maps.places.PlacesService(map);
    service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const clinicsWithNumber = results.map((clinic) => {
          return { ...clinic, phone_number: null };
        });
        setClinics(clinicsWithNumber);
      }
    });
    clinics.map((clinic) => {
      //iterate through every clinic in clinic state
      const service = new window.google.maps.places.PlacesService(map);
      const phoneNumbRequest = {
        placeId: clinic.place_id, //pass each clinic place id
        fields: ["formatted_phone_number"],
      };
      service.getDetails(phoneNumbRequest, (place, status) => {
        if ((status = window.google.maps.places.PlacesServiceStatus.OK)) {
          const clinicToUpdate = clinics.find(
            (c) => c.place_id === phoneNumbRequest.placeId
          );
          if (clinicToUpdate) {
            //if presernce of match
            clinicToUpdate.phone_number = place.formatted_phone_number; //updating the field
          }
        }
      });
    });
  };

  useEffect(() => {
    setClinics(clinics);
  }, [clinics]);

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
  }, [map, user]);

  const onLoad = useCallback(
    function callback(map) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
      setMap(map);
    },
    [center]
  );

  const onUnmount = useCallback(function (map) {
    setMap(null);
  }, []);

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
                onMouseOver={() => {
                  handleMarkerClick(clinic);
                }}
              />
            ))}
            {selectedClinic && (
              <InfoWindow
                position={selectedClinic.geometry.location}
                onCloseClick={handleClose}
              >
                <div>
                  <Typography variant="h6">{selectedClinic.name}</Typography>
                  {/* <Typography variant="body1">
                    {selectedClinic.phone_number}
                  </Typography> */}
                  <Typography variant="body1">
                    {selectedClinic.formatted_address}
                  </Typography>

                  <Typography variant="body1">
                    <a
                      href={getGoogleMapsUrl(selectedClinic.place_id)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Google Maps
                    </a>
                  </Typography>
                </div>
              </InfoWindow>
            )}

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
