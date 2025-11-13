import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    if (!values.firstName.trim()) e.firstName = "First name is required";
    if (!values.lastName.trim()) e.lastName = "Last name is required";
    if (!values.email.trim()) e.email = "Email is required";
    else if (!emailRe.test(values.email)) e.email = "Enter a valid email";
    if (!values.password) e.password = "Password is required";
    else if (values.password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (!values.phone.trim()) e.phone = "Phone number is required";
    else if (!phoneRe.test(values.phone))
      e.phone = "Enter a valid phone number";
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
      <div className="page-container">
        <div className="page-container-section">
          <div className="div-box-container">
            {message && <div role="status">{message.text}</div>}
            <h2>Créer un compte</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div>
                <div>
                  <label>
                    Prénom
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
                  <label className="required_field_indicator">*</label>
                  {errors.firstName && (
                    <div id="err-firstName" role="alert">
                      {errors.firstName}
                    </div>
                  )}
                </div>

                <div>
                  <label>
                    Nom de famille
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
                  <label className="required_field_indicator">*</label>
                  {errors.lastName && (
                    <div id="err-lastName" role="alert">
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label>
                  Émail
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
                <label className="required_field_indicator">*</label>
                {errors.email && (
                  <div id="err-email" role="alert">
                    {errors.email}
                  </div>
                )}
              </div>

              <div>
                <label>
                  Mots de passe
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
                <label className="required_field_indicator">*</label>
                {errors.password && (
                  <div id="err-password" role="alert">
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
    </div>
  );
}
