import { Routes, Route } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import Projects from "../pages/Projects.jsx";
import Profile from "../pages/Profile.jsx";
import GameMasterArtefact from "../pages/GameMasterArtefact.jsx";
import Licence from "../pages/Licence.jsx";
import Lostark from "../pages/Lostark.jsx";
import LostarkAccount from "../pages/LostarkAccount.jsx";
import GameRoute from "../context/GameRoute.jsx";
import ProtectedRoute from "../context/ProtectedRoutes.jsx";

export default function AppRoute() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/projects" element={<Projects />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/lostark" element={<GameRoute game="lost-ark"><Lostark /></GameRoute>} />
        <Route path="/lostark/account/:id" element={<GameRoute game="lost-ark"><LostarkAccount /></GameRoute>} />

        <Route
          path="/projects/gamemasterartefact"
          element={<GameMasterArtefact />}
        />
        <Route path="/licence" element={<Licence />} />
      </Routes>
    </>
  );
}
