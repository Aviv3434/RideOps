import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function RoleRedirectPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "COMPANY_ADMIN") {
    return <Navigate to="/company" replace />;
  }

  return <Navigate to="/client" replace />;
}