import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-full bg-gray-900 p-4 text-white lg:min-h-screen lg:w-64">
      <div className="mb-6 text-right">
        <h1 className="text-xl font-bold">RideOps</h1>

        <p className="mt-1 text-sm text-gray-400">
          {user?.role === "COMPANY_ADMIN" ? "מנהל חברה" : "לקוח"}
        </p>
      </div>

      <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-2" dir="rtl">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
              isActive
                ? "bg-gray-700 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          דשבורד
        </NavLink>

        <NavLink
          to="/trips"
          className={({ isActive }) =>
            `block whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
              isActive
                ? "bg-gray-700 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          הזמנות
        </NavLink>

        {user?.role === "CLIENT_USER" && (
          <NavLink
            to="/trips/new"
            className={({ isActive }) =>
              `block whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            הזמנה חדשה
          </NavLink>
        )}

        {user?.role === "COMPANY_ADMIN" && (
          <NavLink
            to="/clients"
            className={({ isActive }) =>
              `block whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            לקוחות
          </NavLink>
        )}

        <NavLink
          to={user?.role === "COMPANY_ADMIN" ? "/company" : "/client"}
          className={({ isActive }) =>
            `block whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
              isActive
                ? "bg-gray-700 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          בית
        </NavLink>
      </nav>
    </aside>
  );
}