import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors";

type Role = "COMPANY_ADMIN" | "CLIENT_USER";

export function requireRole(roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };
}