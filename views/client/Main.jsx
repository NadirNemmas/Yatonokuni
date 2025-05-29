import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./home.jsx";
import "../../public/css/style.css";

createRoot(document.getElementById("react-root")).render(
  <StrictMode>
    <Home />
  </StrictMode>
);
