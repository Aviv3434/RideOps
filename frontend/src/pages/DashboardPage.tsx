import { useEffect, useState } from "react";
import {
  getDashboardStats,
  type DashboardStats,
} from "../api/dashboardApi";

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm border">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
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
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div className="rounded bg-red-50 text-red-700 p-4">{error}</div>;
  }

  if (!stats) {
    return <div>No dashboard data found.</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Basic overview of RideOps activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Pending Approval" value={stats.pendingApprovalCount} />
        <StatCard title="Approved Trips" value={stats.approvedTripsCount} />
        <StatCard title="Rejected Trips" value={stats.rejectedTripsCount} />
        <StatCard title="Cancelled Trips" value={stats.cancelledTripsCount} />
        <StatCard title="Trips Today" value={stats.tripsToday} />
        <StatCard title="Trips This Month" value={stats.tripsThisMonth} />
        <StatCard title="Active Clients" value={stats.activeClientsCount} />
      </div>
    </div>
  );
}