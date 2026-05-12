import { Request, Response, NextFunction } from "express";
import * as tripsService from "./trips.service";

export async function createTripController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const trip = await tripsService.createTrip(req.body, req.user);

    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
}

export async function getTripsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await tripsService.getTrips(req.user, {
      page: Number(req.query.page || 1),
      limit: Number(req.query.limit || 10),
      status: req.query.status as any,
      pickupDate: req.query.pickupDate as string | undefined,
      clientId: req.query.clientId as string | undefined,
      search: req.query.search as string | undefined,
      sortBy:
        (req.query.sortBy as "pickupDateTime" | "createdAt") ||
        "pickupDateTime",
      sortOrder: (req.query.sortOrder as "asc" | "desc") || "asc",
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getTripByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tripId = String(req.params.id);

    const trip = await tripsService.getTripById(tripId, req.user);

    res.json(trip);
  } catch (error) {
    next(error);
  }
}

export async function approveTripController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tripId = String(req.params.id);

    const trip = await tripsService.approveTrip(tripId, req.user);

    res.json(trip);
  } catch (error) {
    next(error);
  }
}

export async function rejectTripController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tripId = String(req.params.id);

    const trip = await tripsService.rejectTrip(
      tripId,
      req.body.rejectionReason,
      req.user
    );

    res.json(trip);
  } catch (error) {
    next(error);
  }
}

export async function cancelTripController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tripId = String(req.params.id);

    const trip = await tripsService.cancelTrip(tripId, req.user);

    res.json(trip);
  } catch (error) {
    next(error);
  }
}