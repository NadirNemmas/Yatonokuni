import React, { useState } from "react";

export default function Signup() {
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
    <div className="div-box-container">
      {message && (
        <div
          role="status"
          style={{
            marginBottom: 12,
            padding: 8,
            borderRadius: 4,
            background: message.type === "error" ? "#ffe6e6" : "#e6ffed",
            color: message.type === "error" ? "#900" : "#036",
          }}
        >
          {message.text}
        </div>
      )}
      <h2> Create an account</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <label>
              First name *
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                aria-invalid={!!errors.firstName}
                aria-describedby={
                  errors.firstName ? "err-firstName" : undefined
                }
                required
                style={{ display: "block", width: "100%", marginTop: 6 }}
              />
            </label>
            {errors.firstName && (
              <div
                id="err-firstName"
                role="alert"
                style={{ color: "#000", marginTop: 6 }}
              >
                {errors.firstName}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <label>
              Last name *
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? "err-lastName" : undefined}
                required
                style={{ display: "block", width: "100%", marginTop: 6 }}
              />
            </label>
            {errors.lastName && (
              <div
                id="err-lastName"
                role="alert"
                style={{ color: "#000", marginTop: 6 }}
              >
                {errors.lastName}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>
            Email *
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "err-email" : undefined}
              required
              style={{ display: "block", width: "100%", marginTop: 6 }}
            />
          </label>
          {errors.email && (
            <div
              id="err-email"
              role="alert"
              style={{ color: "#000", marginTop: 6 }}
            >
              {errors.email}
            </div>
          )}
        </div>

        <div style={{ marginTop: 12 }}>
          <label>
            Password *
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "err-password" : undefined}
              required
              style={{ display: "block", width: "100%", marginTop: 6 }}
            />
          </label>
          {errors.password && (
            <div
              id="err-password"
              role="alert"
              style={{ color: "#000", marginTop: 6 }}
            >
              {errors.password}
            </div>
          )}
        </div>

        <div style={{ marginTop: 12 }}>
          <label>
            Phone number *
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "err-phone" : undefined}
              required
              placeholder="+1234567890"
              style={{ display: "block", width: "100%", marginTop: 6 }}
            />
          </label>
          {errors.phone && (
            <div
              id="err-phone"
              role="alert"
              style={{ color: "#000", marginTop: 6 }}
            >
              {errors.phone}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{ marginTop: 16, padding: "8px 12px" }}
        >
          {submitting ? "Creating account..." : "Sign up"}
        </button>
        <button href="/">Home</button>
      </form>
    </div>
  );
}
