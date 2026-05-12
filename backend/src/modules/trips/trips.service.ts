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
  page: number,
  limit: number
) {
  const skip = (page - 1) * limit;

  const whereClause =
    currentUser.role === "COMPANY_ADMIN"
      ? {
          transportationCompanyId: currentUser.transportationCompanyId,
        }
      : {
          transportationCompanyId: currentUser.transportationCompanyId,
          clientId: currentUser.clientId ?? undefined,
        };

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
        pickupDateTime: "asc",
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