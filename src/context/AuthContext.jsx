import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check auth on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/auth/user", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data?.ok && data.user) {
          // data.user peut être { authUser, profile } selon getUserByToken
          const resolved = data.user.profile
            ? data.user
            : data.user.authUser || data.user;
          setUser(resolved);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await fetch("/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setUser(data.user);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await fetch("/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
