import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import NavigationButton from "../Buttons/NavigationButton.jsx";
const scrollToSection = (id) => {
  const element = document.getElementById(id);
  element?.scrollIntoView({ behavior: "smooth" });
};
export default function NavBar() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  return (
    <div className="navbar-wrapper">
      <div className="navbar">
        <ul>
          <li>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              Accueil
            </a>
          </li>
          <li>
            <a
              href="/#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("about");
              }}
            >
              À propos
            </a>
          </li>
          <li>
            <a
              href="/#features"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("features");
              }}
            >
              Fonctionnalités
            </a>
          </li>
          <li>
            <a
              href="/#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
            >
              Contact
            </a>
          </li>

          <li>
            <a
              href="/projects"
              onClick={(e) => {
                e.preventDefault();
                navigate("/projects");
              }}
            >
              Mes Projets
            </a>
          </li>
        </ul>
      </div>

      <div className="navbar-authentication">
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          <div className="navbar-user">
            <div className="user-avatar">
              {user.email?.[0]?.toUpperCase() || "U"}
            </div>

            <span>{user.email}</span>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <>
            <NavigationButton
              title="Connexion"
              destination="/login"
            ></NavigationButton>
            <NavigationButton
              title="S'inscrire"
              destination="/signup"
            ></NavigationButton>
          </>
        )}
      </div>
    </div>
  );
}
