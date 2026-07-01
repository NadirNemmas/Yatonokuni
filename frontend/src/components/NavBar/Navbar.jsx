import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTranslation } from "react-i18next";
import NavigationButton from "../Buttons/NavigationButton.jsx";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher.jsx";
import { Menu, X, Home, FolderOpen, LogOut, User, Swords } from "lucide-react";
import "./styles/navbar.scss";

function UserMenu({ direction = "down", onProfile, onLogout, t }) {
  return (
    <div
      className={`user-dropdown${direction === "up" ? " user-dropdown--up" : ""}`}
    >
      <button className="user-dropdown-item" onClick={onProfile}>
        <User size={14} /> {t("nav.profile")}
      </button>
      <div className="user-dropdown-sep" />
      <button
        className="user-dropdown-item user-dropdown-item--danger"
        onClick={onLogout}
      >
        <LogOut size={14} /> {t("nav.logout")}
      </button>
    </div>
  );
}

export default function NavBar() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [drawerUserMenuOpen, setDrawerUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const drawerUserMenuRef = useRef(null);

  const GAME_NAV = {
    "lost-ark": {
      label: "Lost Ark",
      icon: Swords,
      type: "route",
      to: "/lostark",
    },
  };

  const NAV_ITEMS = [
    { label: t("nav.home"), icon: Home, type: "route", to: "/" },
    ...(user?.games ?? []).filter((g) => GAME_NAV[g]).map((g) => GAME_NAV[g]),
    {
      label: t("nav.projects"),
      icon: FolderOpen,
      type: "route",
      to: "/projects",
    },
  ];

  const closeDrawer = () => setDrawerOpen(false);

  const handleItem = (item) => {
    navigate(item.to);
    if (item.to === "/") window.scrollTo({ top: 0, behavior: "smooth" });
    closeDrawer();
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (
        drawerUserMenuRef.current &&
        !drawerUserMenuRef.current.contains(e.target)
      ) {
        setDrawerUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="navbar-wrapper">
        <div className="navbar-pill">
          <button
            className="hamburger-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label={t("nav.openMenu")}
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
            <div className="navbar-user" ref={userMenuRef}>
              <button
                className="user-trigger"
                onClick={() => setUserMenuOpen((o) => !o)}
                title={user.username || user.email}
              >
                <div className="user-avatar">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="avatar"
                      className="user-avatar-img"
                    />
                  ) : (
                    (user.username || user.email)?.[0]?.toUpperCase() || "U"
                  )}
                </div>
                <span className="user-email">
                  {user.username || user.email}
                </span>
              </button>

              {userMenuOpen && (
                <UserMenu
                  onProfile={() => {
                    navigate("/profile");
                    setUserMenuOpen(false);
                  }}
                  onLogout={() => {
                    logout();
                    setUserMenuOpen(false);
                  }}
                  t={t}
                />
              )}
            </div>
          ) : (
            <>
              <NavigationButton title={t("nav.login")} destination="/login" />
              <NavigationButton title={t("nav.signup")} destination="/signup" />
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
            <span className="nav-drawer-brand">{t("nav.brand")}</span>
            <button
              className="nav-drawer-close"
              onClick={closeDrawer}
              aria-label={t("nav.close")}
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
              <div className="drawer-user" ref={drawerUserMenuRef}>
                <button
                  className="user-trigger"
                  onClick={() => setDrawerUserMenuOpen((o) => !o)}
                  title={user.username || user.email}
                >
                  <div className="user-avatar large">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt="avatar"
                        className="user-avatar-img"
                      />
                    ) : (
                      (user.username || user.email)?.[0]?.toUpperCase() || "U"
                    )}
                  </div>
                  <span className="drawer-user-email">
                    {user.username || user.email}
                  </span>
                </button>

                {drawerUserMenuOpen && (
                  <UserMenu
                    direction="up"
                    onProfile={() => {
                      navigate("/profile");
                      setDrawerUserMenuOpen(false);
                      closeDrawer();
                    }}
                    onLogout={() => {
                      logout();
                      setDrawerUserMenuOpen(false);
                      closeDrawer();
                    }}
                    t={t}
                  />
                )}
              </div>
            ) : (
              <div className="drawer-auth-buttons">
                <button
                  onClick={() => {
                    navigate("/login");
                    closeDrawer();
                  }}
                >
                  {t("nav.login")}
                </button>
                <button
                  className="primary"
                  onClick={() => {
                    navigate("/signup");
                    closeDrawer();
                  }}
                >
                  {t("nav.signup")}
                </button>
              </div>
            )}
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </>
  );
}
