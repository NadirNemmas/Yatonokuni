import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./buttonStyle.css";
export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      className="back-button button"
      onClick={() => navigate("/projects")}
    >
      <ArrowLeft size={16} strokeWidth={1.75} /> Retour
    </button>
  );
}
