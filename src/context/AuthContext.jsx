import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // vérifier l'état de connexion dès le chargement
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/auth/user", {
          method: "GET",
          credentials: "include", // cookie envoyé automatiquement
        });

        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        setUser(data.user?.authUser || data.user?.profile || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // déconnexion
  const logout = async () => {
    await fetch("/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
