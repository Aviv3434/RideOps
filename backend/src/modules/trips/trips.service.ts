import { TripStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";

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
    throw new Error("Client user does not have clientId");
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

  const trip = await prisma.trip.create({
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

  return trip;
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