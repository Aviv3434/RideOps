import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { AppError } from "../../shared/errors";

type CurrentUser = {
  userId: string;
  role: "COMPANY_ADMIN" | "CLIENT_USER";
  transportationCompanyId: string;
  clientId?: string | null;
};

type GetClientsFilters = {
  page: number;
  limit: number;
  search?: string;
  isActive?: "true" | "false";
};

type CreateClientInput = {
  externalCode: string;
  name: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  mobilePhone?: string;
  institutionAddress?: string;
  notes?: string;
  isActive?: boolean;
};

type UpdateClientInput = {
  externalCode?: string;
  name?: string;
  primaryPhone?: string | null;
  secondaryPhone?: string | null;
  mobilePhone?: string | null;
  institutionAddress?: string | null;
  notes?: string | null;
  isActive?: boolean;
};

function ensureCompanyAdmin(currentUser: CurrentUser) {
  if (currentUser.role !== "COMPANY_ADMIN") {
    throw new AppError("Forbidden", 403);
  }
}

export async function getClients(
  currentUser: CurrentUser,
  filters: GetClientsFilters
) {
  ensureCompanyAdmin(currentUser);

  const { page, limit, search, isActive } = filters;
  const skip = (page - 1) * limit;

  const whereClause: Prisma.ClientWhereInput = {
    transportationCompanyId: currentUser.transportationCompanyId,
  };

  if (typeof isActive !== "undefined") {
    whereClause.isActive = isActive === "true";
  }

  if (search) {
    whereClause.OR = [
      {
        externalCode: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        primaryPhone: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        secondaryPhone: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        mobilePhone: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where: whereClause,
      orderBy: {
        name: "asc",
      },
      skip,
      take: limit,
      select: {
        id: true,
        externalCode: true,
        name: true,
        primaryPhone: true,
        secondaryPhone: true,
        mobilePhone: true,
        institutionAddress: true,
        notes: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

    prisma.client.count({
      where: whereClause,
    }),
  ]);

  return {
    data: clients,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getClientById(
  clientId: string,
  currentUser: CurrentUser
) {
  ensureCompanyAdmin(currentUser);

  const client = await prisma.client.findFirst({
    where: {
      id: clientId,
      transportationCompanyId: currentUser.transportationCompanyId,
    },
    select: {
      id: true,
      externalCode: true,
      name: true,
      primaryPhone: true,
      secondaryPhone: true,
      mobilePhone: true,
      institutionAddress: true,
      notes: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      users: {
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          isActive: true,
        },
      },
    },
  });

  if (!client) {
    throw new AppError("Client not found", 404);
  }

  return client;
}

export async function createClient(
  data: CreateClientInput,
  currentUser: CurrentUser
) {
  ensureCompanyAdmin(currentUser);

  try {
    const client = await prisma.client.create({
      data: {
        transportationCompanyId: currentUser.transportationCompanyId,
        externalCode: data.externalCode.trim(),
        name: data.name.trim(),
        primaryPhone: data.primaryPhone?.trim() || null,
        secondaryPhone: data.secondaryPhone?.trim() || null,
        mobilePhone: data.mobilePhone?.trim() || null,
        institutionAddress: data.institutionAddress?.trim() || null,
        notes: data.notes?.trim() || null,
        isActive: data.isActive ?? true,
      },
      select: {
        id: true,
        externalCode: true,
        name: true,
        primaryPhone: true,
        secondaryPhone: true,
        mobilePhone: true,
        institutionAddress: true,
        notes: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return client;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError("Client external code already exists", 409);
    }

    throw error;
  }
}

export async function updateClient(
  clientId: string,
  data: UpdateClientInput,
  currentUser: CurrentUser
) {
  ensureCompanyAdmin(currentUser);

  const existingClient = await prisma.client.findFirst({
    where: {
      id: clientId,
      transportationCompanyId: currentUser.transportationCompanyId,
    },
  });

  if (!existingClient) {
    throw new AppError("Client not found", 404);
  }

  try {
    const updatedClient = await prisma.client.update({
      where: {
        id: existingClient.id,
      },
      data: {
        ...(typeof data.externalCode !== "undefined" && {
          externalCode: data.externalCode.trim(),
        }),
        ...(typeof data.name !== "undefined" && {
          name: data.name.trim(),
        }),
        ...(typeof data.primaryPhone !== "undefined" && {
          primaryPhone: data.primaryPhone?.trim() || null,
        }),
        ...(typeof data.secondaryPhone !== "undefined" && {
          secondaryPhone: data.secondaryPhone?.trim() || null,
        }),
        ...(typeof data.mobilePhone !== "undefined" && {
          mobilePhone: data.mobilePhone?.trim() || null,
        }),
        ...(typeof data.institutionAddress !== "undefined" && {
          institutionAddress: data.institutionAddress?.trim() || null,
        }),
        ...(typeof data.notes !== "undefined" && {
          notes: data.notes?.trim() || null,
        }),
        ...(typeof data.isActive !== "undefined" && {
          isActive: data.isActive,
        }),
      },
      select: {
        id: true,
        externalCode: true,
        name: true,
        primaryPhone: true,
        secondaryPhone: true,
        mobilePhone: true,
        institutionAddress: true,
        notes: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedClient;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError("Client external code already exists", 409);
    }

    throw error;
  }
}