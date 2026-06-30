import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout/Layout.jsx";
import "./styles/pages.scss";
import SubmitForm from "../components/Forms/SubmitForms.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(values) {
    const e = {};
    if (!values.firstName.trim()) e.firstName = t("signup.errors.firstNameRequired");
    if (!values.lastName.trim()) e.lastName = t("signup.errors.lastNameRequired");
    if (!values.email.trim()) e.email = t("signup.errors.emailRequired");
    else if (!emailRe.test(values.email)) e.email = t("signup.errors.emailInvalid");
    if (!values.password) e.password = t("signup.errors.passwordRequired");
    else if (values.password.length < 8)
      e.password = t("signup.errors.passwordTooShort");
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    setLoading(true);
    try {
      const res = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw { status: res.status, message: body.message || "Signup failed" };
      }

      setForm({ firstName: "", lastName: "", email: "", password: "" });
      setLoading(false);
      setSuccessMsg(t("signup.success"));
      setCountdown(2);
      await new Promise((r) => setTimeout(r, 1000));
      setCountdown(1);
      await new Promise((r) => setTimeout(r, 1000));
      navigate("/login");
    } catch (err) {
      const isTimeout = err?.name === "AbortError";
      const code = isTimeout ? 408 : (err.status ?? 500);
      const text = isTimeout
        ? t("signup.errors.timeout")
        : `[${code}] ${err.message || "Server error"}`;
      setLoading(false);
      setMessage({ type: "error", text });
    } finally {
      clearTimeout(timeout);
    }
  }

  return (
    <Layout>
      <div className="page-container-section">
        {(loading || successMsg) && (
          <div className="loading-overlay">
            {successMsg ? (
              <>
                <div className="success-check">✓</div>
                <p>{successMsg}</p>
                <p className="overlay-countdown">{t("signup.redirectIn", { count: countdown })}</p>
              </>
            ) : (
              <>
                <div className="loader"></div>
                <p>{t("signup.loading")}</p>
              </>
            )}
          </div>
        )}
        <SubmitForm
          title={t("signup.title")}
          message={message}
          onSubmit={handleSubmit}
          loading={loading}
          primaryButtonLabel={t("signup.submit")}
          secondaryButtonLabel={t("signup.cancel")}
          textEndForm={
            <>
              {t("signup.hasAccount")}{" "}
              <a href="/login">{t("signup.loginLink")}</a>
            </>
          }
        >
          <div>
            <label>
              {t("signup.lastName")}{" "}
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? "err-lastName" : undefined}
                required
              />
            </label>
            {errors.lastName && (
              <div id="err-lastName" role="alert" className="alert-message">
                {errors.lastName}
              </div>
            )}
          </div>

          <div>
            <div>
              <label>
                {t("signup.firstName")}{" "}
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? "err-firstName" : undefined}
                  required
                />
              </label>
              {errors.firstName && (
                <div id="err-firstName" role="alert" className="alert-message">
                  {errors.firstName}
                </div>
              )}
            </div>
          </div>

          <div>
            <label>
              {t("signup.email")}{" "}
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "err-email" : undefined}
                required
              />
            </label>
            {errors.email && (
              <div id="err-email" role="alert" className="alert-message">
                {errors.email}
              </div>
            )}
          </div>

          <div>
            <label>
              {t("signup.password")}{" "}
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "err-password" : undefined}
                required
              />
            </label>
            {errors.password && (
              <div id="err-password" role="alert" className="alert-message">
                {errors.password}
              </div>
            )}
          </div>
        </SubmitForm>
      </div>
    </Layout>
  );
}
