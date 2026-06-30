import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n/i18n.js";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProjectsProvider } from "./context/ProjectsContext.jsx";
import AppRoute from "./router/AppRoute.jsx";
import "./styles/global.scss";

createRoot(document.getElementById("react-root")).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <ProjectsProvider>
          <AppRoute />
        </ProjectsProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
