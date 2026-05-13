import { useState } from "react";

import { labels } from "../../constants/labels";
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

  if (!isOpen) {
    return null;
  }

  function handleConfirm() {
    if (reason.trim().length < 2) {
      return;
    }

    onConfirm(reason.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 text-right shadow-lg">
        <h2 className="text-lg font-semibold">{labels.rejectTripTitle}</h2>

        <p className="mt-2 text-sm text-gray-600">
          {labels.rejectTripDescription}
        </p>

        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className="mt-4 min-h-28 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
          placeholder={labels.rejectionReasonPlaceholder}
        />

        {reason.length > 0 && reason.trim().length < 2 && (
          <p className="mt-2 text-sm text-red-600">
            {labels.rejectionReasonValidation}
          </p>
        )}

        <div className="mt-6 flex justify-start gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            ביטול
          </Button>

          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isSubmitting || reason.trim().length < 2}
          >
            {isSubmitting ? labels.rejecting : labels.rejectTrip}
          </Button>
        </div>
      </div>
    </div>
  );
}