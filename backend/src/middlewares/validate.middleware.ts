import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

type ValidationTarget =
  | "body"
  | "query"
  | "params";

export function validateRequest(
  schema: ZodSchema,
  target: ValidationTarget = "body"
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      schema.parse(req[target]);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      next(error);
    }
  };
}