import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../src/context/AuthContext.jsx";

export default function NavBar() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  return (
    <div className="navbar-wrapper">
      <div className="navbar">
        <ul>
          <li>
            <a href="/">Accueil</a>
          </li>
          <li>
            <a href="/#about">À propos</a>
          </li>
          <li>
            <a href="/#features">Fonctionnalités</a>
          </li>
          <li>
            <a href="/#contact">Contact</a>
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
            <button onClick={() => navigate("/login")}>Connexion</button>
            <button onClick={() => navigate("/signup")}>Inscription</button>
          </>
        )}
      </div>
    </div>
  );
}
