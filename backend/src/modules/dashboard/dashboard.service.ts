import { TripStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";

type CurrentUser = {
  userId: string;
  role: "COMPANY_ADMIN" | "CLIENT_USER";
  transportationCompanyId: string;
  clientId?: string | null;
};

function getTodayRange() {
  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setUTCHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
}

function getCurrentMonthRange() {
  const now = new Date();

  const startOfMonth = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      1,
      0,
      0,
      0,
      0
    )
  );

  const endOfMonth = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      0,
      23,
      59,
      59,
      999
    )
  );

  return { startOfMonth, endOfMonth };
}

export async function getDashboardStats(
  currentUser: CurrentUser
) {
  const baseTripWhere =
    currentUser.role === "COMPANY_ADMIN"
      ? {
          transportationCompanyId:
            currentUser.transportationCompanyId,
        }
      : {
          transportationCompanyId:
            currentUser.transportationCompanyId,

          clientId:
            currentUser.clientId ?? undefined,
        };

  const { startOfDay, endOfDay } =
    getTodayRange();

  const {
    startOfMonth,
    endOfMonth,
  } = getCurrentMonthRange();

  const [
    pendingApprovalCount,
    approvedTripsCount,
    rejectedTripsCount,
    cancelledTripsCount,
    tripsToday,
    tripsThisMonth,
    activeClientsCount,
  ] = await Promise.all([
    prisma.trip.count({
      where: {
        ...baseTripWhere,
        status: TripStatus.PENDING_APPROVAL,
      },
    }),

    prisma.trip.count({
      where: {
        ...baseTripWhere,
        status: TripStatus.APPROVED,
      },
    }),

    prisma.trip.count({
      where: {
        ...baseTripWhere,
        status: TripStatus.REJECTED,
      },
    }),

    prisma.trip.count({
      where: {
        ...baseTripWhere,
        status: TripStatus.CANCELLED,
      },
    }),

    prisma.trip.count({
      where: {
        ...baseTripWhere,
        pickupDateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),

    prisma.trip.count({
      where: {
        ...baseTripWhere,
        pickupDateTime: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    }),

    currentUser.role === "COMPANY_ADMIN"
      ? prisma.client.count({
          where: {
            transportationCompanyId:
              currentUser.transportationCompanyId,
          },
        })
      : prisma.client.count({
          where: {
            id:
              currentUser.clientId ?? "",
            transportationCompanyId:
              currentUser.transportationCompanyId,
          },
        }),
  ]);

  return {
    pendingApprovalCount,
    approvedTripsCount,
    rejectedTripsCount,
    cancelledTripsCount,
    tripsToday,
    tripsThisMonth,
    activeClientsCount,
  };
}