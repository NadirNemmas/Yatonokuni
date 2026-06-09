import { useNavigate } from "react-router-dom";
import "./buttonStyle.css";

export default function NavigationButton({ title, destination }) {
  const navigate = useNavigate();
  return (
    <button
      className="button"
      type="button"
      onClick={() => navigate(destination)}
    >
      {title}
    </button>
  );
}
