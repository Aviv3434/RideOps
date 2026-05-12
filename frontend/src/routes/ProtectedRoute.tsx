import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}