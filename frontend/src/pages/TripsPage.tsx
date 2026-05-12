import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  getTrips,
  type Trip,
  type TripStatus,
} from "../api/tripsApi";

const PAGE_LIMIT = 10;

function getStatusLabel(status: TripStatus) {
  switch (status) {
    case "PENDING_APPROVAL":
      return "Pending";
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}

export function TripsPage() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<TripStatus | "">("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"pickupDateTime" | "createdAt">(
    "pickupDateTime"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTrips() {
    try {
      setIsLoading(true);
      setError("");

      const result = await getTrips({
        page,
        limit: PAGE_LIMIT,
        status: status || undefined,
        search: search || undefined,
        sortBy,
        sortOrder,
      });

      setTrips(result.data);
      setTotalPages(result.pagination.totalPages || 1);
    } catch {
      setError("Failed to load trips");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTrips();
  }, [page, status, sortBy, sortOrder]);

  function handleSearchSubmit(event: FormEvent) {
    event.preventDefault();
    setPage(1);
    loadTrips();
  }

  function handleStatusChange(value: TripStatus | "") {
    setStatus(value);
    setPage(1);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trips</h1>
          <p className="text-gray-500">View and filter trip requests</p>
        </div>
      </div>

      <div className="mb-4 rounded bg-white border p-4">
        <form
          onSubmit={handleSearchSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Destination, pickup, notes..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={status}
              onChange={(event) =>
                handleStatusChange(event.target.value as TripStatus | "")
              }
            >
              <option value="">All</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as "pickupDateTime" | "createdAt")
              }
            >
              <option value="pickupDateTime">Pickup Date</option>
              <option value="createdAt">Created At</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value as "asc" | "desc")
              }
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <button className="rounded bg-black text-white px-4 py-2">
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {isLoading && <div>Loading trips...</div>}

      {error && (
        <div className="rounded bg-red-50 text-red-700 p-4">{error}</div>
      )}

      {!isLoading && !error && (
        <div className="rounded bg-white border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3">Trip #</th>
                <th className="text-left p-3">Client</th>
                <th className="text-left p-3">Pickup Time</th>
                <th className="text-left p-3">Pickup</th>
                <th className="text-left p-3">Destination</th>
                <th className="text-left p-3">Passengers</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Duplicate</th>
              </tr>
            </thead>

            <tbody>
              {trips.length === 0 && (
                <tr>
                  <td className="p-4 text-gray-500" colSpan={8}>
                    No trips found.
                  </td>
                </tr>
              )}

              {trips.map((trip) => (
                <tr
                  key={trip.id}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  className="border-b last:border-b-0 cursor-pointer hover:bg-gray-100"
                >
                  <td className="p-3">{trip.tripNumber}</td>
                  <td className="p-3">{trip.client.name}</td>
                  <td className="p-3">
                    {new Date(trip.pickupDateTime).toLocaleString()}
                  </td>
                  <td className="p-3">{trip.pickupLocation}</td>
                  <td className="p-3">{trip.destination}</td>
                  <td className="p-3">{trip.passengerCount}</td>
                  <td className="p-3">{getStatusLabel(trip.status)}</td>
                  <td className="p-3">
                    {trip.duplicateWarning ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between p-4 border-t">
            <button
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="rounded border px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="rounded border px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}