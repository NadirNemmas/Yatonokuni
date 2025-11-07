import { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { useAuth } from "../../src/context/AuthContext.jsx"; // ajout

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // ajout
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // lire directement JSON (plus simple)
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errMsg = (data && data.message) || `HTTP ${res.status}`;
      setLoading(false);
      setMessage(errMsg);
      return;
    }

    // mettre à jour le contexte avec l'utilisateur retourné par le backend
    if (data?.user) {
      setUser(data.user);
    } else {
    }

    setMessage("✅ Logged in successfully");
    setLoading(false);
    navigate("/", { replace: true });
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
