import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles/buttons.scss";

export default function BackButton() {
  const navigate = useNavigate();
  const [centerX, setCenterX] = useState(null);

  useEffect(() => {
    const pill = document.querySelector(".navbar-pill");
    if (!pill) return;

    const update = () => {
      const rect = pill.getBoundingClientRect();
      setCenterX(rect.left + rect.width / 2);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <button
      className="back-button button"
      onClick={() => navigate("/projects")}
      style={centerX !== null ? { left: centerX } : undefined}
    >
      <ArrowLeft size={16} strokeWidth={1.75} /> Retour
    </button>
  );
}
