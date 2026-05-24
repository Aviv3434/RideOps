import { Link } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { labels } from "../constants/labels";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";

export function ClientHomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <PageHeader
        title={labels.clientAreaTitle}
        description={labels.clientAreaDescription}
      />

      <Card className="p-6">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">{labels.welcome}</p>
            <p className="text-xl font-semibold text-gray-900">
              {user?.fullName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">{labels.role}</p>
            <p className="font-medium text-gray-900">{user?.role}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">{labels.userEmail}</p>
            <p className="font-medium text-gray-900">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/dashboard">
            <Button>{labels.goToDashboard}</Button>
          </Link>

          <Link to="/trips">
            <Button variant="secondary">{labels.goToTrips}</Button>
          </Link>

          <Link to="/trips/new">
            <Button variant="success">{labels.newTripRequest}</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}