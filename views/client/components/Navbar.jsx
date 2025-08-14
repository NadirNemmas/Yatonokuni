import { useNavigate } from "react-router-dom";
export default function NavBar() {
  const navigate = useNavigate();
  return (
    <div className="navbar-wrapper">
      <div className="navbar">
        <ul>
          <li>
            <a href="#about">About</a>
          </li>

          <li>
            <a href="#features"> Features</a>
          </li>

          <li>
            <a href="#contact">Contact</a>
          </li>

          <li>
            <a
              target="_blank"
              href="https://github.com/NadirNemmas/GameMasterArtefact"
            >
              Yato no Discord Bot
            </a>
          </li>
        </ul>
      </div>

      <div className="navbar-authentication">
        <button onClick={() => navigate("/Login")}>Login</button>
        <button onClick={() => navigate("/Signup")}>Signup</button>
      </div>
    </div>
  );
}
