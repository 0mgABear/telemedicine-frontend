import "./App.css";
import * as React from "react";
import { useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import LoadingPage from "./pages/LoadingPage";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import CreateProfile from "./pages/CreateProfile";
import WrapperPage from "./pages/WrapperPage";
import EditProfile from "./pages/EditProfile";
import PrescriptionsSummary from "./pages/PrescriptionsSummary";
import PrescriptionsPatient from "./pages/PrescriptionsPatient";
import PrescriptionsPage from "./pages/PrescriptionsPage";
import LocateClinic from "./pages/LocatePage"
import PatientPrescriptions from "./pages/PatientPrescriptions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WrapperPage />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/createprofile" element={<CreateProfile />} />
          <Route path="/editprofile" element={<EditProfile />} />
          <Route path="/locate" element={<LocateClinic />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/prescriptions" element={<PrescriptionsSummary />} />
          <Route path="/patientprescriptions" element={<PatientPrescriptions />} />
          <Route
            path="/prescriptions/patient/:patient_id"
            element={<PrescriptionsPatient />}
          />
          <Route path="/prescriptions/doctor" element={<PrescriptionsPage />} />
          <Route path="/locate" element={<LocateClinic />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
