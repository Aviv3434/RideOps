import { z } from "zod";

export const getClientsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().min(1).max(100).optional(),
  isActive: z
    .enum(["true", "false"])
    .optional(),
});

export const clientIdParamsSchema = z.object({
  id: z.string().uuid("Invalid client id"),
});

export const createClientSchema = z.object({
  externalCode: z.string().min(1, "External code is required").max(50),
  name: z.string().min(2, "Client name is required").max(255),

  primaryPhone: z.string().max(50).optional(),
  secondaryPhone: z.string().max(50).optional(),
  mobilePhone: z.string().max(50).optional(),
  institutionAddress: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),

  isActive: z.boolean().optional(),
});

export const updateClientSchema = z.object({
  externalCode: z.string().min(1).max(50).optional(),
  name: z.string().min(2).max(255).optional(),

  primaryPhone: z.string().max(50).nullable().optional(),
  secondaryPhone: z.string().max(50).nullable().optional(),
  mobilePhone: z.string().max(50).nullable().optional(),
  institutionAddress: z.string().max(500).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),

  isActive: z.boolean().optional(),
});