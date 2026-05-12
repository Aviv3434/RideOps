import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validateRequest } from "../../middlewares/validate.middleware";

import {
  createTripController,
  getTripsController,
  getTripByIdController,
  approveTripController,
  rejectTripController,
  cancelTripController,
} from "./trips.controller";

import {
  createTripSchema,
  getTripsQuerySchema,
  tripIdParamsSchema,
  rejectTripSchema,
} from "./trips.validation";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole(["CLIENT_USER"]),
  validateRequest(createTripSchema),
  createTripController
);

router.get(
  "/",
  authMiddleware,
  validateRequest(getTripsQuerySchema, "query"),
  getTripsController
);

router.patch(
  "/:id/approve",
  authMiddleware,
  requireRole(["COMPANY_ADMIN"]),
  validateRequest(tripIdParamsSchema, "params"),
  approveTripController
);

router.patch(
  "/:id/reject",
  authMiddleware,
  requireRole(["COMPANY_ADMIN"]),
  validateRequest(tripIdParamsSchema, "params"),
  validateRequest(rejectTripSchema),
  rejectTripController
);

router.patch(
  "/:id/cancel",
  authMiddleware,
  validateRequest(tripIdParamsSchema, "params"),
  cancelTripController
);

router.get(
  "/:id",
  authMiddleware,
  validateRequest(tripIdParamsSchema, "params"),
  getTripByIdController
);

export default router;