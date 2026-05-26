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

function formatDateForExcel(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatTimeForExcel(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

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
  const worksheet = workbook.addWorksheet("יבוא מוניות");

  worksheet.views = [
    {
      rightToLeft: true,
    },
  ];

  worksheet.columns = [
    { header: "שם לקוח", key: "clientName", width: 28 },
    { header: "תאריך", key: "date", width: 14 },
    { header: "שעת התחלה", key: "startTime", width: 14 },
    { header: "תאור", key: "description", width: 55 },
    { header: "הערות", key: "notes", width: 35 },
    { header: "שם הנהג", key: "driverName", width: 18 },
    { header: "מחיר לקוח", key: "clientPrice", width: 14 },
    { header: "מחיר נהג", key: "driverPrice", width: 14 },
    { header: "מספר ויזה", key: "identifier", width: 16 },
  ];

  worksheet.getRow(1).font = {
    bold: true,
  };

  worksheet.getRow(1).alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  for (const trip of trips) {
    const pickupDateTime = trip.pickupDateTime;

    worksheet.addRow({
      clientName: trip.client.name,
      date: formatDateForExcel(pickupDateTime),
      startTime: formatTimeForExcel(pickupDateTime),
      description: `איסוף: ${trip.pickupLocation} | יעד: ${trip.destination} | נוסעים: ${trip.passengerCount}`,
      notes: trip.notes || "",
      driverName: "",
      clientPrice: "",
      driverPrice: "",
      identifier: trip.tripNumber,
    });
  }

  worksheet.eachRow((row) => {
    row.alignment = {
      horizontal: "right",
      vertical: "middle",
      wrapText: true,
    };
  });

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
    fileName: `rideops-taxi-import-${new Date()
      .toISOString()
      .slice(0, 10)}.xls`,
  };
}