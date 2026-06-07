import { Request, Response, NextFunction } from "express";
import * as clientsService from "./clients.service";

export async function getClientsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await clientsService.getClients(req.user, {
      page: Number(req.query.page || 1),
      limit: Number(req.query.limit || 10),
      search: req.query.search as string | undefined,
      isActive: req.query.isActive as "true" | "false" | undefined,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getClientByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const client = await clientsService.getClientById(
      String(req.params.id),
      req.user
    );

    res.json(client);
  } catch (error) {
    next(error);
  }
}

export async function createClientController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const client = await clientsService.createClient(req.body, req.user);

    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
}

export async function updateClientController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const client = await clientsService.updateClient(
      String(req.params.id),
      req.body,
      req.user
    );

    res.json(client);
  } catch (error) {
    next(error);
  }
}