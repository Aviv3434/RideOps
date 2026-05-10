import { Router } from "express";
import { loginController, meController } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/login", loginController);

router.get("/me", authMiddleware, meController);

export default router;