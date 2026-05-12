import { Request, Response, NextFunction } from "express";
import * as exportsService from "./exports.service";

export async function exportApprovedTripsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await exportsService.exportApprovedTrips(req.user);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${result.fileName}"`
    );

    res.send(result.buffer);
  } catch (error) {
    next(error);
  }
}