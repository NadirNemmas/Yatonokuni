import { useNavigate } from "react-router-dom";
import "./styles/buttons.scss";
export default function HomeButton({ title }) {
  const navigate = useNavigate();
  return (
    <button className="button" type="button" onClick={() => navigate("/")}>
      {title}
    </button>
  );
}
