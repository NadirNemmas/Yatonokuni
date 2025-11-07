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
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>

          {user && (
            <li>
              <a
                href="/dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/dashboard");
                }}
              >
                Mon espace
              </a>
            </li>
          )}

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
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          <div className="navbar-user">
            {/* un petit avatar "fake" pour le moment */}
            <div className="user-avatar">
              {user.email?.[0]?.toUpperCase() || "U"}
            </div>

            <span>{user.email}</span>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/signup")}>Signup</button>
          </>
        )}
      </div>
    </div>
  );
}
