import { createContext, useContext, useEffect, useState } from "react";

const AUTH_CACHE_KEY = "auth_user_cache";
const AuthContext = createContext();

export function resolveUser(raw) {
  if (!raw) return null;
  return raw.profile ? { ...raw.authUser, ...raw.profile } : raw.authUser || raw;
}

function readCache() {
  try {
    const raw = sessionStorage.getItem(AUTH_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function writeCache(user) {
  try {
    if (user) sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(user));
    else sessionStorage.removeItem(AUTH_CACHE_KEY);
  } catch {}
}

export function AuthProvider({ children }) {
  const cached = readCache();
  const [user, setUser] = useState(cached);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/auth/user", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data?.ok && data.user) {
          const resolved = resolveUser(data.user);
          setUser(resolved);
          writeCache(resolved);
        } else {
          setUser(null);
          writeCache(null);
        }
      } catch {
        // réseau indisponible — on garde le cache existant sans déconnecter
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
      const resolved = resolveUser(data.user);
      setUser(resolved);
      writeCache(resolved);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await fetch("/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    writeCache(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
