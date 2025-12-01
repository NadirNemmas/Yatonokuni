// AppRoute.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import Projects from "../pages/Projects.jsx";
import GameMasterArtefact from "../pages/GameMasterArtefact.jsx";
import Licence from "../pages/Licence.jsx";

export default function AppRoute() {
  return (
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
  );
}
