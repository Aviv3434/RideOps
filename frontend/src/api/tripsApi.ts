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
  notes?: string | null;
  status: TripStatus;
  duplicateWarning: boolean;
  rejectionReason?: string | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  cancelledAt?: string | null;
  isExported?: boolean;
  exportedAt?: string | null;

  client: {
    id: string;
    name: string;
  };

  createdByUser?: {
    id: string;
    fullName: string;
    email?: string;
  } | null;

  approvedByUser?: {
    id: string;
    fullName: string;
    email?: string;
  } | null;

  rejectedByUser?: {
    id: string;
    fullName: string;
    email?: string;
  } | null;

  cancelledByUser?: {
    id: string;
    fullName: string;
    email?: string;
  } | null;
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

export async function getTripById(tripId: string): Promise<Trip> {
  const response = await apiClient.get<Trip>(`/trips/${tripId}`);

  return response.data;
}

export async function approveTrip(tripId: string): Promise<Trip> {
  const response = await apiClient.patch<Trip>(`/trips/${tripId}/approve`);

  return response.data;
}

export async function rejectTrip(
  tripId: string,
  rejectionReason: string
): Promise<Trip> {
  const response = await apiClient.patch<Trip>(`/trips/${tripId}/reject`, {
    rejectionReason,
  });

  return response.data;
}

export async function cancelTrip(tripId: string): Promise<Trip> {
  const response = await apiClient.patch<Trip>(`/trips/${tripId}/cancel`);

  return response.data;
}

export type CreateTripInput = {
  pickupDateTime: string;
  pickupLocation: string;
  destination: string;
  passengerCount: number;
  notes?: string;
};

export async function createTrip(
  data: CreateTripInput
): Promise<Trip> {
  const response = await apiClient.post<Trip>(
    "/trips",
    data
  );

  return response.data;
}