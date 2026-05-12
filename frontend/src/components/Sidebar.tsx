import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">RideOps</h1>
        <p className="text-sm text-gray-400">{user?.role}</p>
      </div>

      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block rounded px-3 py-2 ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to={user?.role === "COMPANY_ADMIN" ? "/company" : "/client"}
          className={({ isActive }) =>
            `block rounded px-3 py-2 ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          Home
        </NavLink>
      </nav>
    </aside>
  );
}