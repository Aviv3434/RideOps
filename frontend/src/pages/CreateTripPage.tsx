import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { createTrip } from "../api/tripsApi";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";

import { labels } from "../constants/labels";

type FormErrors = {
  pickupDateTime?: string;
  pickupLocation?: string;
  destination?: string;
  passengerCount?: string;
};

export function CreateTripPage() {
  const navigate = useNavigate();

  const [pickupDateTime, setPickupDateTime] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [passengerCount, setPassengerCount] = useState("1");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!pickupDateTime) {
      nextErrors.pickupDateTime = labels.pickupDateTimeRequired;
    }

    if (pickupLocation.trim().length < 2) {
      nextErrors.pickupLocation = labels.pickupLocationRequired;
    }

    if (destination.trim().length < 2) {
      nextErrors.destination = labels.destinationRequired;
    }

    const passengerCountNumber = Number(passengerCount);

    if (!Number.isInteger(passengerCountNumber) || passengerCountNumber <= 0) {
      nextErrors.passengerCount = labels.passengerCountRequired;
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setServerError("");
    setSuccessMessage("");

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      setIsSubmitting(true);

      const createdTrip = await createTrip({
        pickupDateTime: new Date(pickupDateTime).toISOString(),
        pickupLocation: pickupLocation.trim(),
        destination: destination.trim(),
        passengerCount: Number(passengerCount),
        notes: notes.trim() || undefined,
      });

      setSuccessMessage(labels.createTripSuccess);

      navigate(`/trips/${createdTrip.id}`);
    } catch {
      setServerError(labels.createTripError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6 text-right" dir="rtl">
      <PageHeader
        title={labels.createTripTitle}
        description={labels.createTripDescription}
      />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {serverError && (
            <div className="rounded-xl bg-red-50 p-3 text-red-700">
              {serverError}
            </div>
          )}

          {successMessage && (
            <div className="rounded-xl bg-green-50 p-3 text-green-700">
              {successMessage}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">
              {labels.pickupDateTime}
            </label>

            <input
              type="datetime-local"
              value={pickupDateTime}
              onChange={(event) => setPickupDateTime(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
            />

            {errors.pickupDateTime && (
              <p className="mt-1 text-sm text-red-600">
                {errors.pickupDateTime}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              {labels.pickupLocation}
            </label>

            <input
              value={pickupLocation}
              onChange={(event) => setPickupLocation(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
              placeholder={labels.pickupLocationPlaceholder}
            />

            {errors.pickupLocation && (
              <p className="mt-1 text-sm text-red-600">
                {errors.pickupLocation}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              {labels.destination}
            </label>

            <input
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
              placeholder={labels.destinationPlaceholder}
            />

            {errors.destination && (
              <p className="mt-1 text-sm text-red-600">
                {errors.destination}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              {labels.passengerCount}
            </label>

            <input
              type="number"
              min="1"
              value={passengerCount}
              onChange={(event) => setPassengerCount(event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
            />

            {errors.passengerCount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.passengerCount}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              {labels.notes}
            </label>

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="min-h-28 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-900"
              placeholder={labels.notesPlaceholder}
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button disabled={isSubmitting}>
              {isSubmitting ? labels.creatingButton : labels.createButton}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/trips")}
            >
              {labels.cancelButton}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}