import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

import { exportApprovedTripsController } from "./exports.controller";

console.log("EXPORTS ROUTES LOADED");

const router = Router();

router.get("/test", (_req, res) => {
  res.json({ message: "exports route works" });
});

router.post(
  "/approved",
  authMiddleware,
  requireRole(["COMPANY_ADMIN"]),
  exportApprovedTripsController
);

export default router;