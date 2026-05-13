import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { exportApprovedTrips } from "../api/exportsApi";
import { labels } from "../constants/labels";

import {
  getTrips,
  type Trip,
  type TripStatus,
} from "../api/tripsApi";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingState } from "../components/ui/LoadingState";
import { StatusBadge } from "../components/ui/Badge";
import { Toast } from "../components/ui/Toast";

const PAGE_LIMIT = 10;

export function TripsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  const [exportError, setExportError] = useState("");

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
      setError(labels.failedToLoadTrips);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTrips();
  }, [page, status, sortBy, sortOrder]);

  async function handleExportApprovedTrips() {
    try {
      setIsExporting(true);
      setExportMessage("");
      setExportError("");

      await exportApprovedTrips();

      setExportMessage(labels.exportSuccess);
      loadTrips();
    } catch {
      setExportError(labels.exportFailed);
    } finally {
      setIsExporting(false);
    }
  }

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
    <div className="space-y-6 text-right">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{labels.tripsPageTitle}</h1>
          <p className="text-gray-500">{labels.tripsPageDescription}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {user?.role === "CLIENT_USER" && (
            <Link to="/trips/new">
              <Button>{labels.createTrip}</Button>
            </Link>
          )}

          {user?.role === "COMPANY_ADMIN" && (
            <Button onClick={handleExportApprovedTrips} disabled={isExporting}>
              {isExporting ? labels.exporting : labels.exportApproved}
            </Button>
          )}
        </div>
      </div>

      <Card className="p-4">
        <form
          onSubmit={handleSearchSubmit}
          className="grid grid-cols-1 gap-3 md:grid-cols-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">
              {labels.search}
            </label>

            <input
              className="w-full rounded-lg border px-3 py-2 text-right"
              placeholder={labels.searchPlaceholder}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              {labels.status}
            </label>

            <select
              className="w-full rounded-lg border px-3 py-2 text-right"
              value={status}
              onChange={(event) =>
                handleStatusChange(event.target.value as TripStatus | "")
              }
            >
              <option value="">{labels.all}</option>
              <option value="PENDING_APPROVAL">{labels.pendingApproval}</option>
              <option value="APPROVED">{labels.approvedTrips}</option>
              <option value="REJECTED">{labels.rejectedTrips}</option>
              <option value="CANCELLED">{labels.cancelledTrips}</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              {labels.sortBy}
            </label>

            <select
              className="w-full rounded-lg border px-3 py-2 text-right"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as "pickupDateTime" | "createdAt")
              }
            >
              <option value="pickupDateTime">{labels.pickupDate}</option>
              <option value="createdAt">{labels.createdAt}</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              {labels.order}
            </label>

            <select
              className="w-full rounded-lg border px-3 py-2 text-right"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value as "asc" | "desc")
              }
            >
              <option value="asc">{labels.ascending}</option>
              <option value="desc">{labels.descending}</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <Button type="submit">{labels.applyFilters}</Button>
          </div>
        </form>
      </Card>

      {isLoading && <LoadingState text={labels.loadingTrips} />}

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
      )}

      {!isLoading && !error && trips.length === 0 && (
        <EmptyState
          title={labels.noTripsFound}
          description={labels.noTripsDescription}
          action={
            user?.role === "CLIENT_USER" ? (
              <Link to="/trips/new">
                <Button>{labels.createTrip}</Button>
              </Link>
            ) : undefined
          }
        />
      )}

      {!isLoading && !error && trips.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-3 text-right">{labels.tripNumber}</th>
                  <th className="p-3 text-right">{labels.client}</th>
                  <th className="p-3 text-right">{labels.pickupTime}</th>
                  <th className="p-3 text-right">{labels.pickup}</th>
                  <th className="p-3 text-right">{labels.destination}</th>
                  <th className="p-3 text-right">{labels.passengers}</th>
                  <th className="p-3 text-right">{labels.status}</th>
                  <th className="p-3 text-right">{labels.duplicate}</th>
                </tr>
              </thead>

              <tbody>
                {trips.map((trip) => (
                  <tr
                    key={trip.id}
                    onClick={() => navigate(`/trips/${trip.id}`)}
                    className="cursor-pointer border-b transition last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">{trip.tripNumber}</td>
                    <td className="p-3">{trip.client.name}</td>
                    <td className="p-3">
                      {new Date(trip.pickupDateTime).toLocaleString("he-IL")}
                    </td>
                    <td className="p-3">{trip.pickupLocation}</td>
                    <td className="p-3">{trip.destination}</td>
                    <td className="p-3">{trip.passengerCount}</td>
                    <td className="p-3">
                      <StatusBadge status={trip.status} />
                    </td>
                    <td className="p-3">
                      {trip.duplicateWarning ? labels.yes : labels.no}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t p-4">
            <Button
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              {labels.previous}
            </Button>

            <span className="text-sm text-gray-600">
              {labels.page} {page} {labels.of} {totalPages}
            </span>

            <Button
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              {labels.next}
            </Button>
          </div>
        </Card>
      )}

      {exportMessage && (
        <Toast
          message={exportMessage}
          type="success"
          onClose={() => setExportMessage("")}
        />
      )}

      {exportError && (
        <Toast
          message={exportError}
          type="error"
          onClose={() => setExportError("")}
        />
      )}
    </div>
  );
}