import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext.jsx";
import { Github, Linkedin, Instagram, Globe, Camera } from "lucide-react";
import "./styles/profile-card.scss";

const EXTERNAL_LINKS = [
  { key: "github_url", icon: Github, label: "GitHub" },
  { key: "linkedin_url", icon: Linkedin, label: "LinkedIn" },
  { key: "instagram_url", icon: Instagram, label: "Instagram" },
  { key: "website_url", icon: Globe, label: "Site web" },
];

function resizeToBase64(file, maxPx = 256) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function ProfileCard() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { t } = useTranslation();
  const fileRef = useRef(null);
  const initialForm = useRef({});

  const [readOnly, setReadOnly] = useState({ first_name: "", last_name: "" });
  const [form, setForm] = useState({
    email: "",
    username: "",
    date_of_birth: "",
    github_url: "",
    linkedin_url: "",
    instagram_url: "",
    website_url: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (!user) return;
    setReadOnly({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
    });
    const loaded = {
      email: user.email || "",
      username: user.username || "",
      date_of_birth: user.date_of_birth || "",
      github_url: user.github_url || "",
      linkedin_url: user.linkedin_url || "",
      instagram_url: user.instagram_url || "",
      website_url: user.website_url || "",
    };
    initialForm.current = loaded;
    setForm(loaded);
    if (user.avatar_url) setAvatarPreview(user.avatar_url);
  }, [user?.id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await resizeToBase64(file, 256);
    setAvatarPreview(b64);
    setAvatarFile(b64);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    const diff = {};
    for (const key of Object.keys(initialForm.current)) {
      if (form[key] !== initialForm.current[key]) diff[key] = form[key];
    }

    if (!Object.keys(diff).length && !avatarFile) {
      setMessage({ type: "info", text: t("profile.noChange") });
      return;
    }

    setLoading(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const body = { ...diff };
      if (avatarFile) body.avatar = avatarFile;

      const res = await fetch("/auth/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok)
        throw { message: data?.message || t("profile.error") };

      setUser((prev) => ({ ...prev, ...data.profile }));
      initialForm.current = { ...form };
      setAvatarFile(null);
      setLoading(false);
      setSuccessMsg(t("profile.success"));
      setCountdown(2);
      await new Promise((r) => setTimeout(r, 1000));
      setCountdown(1);
      await new Promise((r) => setTimeout(r, 1000));
      setSuccessMsg(null);
    } catch (err) {
      const isTimeout = err?.name === "AbortError";
      setLoading(false);
      setMessage({
        type: "error",
        text: isTimeout
          ? t("signup.errors.timeout")
          : err.message || t("profile.error"),
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  const displayName = readOnly.first_name
    ? `${readOnly.first_name} ${readOnly.last_name}`
    : form.username || form.email || "—";
  const avatarLetter = (form.username || form.email || "?")[0]?.toUpperCase();

  return (
    <>
      {(loading || successMsg) && (
        <div className="loading-overlay">
          {successMsg ? (
            <>
              <div className="success-check">✓</div>
              <p>{successMsg}</p>
              <p className="overlay-countdown">
                {t("profile.redirectIn", { count: countdown })}
              </p>
            </>
          ) : (
            <>
              <div className="loader" />
              <p>{t("profile.loading")}</p>
            </>
          )}
        </div>
      )}

      <div className="profile-card">
        {/* ── Sidebar ── */}
        <aside className="profile-sidebar">
          <div className="profile-avatar-wrap">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="avatar"
                className="profile-avatar-img"
              />
            ) : (
              <div className="profile-avatar-placeholder">{avatarLetter}</div>
            )}
            <button
              type="button"
              className="profile-avatar-btn"
              onClick={() => fileRef.current?.click()}
              title={t("profile.changePhoto")}
            >
              <Camera size={14} />
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
          <div className="profile-sidebar-name">{displayName}</div>
          {form.username && (
            <div className="profile-sidebar-handle">@{form.username}</div>
          )}
          <div className="profile-sidebar-email">{form.email}</div>
        </aside>

        {/* ── Main ── */}
        <main className="profile-main">
          <form onSubmit={handleSubmit} style={{ display: "contents" }}>
            {message && (
              <p className={`alert-message alert-message--${message.type}`}>
                {message.text}
              </p>
            )}

            <section>
              <h3 className="profile-section-title">
                {t("profile.sectionInfo")}
              </h3>
              <div className="profile-grid">
                <div className="profile-field profile-field--readonly">
                  <label>{t("profile.firstName")}</label>
                  <input value={readOnly.first_name} readOnly disabled />
                </div>

                <div className="profile-field profile-field--readonly">
                  <label>{t("profile.lastName")}</label>
                  <input value={readOnly.last_name} readOnly disabled />
                </div>

                <div className="profile-field">
                  <label>{t("profile.email")}</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="profile-field">
                  <label>
                    {t("profile.username")}
                    <span className="profile-optional">
                      {t("profile.optional")}
                    </span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder={t("profile.usernamePlaceholder")}
                  />
                </div>

                <div className="profile-field profile-field--span">
                  <label>
                    {t("profile.dateOfBirth")}
                    <span className="profile-optional">
                      {t("profile.optional")}
                    </span>
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="profile-section-title">
                {t("profile.sectionLinks")}
              </h3>
              <div className="profile-grid">
                {EXTERNAL_LINKS.map(({ key, icon: Icon, label }) => (
                  <div className="profile-field" key={key}>
                    <label>
                      <Icon size={13} className="profile-link-icon" />
                      {label}
                    </label>
                    <input
                      type="url"
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>
                ))}
              </div>
            </section>

            <div className="profile-actions">
              <button type="submit" className="button" disabled={loading}>
                {t("profile.save")}
              </button>
              <button
                type="button"
                className="button button--secondary"
                onClick={() => navigate(-1)}
              >
                {t("profile.cancel")}
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
