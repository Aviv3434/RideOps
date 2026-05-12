import { useState } from "react";
import { Button } from "./Button";

type RejectTripModalProps = {
  isOpen: boolean;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
};

export function RejectTripModal({
  isOpen,
  isSubmitting = false,
  onCancel,
  onConfirm,
}: RejectTripModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  function handleConfirm() {
    if (reason.trim().length < 2) return;
    onConfirm(reason.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold">Reject trip</h2>

        <p className="mt-2 text-sm text-gray-600">
          Please provide a rejection reason. The client will be able to see it.
        </p>

        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className="mt-4 min-h-28 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
          placeholder="Reason for rejection..."
        />

        {reason.length > 0 && reason.trim().length < 2 && (
          <p className="mt-2 text-sm text-red-600">
            Rejection reason must be at least 2 characters.
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isSubmitting || reason.trim().length < 2}
          >
            {isSubmitting ? "Rejecting..." : "Reject Trip"}
          </Button>
        </div>
      </div>
    </div>
  );
}