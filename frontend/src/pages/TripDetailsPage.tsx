import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

import {
  approveTrip,
  cancelTrip,
  getTripById,
  rejectTrip,
  type Trip,
  type TripStatus,
} from "../api/tripsApi";

function getStatusLabel(status: TripStatus) {
  switch (status) {
    case "PENDING_APPROVAL":
      return "Pending Approval";
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

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="border-b py-3">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-medium">{value || "-"}</div>
    </div>
  );
}

export function TripDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadTrip() {
    if (!id) return;

    try {
      setIsLoading(true);
      setError("");

      const data = await getTripById(id);
      setTrip(data);
    } catch {
      setError("Failed to load trip");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTrip();
  }, [id]);

  async function handleApprove() {
    if (!trip) return;

    try {
      setActionLoading(true);
      setError("");

      const updatedTrip = await approveTrip(trip.id);
      setTrip(updatedTrip);
    } catch {
      setError("Failed to approve trip");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    if (!trip) return;

    const reason = window.prompt("Enter rejection reason:");

    if (!reason) return;

    try {
      setActionLoading(true);
      setError("");

      const updatedTrip = await rejectTrip(trip.id, reason);
      setTrip(updatedTrip);
    } catch {
      setError("Failed to reject trip");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    if (!trip) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this trip?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      const updatedTrip = await cancelTrip(trip.id);
      setTrip(updatedTrip);
    } catch {
      setError("Failed to cancel trip");
    } finally {
      setActionLoading(false);
    }
  }

  if (isLoading) {
    return <div>Loading trip...</div>;
  }

  if (error && !trip) {
    return (
      <div>
        <div className="rounded bg-red-50 text-red-700 p-4 mb-4">{error}</div>

        <button
          onClick={() => navigate("/trips")}
          className="rounded border px-4 py-2"
        >
          Back to Trips
        </button>
      </div>
    );
  }

  if (!trip) {
    return <div>Trip not found.</div>;
  }

  const isCompanyAdmin = user?.role === "COMPANY_ADMIN";
  const canApproveOrReject =
    isCompanyAdmin && trip.status === "PENDING_APPROVAL";
  const canCancel = trip.status !== "CANCELLED";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/trips" className="text-sm text-blue-600">
            ← Back to Trips
          </Link>

          <h1 className="text-2xl font-bold mt-2">Trip #{trip.tripNumber}</h1>

          <p className="text-gray-500">
            {trip.client.name} · {getStatusLabel(trip.status)}
          </p>
        </div>

        <div className="flex gap-2">
          {canApproveOrReject && (
            <>
              <button
                disabled={actionLoading}
                onClick={handleApprove}
                className="rounded bg-green-700 text-white px-4 py-2 disabled:opacity-50"
              >
                Approve
              </button>

              <button
                disabled={actionLoading}
                onClick={handleReject}
                className="rounded bg-red-700 text-white px-4 py-2 disabled:opacity-50"
              >
                Reject
              </button>
            </>
          )}

          {canCancel && (
            <button
              disabled={actionLoading}
              onClick={handleCancel}
              className="rounded bg-gray-900 text-white px-4 py-2 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded bg-red-50 text-red-700 p-4 mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded bg-white border p-5">
          <h2 className="text-lg font-semibold mb-4">Trip Details</h2>

          <DetailRow label="Client" value={trip.client.name} />
          <DetailRow label="Status" value={getStatusLabel(trip.status)} />
          <DetailRow
            label="Pickup Date & Time"
            value={new Date(trip.pickupDateTime).toLocaleString()}
          />
          <DetailRow label="Pickup Location" value={trip.pickupLocation} />
          <DetailRow label="Destination" value={trip.destination} />
          <DetailRow label="Passengers" value={trip.passengerCount} />
          <DetailRow label="Notes" value={trip.notes} />
          <DetailRow
            label="Duplicate Warning"
            value={trip.duplicateWarning ? "Yes" : "No"}
          />
          <DetailRow label="Exported" value={trip.isExported ? "Yes" : "No"} />
          <DetailRow
            label="Exported At"
            value={
              trip.exportedAt ? new Date(trip.exportedAt).toLocaleString() : "-"
            }
          />
        </section>

        <section className="rounded bg-white border p-5">
          <h2 className="text-lg font-semibold mb-4">Workflow</h2>

          <DetailRow label="Created By" value={trip.createdByUser?.fullName} />
          <DetailRow
            label="Approved At"
            value={
              trip.approvedAt
                ? new Date(trip.approvedAt).toLocaleString()
                : "-"
            }
          />
          <DetailRow label="Approved By" value={trip.approvedByUser?.fullName} />
          <DetailRow
            label="Rejected At"
            value={
              trip.rejectedAt
                ? new Date(trip.rejectedAt).toLocaleString()
                : "-"
            }
          />
          <DetailRow label="Rejected By" value={trip.rejectedByUser?.fullName} />
          <DetailRow label="Rejection Reason" value={trip.rejectionReason} />
          <DetailRow
            label="Cancelled At"
            value={
              trip.cancelledAt
                ? new Date(trip.cancelledAt).toLocaleString()
                : "-"
            }
          />
          <DetailRow
            label="Cancelled By"
            value={trip.cancelledByUser?.fullName}
          />
        </section>
      </div>
    </div>
  );
}