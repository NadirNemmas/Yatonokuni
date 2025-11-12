import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../src/context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
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
        credentials: "include", // envoie le cookie HttpOnly
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // parse safe
      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        const errMsg = data?.message || `Erreur HTTP ${res.status}`;
        setMessage(errMsg);
        setLoading(false);
        return;
      }

      if (data.ok && data.user) {
        // normalise la forme du user
        const normalized = resolveUserShape(data.user);
        setUser(normalized);
        setMessage("✅ Connecté");
        // redirige après un petit délai si tu veux (optionnel)
        navigate("/", { replace: true });
      } else {
        // cas improbable : backend ok mais pas de user
        setMessage(data.message || "Erreur lors de la connexion");
      }
    } catch (err) {
      console.error("Login fetch error:", err);
      setMessage("Erreur réseau ou serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="div-box-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
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
            <label htmlFor="password">Password:</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
