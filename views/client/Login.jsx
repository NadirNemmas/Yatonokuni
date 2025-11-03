import { useState } from "react";

export default function Login() {
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // read as text first
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      console.warn("Response not JSON:", text);
      data = null;
    }

    if (!res.ok) {
      // backend renvoie { message: "..." } si on a suivi les snippets ci-dessus
      const errMsg =
        (data && data.message) ||
        (data && data.message) ||
        data?.message ||
        `HTTP ${res.status}`;
      throw new Error(errMsg || `HTTP ${res.status}`);
    }

    // succès
    const token = data?.session?.access_token;
    if (token) localStorage.setItem("access_token", token);
    setMessage("✅ Logged in successfully");
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/users", { method: "GET", headers });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `HTTP ${res.status}`);
      }

      console.log("Fetched users:", data);
      setMessage(
        `Fetched ${
          Array.isArray(data) ? data.length : "result"
        } users. Check console.`
      );
    } catch (err) {
      console.error("Error fetching users:", err);
      setMessage(`❌ Error fetching users: ${err.message}`);
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
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <button onClick={fetchUsers}>Fetch users</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
