import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validateRequest } from "../../middlewares/validate.middleware";

import { createTripController } from "./trips.controller";
import { createTripSchema } from "./trips.validation";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole(["CLIENT_USER"]),
  validateRequest(createTripSchema),
  createTripController
);

export default router;