import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "../../src/context/AuthContext.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Projects from "./Projects.jsx";
import GameMasterArtefact from "./GameMasterArtefact.jsx";
import "../../public/css/style.css";

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
        </Routes>
      </AuthProvider>
    </Router>
  </StrictMode>
);
