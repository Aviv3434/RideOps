import { useAuth } from "../auth/AuthContext";

export function ClientHomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Client Area
      </h1>

      <p className="mt-2">
        Welcome, {user?.fullName}
      </p>

      <p>
        Role: {user?.role}
      </p>

      <button
        onClick={logout}
        className="mt-4 bg-black text-white rounded px-4 py-2"
      >
        Logout
      </button>
    </div>
  );
}