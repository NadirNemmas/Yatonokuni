import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function GameRoute({ game, children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || !user.games?.includes(game)) return <Navigate to="/" replace />;
  return children;
}
