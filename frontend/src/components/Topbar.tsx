import { useAuth } from "../auth/AuthContext";

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div>
        <h2 className="font-semibold">RideOps Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-right">
          <div className="font-medium">{user?.fullName}</div>
          <div className="text-gray-500">{user?.email}</div>
        </div>

        <button
          onClick={logout}
          className="rounded bg-black text-white px-4 py-2 text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}