import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { validateRequest } from "../../middlewares/validate.middleware";

import {
  createClientController,
  getClientByIdController,
  getClientsController,
  updateClientController,
} from "./clients.controller";

import {
  clientIdParamsSchema,
  createClientSchema,
  getClientsQuerySchema,
  updateClientSchema,
} from "./clients.validation";

const router = Router();

router.get(
  "/",
  authMiddleware,
  requireRole(["COMPANY_ADMIN"]),
  validateRequest(getClientsQuerySchema, "query"),
  getClientsController
);

router.get(
  "/:id",
  authMiddleware,
  requireRole(["COMPANY_ADMIN"]),
  validateRequest(clientIdParamsSchema, "params"),
  getClientByIdController
);

router.post(
  "/",
  authMiddleware,
  requireRole(["COMPANY_ADMIN"]),
  validateRequest(createClientSchema),
  createClientController
);

router.patch(
  "/:id",
  authMiddleware,
  requireRole(["COMPANY_ADMIN"]),
  validateRequest(clientIdParamsSchema, "params"),
  validateRequest(updateClientSchema),
  updateClientController
);

export default router;