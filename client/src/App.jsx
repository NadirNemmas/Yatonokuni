import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Projects from "./pages/Projects.jsx";
import GameMasterArtefact from "./pages/GameMasterArtefact.jsx";
import Licence from "./pages/Licence.jsx";
import "./styles/global.css";

createRoot(document.getElementById("react-root")).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/projects" element={<Projects />} />
          <Route
            path="/projects/gamemasterartefact"
            element={<GameMasterArtefact />}
          />
          <Route path="/licence" element={<Licence />} />
        </Routes>
      </AuthProvider>
    </Router>
  </StrictMode>
);
