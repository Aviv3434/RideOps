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