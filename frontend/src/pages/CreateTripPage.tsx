import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { createTrip } from "../api/tripsApi";

type FormErrors = {
  pickupDateTime?: string;
  pickupLocation?: string;
  destination?: string;
  passengerCount?: string;
};

export function CreateTripPage() {
  const navigate = useNavigate();

  const [pickupDateTime, setPickupDateTime] =
    useState("");

  const [pickupLocation, setPickupLocation] =
    useState("");

  const [destination, setDestination] =
    useState("");

  const [passengerCount, setPassengerCount] =
    useState("1");

  const [notes, setNotes] = useState("");

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [serverError, setServerError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!pickupDateTime) {
      nextErrors.pickupDateTime =
        "Pickup date and time is required";
    }

    if (pickupLocation.trim().length < 2) {
      nextErrors.pickupLocation =
        "Pickup location is required";
    }

    if (destination.trim().length < 2) {
      nextErrors.destination =
        "Destination is required";
    }

    const passengerCountNumber =
      Number(passengerCount);

    if (
      !Number.isInteger(passengerCountNumber) ||
      passengerCountNumber <= 0
    ) {
      nextErrors.passengerCount =
        "Passenger count must be a positive number";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setServerError("");
    setSuccessMessage("");

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      setIsSubmitting(true);

      const createdTrip =
        await createTrip({
          pickupDateTime:
            new Date(
              pickupDateTime
            ).toISOString(),

          pickupLocation:
            pickupLocation.trim(),

          destination:
            destination.trim(),

          passengerCount:
            Number(passengerCount),

          notes:
            notes.trim() || undefined,
        });

      setSuccessMessage(
        "Trip created successfully"
      );

      navigate(
        `/trips/${createdTrip.id}`
      );
    } catch {
      setServerError(
        "Failed to create trip"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Create Trip
        </h1>

        <p className="text-gray-500">
          Submit a new trip request
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded bg-white border p-6 space-y-5"
      >
        {serverError && (
          <div className="rounded bg-red-50 text-red-700 p-3">
            {serverError}
          </div>
        )}

        {successMessage && (
          <div className="rounded bg-green-50 text-green-700 p-3">
            {successMessage}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            Pickup Date & Time
          </label>

          <input
            type="datetime-local"
            value={pickupDateTime}
            onChange={(event) =>
              setPickupDateTime(
                event.target.value
              )
            }
            className="w-full border rounded px-3 py-2"
          />

          {errors.pickupDateTime && (
            <p className="text-sm text-red-600 mt-1">
              {errors.pickupDateTime}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Pickup Location
          </label>

          <input
            value={pickupLocation}
            onChange={(event) =>
              setPickupLocation(
                event.target.value
              )
            }
            className="w-full border rounded px-3 py-2"
            placeholder="Herzel High School"
          />

          {errors.pickupLocation && (
            <p className="text-sm text-red-600 mt-1">
              {errors.pickupLocation}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Destination
          </label>

          <input
            value={destination}
            onChange={(event) =>
              setDestination(
                event.target.value
              )
            }
            className="w-full border rounded px-3 py-2"
            placeholder="Tel Aviv Museum"
          />

          {errors.destination && (
            <p className="text-sm text-red-600 mt-1">
              {errors.destination}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Passenger Count
          </label>

          <input
            type="number"
            min="1"
            value={passengerCount}
            onChange={(event) =>
              setPassengerCount(
                event.target.value
              )
            }
            className="w-full border rounded px-3 py-2"
          />

          {errors.passengerCount && (
            <p className="text-sm text-red-600 mt-1">
              {errors.passengerCount}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Notes
          </label>

          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(
                event.target.value
              )
            }
            className="w-full border rounded px-3 py-2 min-h-28"
            placeholder="Optional notes..."
          />
        </div>

        <div className="flex gap-3">
          <button
            disabled={isSubmitting}
            className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
          >
            {isSubmitting
              ? "Creating..."
              : "Create Trip"}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/trips")
            }
            className="rounded border px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}