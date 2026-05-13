import type { TripStatus } from "../../api/tripsApi";

type BadgeProps = {
  status: TripStatus;
};

const statusClasses: Record<TripStatus, string> = {
  PENDING_APPROVAL: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<TripStatus, string> = {
  PENDING_APPROVAL: "ממתינה לאישור",
  APPROVED: "מאושרת",
  REJECTED: "נדחתה",
  CANCELLED: "בוטלה",
};

export function StatusBadge({ status }: BadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}