import { apiClient } from "./apiClient";

export type DashboardStats = {
  pendingApprovalCount: number;
  approvedTripsCount: number;
  rejectedTripsCount: number;
  cancelledTripsCount: number;
  tripsToday: number;
  tripsThisMonth: number;
  activeClientsCount: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get<DashboardStats>("/dashboard/stats");

  return response.data;
}