import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function meController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user.userId;

    const user = await authService.getCurrentUser(userId);

    res.json(user);
  } catch (error) {
    next(error);
  }
}