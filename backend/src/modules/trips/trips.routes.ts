import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { requireRole } from "../../middlewares/role.middleware";

import { validateRequest } from "../../middlewares/validate.middleware";

import {
  createTripController,
  getTripsController,
} from "./trips.controller";

import {
  createTripSchema,
  getTripsQuerySchema,
} from "./trips.validation";

const router = Router();

router.post(
  "/",

  authMiddleware,

  requireRole(["CLIENT_USER"]),

  validateRequest(
    createTripSchema,
    "body"
  ),

  createTripController
);

router.get(
  "/",

  authMiddleware,

  validateRequest(
    getTripsQuerySchema,
    "query"
  ),

  getTripsController
);

export default router;