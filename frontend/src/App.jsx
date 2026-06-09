import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import AppRoute from "./router/AppRoute.jsx";
import "./styles/global.scss";

createRoot(document.getElementById("react-root")).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <AppRoute />
      </AuthProvider>
    </Router>
  </StrictMode>
);
