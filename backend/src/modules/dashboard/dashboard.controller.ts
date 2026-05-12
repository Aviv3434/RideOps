import {
  Request,
  Response,
  NextFunction,
} from "express";

import * as dashboardService from "./dashboard.service";

export async function getDashboardStatsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const stats =
      await dashboardService.getDashboardStats(
        req.user
      );

    res.json(stats);
  } catch (error) {
    next(error);
  }
}