import { useEffect, useState } from "react";

import {
  getDashboardStats,
  type DashboardStats,
} from "../api/dashboardApi";

import { Card } from "../components/ui/Card";
import { LoadingState } from "../components/ui/LoadingState";
import { labels } from "../constants/labels";

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <Card className="p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      <p className="mt-2 text-xs text-gray-400">{description}</p>
    </Card>
  );
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getDashboardStats();

        setStats(data);
      } catch {
        setError("טעינת נתוני לוח הבקרה נכשלה");
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  if (isLoading) {
    return <LoadingState text="טוען לוח בקרה..." />;
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!stats) {
    return <div>לא נמצאו נתונים להצגה.</div>;
  }

  return (
    <div className="space-y-6 text-right">
      <div>
        <h1 className="text-2xl font-bold">{labels.dashboard}</h1>
        <p className="text-gray-500">{labels.overview}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={labels.pendingApproval}
          value={stats.pendingApprovalCount}
          description={labels.pendingDescription}
        />

        <StatCard
          title={labels.approvedTrips}
          value={stats.approvedTripsCount}
          description={labels.approvedDescription}
        />

        <StatCard
          title={labels.rejectedTrips}
          value={stats.rejectedTripsCount}
          description={labels.rejectedDescription}
        />

        <StatCard
          title={labels.cancelledTrips}
          value={stats.cancelledTripsCount}
          description={labels.cancelledDescription}
        />

        <StatCard
          title={labels.tripsToday}
          value={stats.tripsToday}
          description={labels.todayDescription}
        />

        <StatCard
          title={labels.tripsThisMonth}
          value={stats.tripsThisMonth}
          description={labels.monthDescription}
        />

        <StatCard
          title={labels.activeClients}
          value={stats.activeClientsCount}
          description={labels.clientsDescription}
        />
      </div>
    </div>
  );
}