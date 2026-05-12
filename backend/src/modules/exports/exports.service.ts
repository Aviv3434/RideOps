import ExcelJS from "exceljs";
import { TripStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { AppError } from "../../shared/errors";

type CurrentUser = {
  userId: string;
  role: "COMPANY_ADMIN" | "CLIENT_USER";
  transportationCompanyId: string;
  clientId?: string | null;
};

export async function exportApprovedTrips(currentUser: CurrentUser) {
  if (currentUser.role !== "COMPANY_ADMIN") {
    throw new AppError("Forbidden", 403);
  }

  const trips = await prisma.trip.findMany({
    where: {
      transportationCompanyId: currentUser.transportationCompanyId,
      status: TripStatus.APPROVED,
      isExported: false,
    },
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
  });

  if (trips.length === 0) {
    throw new AppError("No approved trips available for export", 400);
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Approved Trips");

  worksheet.columns = [
    { header: "Trip Number", key: "tripNumber", width: 15 },
    { header: "Client", key: "clientName", width: 25 },
    { header: "Pickup Date", key: "pickupDate", width: 18 },
    { header: "Pickup Time", key: "pickupTime", width: 18 },
    { header: "Pickup Location", key: "pickupLocation", width: 30 },
    { header: "Destination", key: "destination", width: 30 },
    { header: "Passengers", key: "passengerCount", width: 15 },
    { header: "Notes", key: "notes", width: 40 },
  ];

  for (const trip of trips) {
    const pickupDate = trip.pickupDateTime.toISOString().slice(0, 10);
    const pickupTime = trip.pickupDateTime.toISOString().slice(11, 16);

    worksheet.addRow({
      tripNumber: trip.tripNumber,
      clientName: trip.client.name,
      pickupDate,
      pickupTime,
      pickupLocation: trip.pickupLocation,
      destination: trip.destination,
      passengerCount: trip.passengerCount,
      notes: trip.notes || "",
    });
  }

  worksheet.getRow(1).font = {
    bold: true,
  };

  const buffer = await workbook.xlsx.writeBuffer();

  await prisma.trip.updateMany({
    where: {
      id: {
        in: trips.map((trip) => trip.id),
      },
      transportationCompanyId: currentUser.transportationCompanyId,
      status: TripStatus.APPROVED,
      isExported: false,
    },
    data: {
      isExported: true,
      exportedAt: new Date(),
    },
  });

  return {
    buffer,
    fileName: `rideops-approved-trips-${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`,
  };
}