import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-full bg-gray-900 p-4 text-white lg:min-h-screen lg:w-64">
      <div className="mb-6">
        <h1 className="text-xl font-bold">RideOps</h1>

        <p className="mt-1 text-sm text-gray-400">
          {user?.role === "COMPANY_ADMIN"
            ? "Company Admin"
            : "Client User"}
        </p>
      </div>

      <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `whitespace-nowrap block rounded-lg px-3 py-2 text-sm transition ${
              isActive
                ? "bg-gray-700 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/trips"
          className={({ isActive }) =>
            `whitespace-nowrap block rounded-lg px-3 py-2 text-sm transition ${
              isActive
                ? "bg-gray-700 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Trips
        </NavLink>

        {user?.role === "CLIENT_USER" && (
          <NavLink
            to="/trips/new"
            className={({ isActive }) =>
              `whitespace-nowrap block rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            Create Trip
          </NavLink>
        )}

        <NavLink
          to={user?.role === "COMPANY_ADMIN" ? "/company" : "/client"}
          className={({ isActive }) =>
            `whitespace-nowrap block rounded-lg px-3 py-2 text-sm transition ${
              isActive
                ? "bg-gray-700 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          Home
        </NavLink>
      </nav>
    </aside>
  );
}