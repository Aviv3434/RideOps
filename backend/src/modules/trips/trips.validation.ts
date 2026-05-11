import { z } from "zod";

export const createTripSchema = z.object({
  body: z.object({
    pickupDateTime: z.string().datetime("Invalid pickup date"),

    pickupLocation: z
      .string()
      .min(2, "Pickup location is required")
      .max(255),

    destination: z
      .string()
      .min(2, "Destination is required")
      .max(255),

    passengerCount: z
      .number()
      .int("Passenger count must be an integer")
      .positive("Passenger count must be positive"),

    notes: z.string().max(1000, "Notes is too long").optional(),
  }),
});

export const getTripsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const tripIdParamsSchema = z.object({
  id: z.uuid("Invalid trip id"),
});