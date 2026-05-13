import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { labels, tripStatusLabels } from "../constants/labels";

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
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("he-IL");
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
    if (!id) {
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const data = await getTripById(id);

      setTrip(data);
    } catch {
      setError(labels.loadTripError);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTrip();
  }, [id]);

  async function handleApprove() {
    if (!trip) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const updatedTrip = await approveTrip(trip.id);

      setTrip(updatedTrip);
      setToastType("success");
      setToastMessage(labels.approvedSuccess);
    } catch {
      setToastType("error");
      setToastMessage(labels.approvedError);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject(reason: string) {
    if (!trip) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const updatedTrip = await rejectTrip(trip.id, reason);

      setTrip(updatedTrip);
      setIsRejectModalOpen(false);
      setToastType("success");
      setToastMessage(labels.rejectedSuccess);
    } catch {
      setToastType("error");
      setToastMessage(labels.rejectedError);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    if (!trip) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const updatedTrip = await cancelTrip(trip.id);

      setTrip(updatedTrip);
      setIsCancelModalOpen(false);
      setToastType("success");
      setToastMessage(labels.cancelledSuccess);
    } catch {
      setToastType("error");
      setToastMessage(labels.cancelledError);
    } finally {
      setActionLoading(false);
    }
  }

  if (isLoading) {
    return <LoadingState text="טוען פרטי נסיעה..." />;
  }

  if (error && !trip) {
    return (
      <div className="space-y-4 text-right">
        <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>

        <Button variant="secondary" onClick={() => navigate("/trips")}>
          {labels.backToTrips}
        </Button>
      </div>
    );
  }

  if (!trip) {
    return (
      <Card className="p-6 text-right">
        <h2 className="text-lg font-semibold">{labels.tripNotFound}</h2>

        <p className="mt-2 text-gray-500">
          {labels.tripNotFoundDescription}
        </p>

        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => navigate("/trips")}
        >
          {labels.backToTrips}
        </Button>
      </Card>
    );
  }

  const isCompanyAdmin = user?.role === "COMPANY_ADMIN";
  const canApproveOrReject =
    isCompanyAdmin && trip.status === "PENDING_APPROVAL";
  const canCancel = trip.status !== "CANCELLED";

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link to="/trips" className="text-sm font-medium text-blue-600">
            → {labels.backToTrips}
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold">נסיעה #{trip.tripNumber}</h1>
            <StatusBadge status={trip.status} />
          </div>

          <p className="mt-2 text-gray-500">
            {trip.client.name} · {formatDate(trip.pickupDateTime)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {canApproveOrReject && (
            <>
              <Button
                variant="success"
                disabled={actionLoading}
                onClick={handleApprove}
              >
                {actionLoading ? labels.approving : labels.approveTrip}
              </Button>

              <Button
                variant="danger"
                disabled={actionLoading}
                onClick={() => setIsRejectModalOpen(true)}
              >
                {labels.rejectTrip}
              </Button>
            </>
          )}

          {canCancel && (
            <Button
              variant="secondary"
              disabled={actionLoading}
              onClick={() => setIsCancelModalOpen(true)}
            >
              {labels.cancelTrip}
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
      )}

      {trip.duplicateWarning && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
          {labels.duplicateWarningMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-4 text-lg font-semibold">{labels.tripDetails}</h2>

          <DetailRow label={labels.client} value={trip.client.name} />
          <DetailRow
            label={labels.status}
            value={tripStatusLabels[trip.status]}
          />
          <DetailRow
            label={labels.pickupDateTime}
            value={formatDate(trip.pickupDateTime)}
          />
          <DetailRow
            label={labels.pickupLocation}
            value={trip.pickupLocation}
          />
          <DetailRow label={labels.destination} value={trip.destination} />
          <DetailRow label={labels.passengers} value={trip.passengerCount} />
          <DetailRow label={labels.notes} value={trip.notes} />
          <DetailRow
            label={labels.duplicateWarning}
            value={trip.duplicateWarning ? labels.yes : labels.no}
          />
          <DetailRow
            label={labels.exported}
            value={trip.isExported ? labels.yes : labels.no}
          />
          <DetailRow label={labels.exportedAt} value={formatDate(trip.exportedAt)} />
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-lg font-semibold">{labels.workflow}</h2>

          <DetailRow
            label={labels.createdBy}
            value={trip.createdByUser?.fullName}
          />
          <DetailRow
            label={labels.approvedAt}
            value={formatDate(trip.approvedAt)}
          />
          <DetailRow
            label={labels.approvedBy}
            value={trip.approvedByUser?.fullName}
          />
          <DetailRow
            label={labels.rejectedAt}
            value={formatDate(trip.rejectedAt)}
          />
          <DetailRow
            label={labels.rejectedBy}
            value={trip.rejectedByUser?.fullName}
          />
          <DetailRow
            label={labels.rejectionReason}
            value={trip.rejectionReason}
          />
          <DetailRow
            label={labels.cancelledAt}
            value={formatDate(trip.cancelledAt)}
          />
          <DetailRow
            label={labels.cancelledBy}
            value={trip.cancelledByUser?.fullName}
          />
        </Card>
      </div>

      <ConfirmModal
        isOpen={isCancelModalOpen}
        title={labels.cancelTripTitle}
        description={labels.cancelTripDescription}
        confirmLabel={actionLoading ? labels.cancelling : labels.cancelTrip}
        cancelLabel={labels.keepTrip}
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