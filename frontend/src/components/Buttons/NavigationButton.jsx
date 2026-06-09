import { useNavigate } from "react-router-dom";
import "./styles/buttons.scss";

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
