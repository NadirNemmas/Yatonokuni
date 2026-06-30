import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout/Layout.jsx";
import SubmitForm from "../components/Forms/SubmitForms.jsx";
import "./styles/pages.scss";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const resolveUserShape = (userPayload) => {
    if (!userPayload) return null;
    if (userPayload.profile) return userPayload.profile;
    if (userPayload.authUser) return userPayload.authUser;
    return userPayload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        throw { status: res.status, message: data?.message || `Erreur HTTP ${res.status}` };
      }

      if (data.ok && data.user) {
        const normalized = resolveUserShape(data.user);
        setUser(normalized);
        setLoading(false);
        setSuccessMsg(t("login.success"));
        setCountdown(2);
        await new Promise((r) => setTimeout(r, 1000));
        setCountdown(1);
        await new Promise((r) => setTimeout(r, 1000));
        navigate("/", { replace: true });
      } else {
        throw { status: res.status, message: data.message || t("login.networkError") };
      }
    } catch (err) {
      const isTimeout = err?.name === "AbortError";
      const text = isTimeout ? t("login.timeout") : (err.message || t("login.networkError"));
      setLoading(false);
      setMessage({ type: "error", text });
    } finally {
      clearTimeout(timeout);
    }
  };

  return (
    <Layout>
      <div className="page-container-section">
        {(loading || successMsg) && (
          <div className="loading-overlay">
            {successMsg ? (
              <>
                <div className="success-check">✓</div>
                <p>{successMsg}</p>
                <p className="overlay-countdown">{t("login.redirectIn", { count: countdown })}</p>
              </>
            ) : (
              <>
                <div className="loader"></div>
                <p>{t("login.loading")}</p>
              </>
            )}
          </div>
        )}
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
