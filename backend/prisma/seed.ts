import "dotenv/config";
import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Starting RideOps seed...");

  const adminPasswordHash = await bcrypt.hash("123456", 10);
  const clientPasswordHash = await bcrypt.hash("123456", 10);

  let transportationCompany = await prisma.transportationCompany.findFirst({
    where: {
      email: "info@rideops.com",
    },
  });

  if (!transportationCompany) {
    transportationCompany = await prisma.transportationCompany.create({
      data: {
        name: "RideOps Demo Transportation",
        email: "info@rideops.com",
        phone: "050-1234567",
      },
    });

    console.log("Transportation company created");
  } else {
    console.log("Transportation company already exists");
  }

  let adminUser = await prisma.user.findFirst({
    where: {
      email: "admin@rideops.com",
    },
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        transportationCompanyId: transportationCompany.id,
        fullName: "RideOps Admin",
        email: "admin@rideops.com",
        passwordHash: adminPasswordHash,
        role: UserRole.COMPANY_ADMIN,
      },
    });

    console.log("Company admin created");
  } else {
    console.log("Company admin already exists");
  }

  let client = await prisma.client.findFirst({
    where: {
      transportationCompanyId: transportationCompany.id,
      externalCode: "1001",
    },
  });

  if (!client) {
    client = await prisma.client.create({
      data: {
        transportationCompanyId: transportationCompany.id,
        externalCode: "1001",
        name: "Herzel High School",
        primaryPhone: "03-0000000",
        secondaryPhone: null,
        mobilePhone: "050-9999999",
        institutionAddress: "הרצל 10, תל אביב",
        notes: "לקוח דמו",
        isActive: true,
      },
    });

    console.log("Client created");
  } else {
    client = await prisma.client.update({
      where: {
        id: client.id,
      },
      data: {
        name: "Herzel High School",
        primaryPhone: "03-0000000",
        secondaryPhone: null,
        mobilePhone: "050-9999999",
        institutionAddress: "הרצל 10, תל אביב",
        notes: "לקוח דמו",
        isActive: true,
      },
    });

    console.log("Client already exists and was updated");
  }

  let clientUser = await prisma.user.findFirst({
    where: {
      email: "school@rideops.com",
    },
  });

  if (!clientUser) {
    clientUser = await prisma.user.create({
      data: {
        transportationCompanyId: transportationCompany.id,
        clientId: client.id,
        fullName: "School Secretary",
        email: "school@rideops.com",
        passwordHash: clientPasswordHash,
        role: UserRole.CLIENT_USER,
      },
    });

    console.log("Client user created");
  } else {
    clientUser = await prisma.user.update({
      where: {
        id: clientUser.id,
      },
      data: {
        transportationCompanyId: transportationCompany.id,
        clientId: client.id,
        fullName: "School Secretary",
        passwordHash: clientPasswordHash,
        role: UserRole.CLIENT_USER,
      },
    });

    console.log("Client user already exists and was updated");
  }

  console.log("Seed completed successfully");

  console.log({
    transportationCompanyId: transportationCompany.id,
    adminUserId: adminUser.id,
    clientId: client.id,
    clientUserId: clientUser.id,
  });
}

main()
  .catch((error) => {
    console.error("Seed failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });