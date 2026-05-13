import { useAuth } from "../auth/AuthContext";
import { labels } from "../constants/labels";
import { Button } from "./ui/Button";

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">{labels.appName}</h2>
          <p className="text-sm text-gray-500">{labels.operationsDashboard}</p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="text-sm sm:text-left">
            <div className="font-medium">{user?.fullName}</div>
            <div className="text-gray-500">{user?.email}</div>
          </div>

          <Button variant="secondary" onClick={logout}>
            {labels.logout}
          </Button>
        </div>
      </div>
    </header>
  );
}