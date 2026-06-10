import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import NavigationButton from "../Buttons/NavigationButton.jsx";
import { Menu, X, Home, FolderOpen, LogOut } from "lucide-react";
import "./styles/navbar.scss";

const NAV_ITEMS = [
  { label: "Accueil", icon: Home, type: "route", to: "/" },
  { label: "Mes Projets", icon: FolderOpen, type: "route", to: "/projects" },
];

export default function NavBar() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

  const handleItem = (item) => {
    navigate(item.to);
    if (item.to === "/") window.scrollTo({ top: 0, behavior: "smooth" });
    closeDrawer();
  };

  return (
    <>
      <div className="navbar-wrapper">
        <div className="navbar-pill">
          <button
            className="hamburger-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={20} />
          </button>
          <ul className="nav-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.to}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItem(item);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-auth">
          {loading ? null : user ? (
            <div className="navbar-user">
              <div className="user-avatar">
                {user.email?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="user-email">{user.email}</span>
              <button className="logout-btn" onClick={logout}>
                <LogOut size={14} /> Déconnexion
              </button>
            </div>
          ) : (
            <>
              <NavigationButton title="Connexion" destination="/login" />
              <NavigationButton title="S'inscrire" destination="/signup" />
            </>
          )}
        </div>
      </div>

      <div
        className={`nav-drawer-overlay${drawerOpen ? " open" : ""}`}
        onClick={closeDrawer}
      >
        <nav className="nav-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="nav-drawer-header">
            <span className="nav-drawer-brand">Yato no Kuni</span>
            <button
              className="nav-drawer-close"
              onClick={closeDrawer}
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
          </div>

          <ul className="nav-drawer-links">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button onClick={() => handleItem(item)}>
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="nav-drawer-footer">
            {loading ? null : user ? (
              <div className="drawer-user">
                <div className="user-avatar large">
                  {user.email?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="drawer-user-info">
                  <div className="drawer-user-email">{user.email}</div>
                  <button
                    className="drawer-logout"
                    onClick={() => {
                      logout();
                      closeDrawer();
                    }}
                  >
                    <LogOut size={13} /> Deconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="drawer-auth-buttons">
                <button
                  onClick={() => {
                    navigate("/login");
                    closeDrawer();
                  }}
                >
                  Connexion
                </button>
                <button
                  className="primary"
                  onClick={() => {
                    navigate("/signup");
                    closeDrawer();
                  }}
                >
                  S'inscrire
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
