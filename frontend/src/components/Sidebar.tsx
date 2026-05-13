import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { labels } from "../constants/labels";

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-full bg-gray-900 p-4 text-white lg:min-h-screen lg:w-64">
      <div className="mb-8">
        <h1 className="text-xl font-bold">{labels.appName}</h1>
        <p className="text-sm text-gray-400">{user?.role}</p>
      </div>

      <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block whitespace-nowrap rounded px-3 py-2 ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          {labels.dashboard}
        </NavLink>

        <NavLink
          to="/trips"
          className={({ isActive }) =>
            `block whitespace-nowrap rounded px-3 py-2 ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          {labels.trips}
        </NavLink>

        {user?.role === "CLIENT_USER" && (
          <NavLink
            to="/trips/new"
            className={({ isActive }) =>
              `block whitespace-nowrap rounded px-3 py-2 ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            {labels.createTrip}
          </NavLink>
        )}

        <NavLink
          to={user?.role === "COMPANY_ADMIN" ? "/company" : "/client"}
          className={({ isActive }) =>
            `block whitespace-nowrap rounded px-3 py-2 ${
              isActive ? "bg-gray-700" : "hover:bg-gray-800"
            }`
          }
        >
          {labels.home}
        </NavLink>
      </nav>
    </aside>
  );
}