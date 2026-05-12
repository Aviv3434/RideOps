import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

import {
  approveTrip,
  cancelTrip,
  getTripById,
  rejectTrip,
  type Trip,
} from "../api/tripsApi";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import { LoadingState } from "../components/ui/LoadingState";
import { StatusBadge } from "../components/ui/Badge";
import { Toast } from "../components/ui/Toast";
import { PageHeader } from "../components/ui/PageHeader";
import { RejectTripModal } from "../components/ui/RejectTripModal";

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="border-b py-3 last:border-b-0">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 font-medium text-gray-900">{value || "-"}</div>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

export function TripDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

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
      setToastType("success");
      setToastMessage("Trip approved successfully");
    } catch {
      setToastType("error");
      setToastMessage("Failed to approve trip");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject(reason: string) {
    if (!trip) return;

    try {
      setActionLoading(true);
      setError("");

      const updatedTrip = await rejectTrip(trip.id, reason);

      setTrip(updatedTrip);
      setIsRejectModalOpen(false);
      setToastType("success");
      setToastMessage("Trip rejected successfully");
    } catch {
      setToastType("error");
      setToastMessage("Failed to reject trip");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    if (!trip) return;

    try {
      setActionLoading(true);
      setError("");

      const updatedTrip = await cancelTrip(trip.id);

      setTrip(updatedTrip);
      setIsCancelModalOpen(false);
      setToastType("success");
      setToastMessage("Trip cancelled successfully");
    } catch {
      setToastType("error");
      setToastMessage("Failed to cancel trip");
    } finally {
      setActionLoading(false);
    }
  }

  if (isLoading) {
    return <LoadingState text="Loading trip..." />;
  }

  if (error && !trip) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>

        <Button variant="secondary" onClick={() => navigate("/trips")}>
          Back to Trips
        </Button>
      </div>
    );
  }

  if (!trip) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold">Trip not found</h2>
        <p className="mt-2 text-gray-500">
          The trip does not exist or you do not have access to it.
        </p>

        <Button variant="secondary" className="mt-4" onClick={() => navigate("/trips")}>
          Back to Trips
        </Button>
      </Card>
    );
  }

  const isCompanyAdmin = user?.role === "COMPANY_ADMIN";
  const canApproveOrReject = isCompanyAdmin && trip.status === "PENDING_APPROVAL";
  const canCancel = trip.status !== "CANCELLED";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Trip #${trip.tripNumber}`}
        description={`${trip.client.name} · ${formatDate(trip.pickupDateTime)}`}
        actions={
          <>
            {canApproveOrReject && (
              <>
                <Button variant="success" disabled={actionLoading} onClick={handleApprove}>
                  {actionLoading ? "Working..." : "Approve"}
                </Button>

                <Button
                  variant="danger"
                  disabled={actionLoading}
                  onClick={() => setIsRejectModalOpen(true)}
                >
                  Reject
                </Button>
              </>
            )}

            {canCancel && (
              <Button
                variant="secondary"
                disabled={actionLoading}
                onClick={() => setIsCancelModalOpen(true)}
              >
                Cancel
              </Button>
            )}
          </>
        }
      />

      <div>
        <Link to="/trips" className="text-sm font-medium text-blue-600">
          ← Back to Trips
        </Link>
        <div className="mt-3">
          <StatusBadge status={trip.status} />
        </div>
      </div>

      {trip.duplicateWarning && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
          This trip may be a duplicate. Please review the date, client, and destination.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-4 text-lg font-semibold">Trip Details</h2>

          <DetailRow label="Client" value={trip.client.name} />
          <DetailRow label="Status" value={trip.status} />
          <DetailRow label="Pickup Date & Time" value={formatDate(trip.pickupDateTime)} />
          <DetailRow label="Pickup Location" value={trip.pickupLocation} />
          <DetailRow label="Destination" value={trip.destination} />
          <DetailRow label="Passengers" value={trip.passengerCount} />
          <DetailRow label="Notes" value={trip.notes} />
          <DetailRow label="Duplicate Warning" value={trip.duplicateWarning ? "Yes" : "No"} />
          <DetailRow label="Exported" value={trip.isExported ? "Yes" : "No"} />
          <DetailRow label="Exported At" value={formatDate(trip.exportedAt)} />
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-lg font-semibold">Workflow</h2>

          <DetailRow label="Created By" value={trip.createdByUser?.fullName} />
          <DetailRow label="Approved At" value={formatDate(trip.approvedAt)} />
          <DetailRow label="Approved By" value={trip.approvedByUser?.fullName} />
          <DetailRow label="Rejected At" value={formatDate(trip.rejectedAt)} />
          <DetailRow label="Rejected By" value={trip.rejectedByUser?.fullName} />
          <DetailRow label="Rejection Reason" value={trip.rejectionReason} />
          <DetailRow label="Cancelled At" value={formatDate(trip.cancelledAt)} />
          <DetailRow label="Cancelled By" value={trip.cancelledByUser?.fullName} />
        </Card>
      </div>

      <ConfirmModal
        isOpen={isCancelModalOpen}
        title="Cancel trip"
        description="Are you sure you want to cancel this trip? This will change the trip status to cancelled."
        confirmLabel={actionLoading ? "Cancelling..." : "Cancel Trip"}
        cancelLabel="Keep Trip"
        variant="danger"
        onConfirm={handleCancel}
        onCancel={() => setIsCancelModalOpen(false)}
      />

      <RejectTripModal
        isOpen={isRejectModalOpen}
        isSubmitting={actionLoading}
        onCancel={() => setIsRejectModalOpen(false)}
        onConfirm={handleReject}
      />

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