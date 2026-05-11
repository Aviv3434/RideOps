import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validateRequest } from "../../middlewares/validate.middleware";

import {
  createTripController,
  getTripsController,
  getTripByIdController,
} from "./trips.controller";

import {
  createTripSchema,
  getTripsQuerySchema,
  tripIdParamsSchema,
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

router.get(
  "/:id",
  authMiddleware,
  validateRequest(tripIdParamsSchema, "params"),
  getTripByIdController
);

export default router;