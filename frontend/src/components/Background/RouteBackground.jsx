import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { routeBackgrounds } from "../../lib/data/routeBackgrounds.js";

export default function RouteBackground({ children }) {
  const { pathname } = useLocation();
  const bg =
    routeBackgrounds[pathname] ??
    Object.entries(routeBackgrounds)
      .sort(([a], [b]) => b.length - a.length)
      .find(([key]) => key !== "/" && pathname.startsWith(key))?.[1];

  useEffect(() => {
    if (bg) {
      document.body.style.backgroundImage = `url(${bg})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundColor = "transparent";
    } else {
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = "";
    }
    return () => {
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = "";
    };
  }, [bg]);

  return <>{children}</>;
}
