import { Router } from "express";

import {
  loginController,
  meController,
} from "./auth.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { validateRequest } from "../../middlewares/validate.middleware";

import { loginSchema } from "./auth.validation";

const router = Router();

router.post(
  "/login",
  validateRequest(loginSchema),
  loginController
);

router.get(
  "/me",
  authMiddleware,
  meController
);

export default router;