import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^\+?[0-9\s\-()]{7,20}$/;

  // Ajout de classe CSS en fonction de la route
  const routeClass = location.pathname
    .replace(/^\//, "")
    .replace(/\//g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "");

  function validate(values) {
    const e = {};
    if (!values.firstName.trim()) e.firstName = "Prénom requis";
    if (!values.lastName.trim()) e.lastName = "Nom de famille requis";
    if (!values.email.trim()) e.email = "Email requis";
    else if (!emailRe.test(values.email)) e.email = "Entrez un email valide";
    if (!values.password) e.password = "Mot de passe requis";
    else if (values.password.length < 8)
      e.password = "Le mot de passe doit contenir au moins 8 caractères";
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

    setSubmitting(true);
    try {
      // Replace URL with your real signup endpoint
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Signup failed");
      }

      setMessage({ type: "success", text: "Account created successfully." });
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
      });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Server error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={`app-container ${routeClass}`}>
      <Layout>
        <div className="page-container">
          <div className="page-container-section">
            <div className="div-box-container">
              {message && <div role="status">{message.text}</div>}
              <h2>Créer un compte</h2>
              <form onSubmit={handleSubmit} noValidate>
                <div>
                  <div>
                    <label>
                      Prénom{" "}
                      <input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        aria-invalid={!!errors.firstName}
                        aria-describedby={
                          errors.firstName ? "err-firstName" : undefined
                        }
                        required
                      />
                    </label>

                    {errors.firstName && (
                      <div
                        id="err-firstName"
                        role="alert"
                        className="required_field_indicator"
                      >
                        {errors.firstName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label>
                      Nom de famille{" "}
                      <input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        aria-invalid={!!errors.lastName}
                        aria-describedby={
                          errors.lastName ? "err-lastName" : undefined
                        }
                        required
                      />
                    </label>

                    {errors.lastName && (
                      <div
                        id="err-lastName"
                        role="alert"
                        className="required_field_indicator"
                      >
                        {errors.lastName}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label>
                    Émail{" "}
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
                    <div
                      id="err-email"
                      role="alert"
                      className="required_field_indicator"
                    >
                      {errors.email}
                    </div>
                  )}
                </div>
                <div>
                  <label>
                    Mots de passe{" "}
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        errors.password ? "err-password" : undefined
                      }
                      required
                    />
                  </label>

                  {errors.password && (
                    <div
                      id="err-password"
                      role="alert"
                      className="required_field_indicator"
                    >
                      {errors.password}
                    </div>
                  )}
                </div>

                <button type="submit" disabled={submitting}>
                  {submitting ? "Création du compte..." : "S'inscrire"}
                </button>
                <button type="button" onClick={() => navigate("/")}>
                  Accueil
                </button>
              </form>
              <p>
                Vous avez déjà un compte ? {""}
                <a href="/login">Connectez-vous ici</a>
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
