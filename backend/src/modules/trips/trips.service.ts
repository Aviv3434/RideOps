import { TripStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { AppError } from "../../shared/errors";

type CreateTripInput = {
  pickupDateTime: string;
  pickupLocation: string;
  destination: string;
  passengerCount: number;
  notes?: string;
};

type CurrentUser = {
  userId: string;
  role: "COMPANY_ADMIN" | "CLIENT_USER";
  transportationCompanyId: string;
  clientId?: string | null;
};

type GetTripsFilters = {
  page: number;
  limit: number;
  status?: TripStatus;
  pickupDate?: string;
  clientId?: string;
  search?: string;
  sortBy: "pickupDateTime" | "createdAt";
  sortOrder: "asc" | "desc";
};

export async function createTrip(
  data: CreateTripInput,
  currentUser: CurrentUser
) {
  if (!currentUser.clientId) {
    throw new AppError("Client user does not have clientId", 400);
  }

  const latestTrip = await prisma.trip.findFirst({
    where: {
      transportationCompanyId: currentUser.transportationCompanyId,
    },
    orderBy: {
      tripNumber: "desc",
    },
  });

  const nextTripNumber = latestTrip ? latestTrip.tripNumber + 1 : 1001;

  const existingTrip = await prisma.trip.findFirst({
    where: {
      transportationCompanyId: currentUser.transportationCompanyId,
      clientId: currentUser.clientId,
      pickupDateTime: new Date(data.pickupDateTime),
      destination: data.destination,
      status: {
        notIn: [TripStatus.REJECTED, TripStatus.CANCELLED],
      },
    },
  });

  const duplicateWarning = Boolean(existingTrip);

  return prisma.trip.create({
    data: {
      transportationCompanyId: currentUser.transportationCompanyId,
      clientId: currentUser.clientId,
      createdByUserId: currentUser.userId,
      tripNumber: nextTripNumber,
      pickupDateTime: new Date(data.pickupDateTime),
      pickupLocation: data.pickupLocation,
      destination: data.destination,
      passengerCount: data.passengerCount,
      notes: data.notes,
      status: TripStatus.PENDING_APPROVAL,
      duplicateWarning,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      createdByUser: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
}

export async function getTrips(
  currentUser: CurrentUser,
  filters: GetTripsFilters
) {
  const {
    page,
    limit,
    status,
    pickupDate,
    clientId,
    search,
    sortBy,
    sortOrder,
  } = filters;

  const skip = (page - 1) * limit;

  const whereClause: any = {
    transportationCompanyId: currentUser.transportationCompanyId,
  };

  if (currentUser.role === "CLIENT_USER") {
    whereClause.clientId = currentUser.clientId;
  }

  if (currentUser.role === "COMPANY_ADMIN" && clientId) {
    whereClause.clientId = clientId;
  }

  if (status) {
    whereClause.status = status;
  }

  if (pickupDate) {
    const startOfDay = new Date(`${pickupDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${pickupDate}T23:59:59.999Z`);

    whereClause.pickupDateTime = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }

  if (search) {
    whereClause.OR = [
      {
        pickupLocation: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        destination: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        notes: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        client: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  const [trips, total] = await Promise.all([
    prisma.trip.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    }),

    prisma.trip.count({
      where: whereClause,
    }),
  ]);

  return {
    data: trips,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    filters: {
      status,
      pickupDate,
      clientId: currentUser.role === "COMPANY_ADMIN" ? clientId : undefined,
      search,
      sortBy,
      sortOrder,
    },
  };
}

export async function getTripById(
  tripId: string,
  currentUser: CurrentUser
) {
  const whereClause =
    currentUser.role === "COMPANY_ADMIN"
      ? {
          id: tripId,
          transportationCompanyId: currentUser.transportationCompanyId,
        }
      : {
          id: tripId,
          transportationCompanyId: currentUser.transportationCompanyId,
          clientId: currentUser.clientId ?? undefined,
        };

  const trip = await prisma.trip.findFirst({
    where: whereClause,
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      createdByUser: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      approvedByUser: {
        select: {
          id: true,
          fullName: true,
        },
      },
      rejectedByUser: {
        select: {
          id: true,
          fullName: true,
        },
      },
      cancelledByUser: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });

  if (!trip) {
    throw new AppError("Trip not found", 404);
  }

  return trip;
}

export async function approveTrip(
  tripId: string,
  currentUser: CurrentUser
) {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      transportationCompanyId: currentUser.transportationCompanyId,
    },
  });

  if (!trip) {
    throw new AppError("Trip not found", 404);
  }

  if (trip.status === TripStatus.APPROVED) {
    throw new AppError("Trip is already approved", 400);
  }

  return prisma.trip.update({
    where: {
      id: trip.id,
    },
    data: {
      status: TripStatus.APPROVED,
      approvedAt: new Date(),
      approvedByUserId: currentUser.userId,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      approvedByUser: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
}

export async function rejectTrip(
  tripId: string,
  rejectionReason: string,
  currentUser: CurrentUser
) {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      transportationCompanyId: currentUser.transportationCompanyId,
    },
  });

  if (!trip) {
    throw new AppError("Trip not found", 404);
  }

  if (trip.status === TripStatus.APPROVED) {
    throw new AppError("Approved trip cannot be rejected", 400);
  }

  if (trip.status === TripStatus.REJECTED) {
    throw new AppError("Trip is already rejected", 400);
  }

  return prisma.trip.update({
    where: {
      id: trip.id,
    },
    data: {
      status: TripStatus.REJECTED,
      rejectionReason,
      rejectedAt: new Date(),
      rejectedByUserId: currentUser.userId,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      rejectedByUser: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
}

export async function cancelTrip(
  tripId: string,
  currentUser: CurrentUser
) {
  const whereClause =
    currentUser.role === "COMPANY_ADMIN"
      ? {
          id: tripId,
          transportationCompanyId: currentUser.transportationCompanyId,
        }
      : {
          id: tripId,
          transportationCompanyId: currentUser.transportationCompanyId,
          clientId: currentUser.clientId ?? undefined,
        };

  const trip = await prisma.trip.findFirst({
    where: whereClause,
  });

  if (!trip) {
    throw new AppError("Trip not found", 404);
  }

  if (trip.status === TripStatus.CANCELLED) {
    throw new AppError("Trip is already cancelled", 400);
  }

  return prisma.trip.update({
    where: {
      id: trip.id,
    },
    data: {
      status: TripStatus.CANCELLED,
      cancelledAt: new Date(),
      cancelledByUserId: currentUser.userId,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      cancelledByUser: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });
}