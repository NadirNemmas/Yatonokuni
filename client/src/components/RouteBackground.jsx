import { useLocation } from "react-router-dom";
import { routeBackgrounds } from "../lib/data/routeBackgrounds.js";

export default function RouteBackground({ children }) {
  const { pathname } = useLocation();
  const bg = routeBackgrounds[pathname];

  return (
    <div
      style={{
        backgroundImage: bg ? `url(${bg})` : "none",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}
