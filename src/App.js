import "./App.css";
import * as React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import LoadingPage from "./pages/LoadingPage";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import CreateProfile from "./pages/CreateProfile";
import WrapperPage from "./pages/WrapperPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WrapperPage />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/createprofile" element={<CreateProfile />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
