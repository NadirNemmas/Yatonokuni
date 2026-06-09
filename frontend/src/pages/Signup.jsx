import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout.jsx";
import SubmitForm from "../components/Forms/SubmitForms.jsx";
export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^\+?[0-9\s\-()]{7,20}$/;

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
    setLoading(true);
    setMessage("");
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setSubmitting(true);
    try {
      // Replace URL with your real signup endpoint
      const res = await fetch("/auth/signup", {
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
      });
      navigate("/login");
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Server error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="page-container-section">
        {loading && (
          <div className="loading-overlay">
            <div className="loader"></div>
            <p>Création du compte...</p>
          </div>
        )}
        <SubmitForm
          title="Créer un compte"
          message={message}
          onSubmit={handleSubmit}
          loading={loading}
          primaryButtonLabel="S'inscrire"
          secondaryButtonLabel="Acceuil"
          textEndForm={
            <>
              Vous avez déjà un compte ? {""}
              <a href="/login">Connectez-vous ici</a>
            </>
          }
        >
          <div>
            <label>
              Nom de famille{" "}
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
                <div id="err-firstName" role="alert" className="alert-message">
                  {errors.firstName}
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
              <div id="err-email" role="alert" className="alert-message">
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
