import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { getDashboardStatsController } from "./dashboard.controller";

const router = Router();

router.get(
  "/stats",
  authMiddleware,
  getDashboardStatsController
);

export default router;