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
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const result = await tripsService.getTrips(req.user, page, limit);

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