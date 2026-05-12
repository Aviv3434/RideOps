import { apiClient } from "./apiClient";

export type TripStatus =
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type Trip = {
  id: string;
  tripNumber: number;
  pickupDateTime: string;
  pickupLocation: string;
  destination: string;
  passengerCount: number;
  status: TripStatus;
  duplicateWarning: boolean;
  isExported?: boolean;
  client: {
    id: string;
    name: string;
  };
};

export type TripsResponse = {
  data: Trip[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type GetTripsParams = {
  page?: number;
  limit?: number;
  status?: TripStatus | "";
  search?: string;
  sortBy?: "pickupDateTime" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export async function getTrips(
  params: GetTripsParams
): Promise<TripsResponse> {
  const response = await apiClient.get<TripsResponse>("/trips", {
    params,
  });

  return response.data;
}