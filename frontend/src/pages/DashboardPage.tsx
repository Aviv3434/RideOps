import { useEffect, useState } from "react";

import {
  getDashboardStats,
  type DashboardStats,
} from "../api/dashboardApi";

import { Card } from "../components/ui/Card";
import { LoadingState } from "../components/ui/LoadingState";

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
        setError("Failed to load dashboard stats");
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  if (isLoading) {
    return <LoadingState text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!stats) {
    return <div>No dashboard data found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Overview of RideOps activity</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Pending Approval"
          value={stats.pendingApprovalCount}
          description="Trips waiting for company approval"
        />

        <StatCard
          title="Approved Trips"
          value={stats.approvedTripsCount}
          description="Trips approved by the company"
        />

        <StatCard
          title="Rejected Trips"
          value={stats.rejectedTripsCount}
          description="Trips rejected by the company"
        />

        <StatCard
          title="Cancelled Trips"
          value={stats.cancelledTripsCount}
          description="Trips cancelled by users"
        />

        <StatCard
          title="Trips Today"
          value={stats.tripsToday}
          description="Trips scheduled for today"
        />

        <StatCard
          title="Trips This Month"
          value={stats.tripsThisMonth}
          description="Trips scheduled this month"
        />

        <StatCard
          title="Active Clients"
          value={stats.activeClientsCount}
          description="Active clients in scope"
        />
      </div>
    </div>
  );
}