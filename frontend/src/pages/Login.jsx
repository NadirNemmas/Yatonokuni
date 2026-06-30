import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout/Layout.jsx";
import SubmitForm from "../components/Forms/SubmitForms.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const resolveUserShape = (userPayload) => {
    if (!userPayload) return null;
    if (userPayload.profile) return userPayload.profile;
    if (userPayload.authUser) return userPayload.authUser;
    return userPayload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        const errMsg = data?.message || `Erreur HTTP ${res.status}`;
        setMessage(errMsg);
        setLoading(false);
        return;
      }

      if (data.ok && data.user) {
        const normalized = resolveUserShape(data.user);
        setUser(normalized);
        setMessage(t("login.success"));
        navigate("/", { replace: true });
      } else {
        setMessage(data.message || t("login.networkError"));
      }
    } catch (err) {
      console.error("Login fetch error:", err);
      setMessage(t("login.networkError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-container-section">
        <SubmitForm
          title={t("login.title")}
          message={message}
          onSubmit={handleSubmit}
          loading={loading}
          primaryButtonLabel={t("login.submit")}
          secondaryButtonLabel={t("login.cancel")}
          textEndForm={
            <>
              {t("login.noAccount")}{" "}
              <a href="/signup">{t("login.signupLink")}</a>{" "}
            </>
          }
        >
          <div>
            <label htmlFor="email">{t("login.email")} :</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password">{t("login.password")} :</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              required
            />
          </div>
        </SubmitForm>
      </div>
    </Layout>
  );
}
