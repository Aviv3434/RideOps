import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getTrips, type Trip, type TripStatus } from "../api/tripsApi";
import { exportApprovedTrips } from "../api/exportsApi";
import { useAuth } from "../auth/AuthContext";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader } from "../components/ui/PageHeader";
import { Toast } from "../components/ui/Toast";
import { TripsTable } from "../components/trips/TripsTable";

const PAGE_LIMIT = 10;

export function TripsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<TripStatus | "">("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"pickupDateTime" | "createdAt">("pickupDateTime");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

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

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPage(1);
    loadTrips();
  }

  async function handleExportApprovedTrips() {
    try {
      setIsExporting(true);

      await exportApprovedTrips();

      setToastType("success");
      setToastMessage("Approved trips exported successfully");

      loadTrips();
    } catch {
      setToastType("error");
      setToastMessage("Failed to export approved trips");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trips"
        description="View, filter, and manage trip requests"
        actions={
          <>
            {user?.role === "CLIENT_USER" && (
              <Link to="/trips/new">
                <Button>Create Trip</Button>
              </Link>
            )}

            {user?.role === "COMPANY_ADMIN" && (
              <Button onClick={handleExportApprovedTrips} disabled={isExporting}>
                {isExporting ? "Exporting..." : "Export Approved"}
              </Button>
            )}
          </>
        }
      />

      <Card className="p-4">
        <form
          onSubmit={handleSearchSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">Search</label>
            <input
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
              placeholder="Destination, pickup, notes..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as TripStatus | "");
                setPage(1);
              }}
            >
              <option value="">All</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Sort By</label>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
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
            <label className="mb-1 block text-sm font-medium">Order</label>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as "asc" | "desc")}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div className="md:col-span-4 flex flex-wrap gap-2">
            <Button>Apply Filters</Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSearch("");
                setStatus("");
                setSortBy("pickupDateTime");
                setSortOrder("asc");
                setPage(1);
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </Card>

      {isLoading && <LoadingState text="Loading trips..." />}

      {error && <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>}

      {!isLoading && !error && trips.length === 0 && (
        <EmptyState
          title="No trips found"
          description="Try changing the filters or create a new trip."
          action={
            user?.role === "CLIENT_USER" ? (
              <Link to="/trips/new">
                <Button>Create Trip</Button>
              </Link>
            ) : undefined
          }
        />
      )}

      {!isLoading && !error && trips.length > 0 && (
        <Card className="overflow-hidden">
          <TripsTable trips={trips} onRowClick={(tripId) => navigate(`/trips/${tripId}`)} />

          <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>

            <span className="text-center text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </Card>
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage("")}
        />
      )}
    </div>
  );
}