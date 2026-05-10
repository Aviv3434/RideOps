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

  const transportationCompany = await prisma.transportationCompany.create({
    data: {
      name: "RideOps Demo Transportation",
      email: "info@rideops.com",
      phone: "050-1234567",
    },
  });

  console.log("Transportation company created");

  const adminUser = await prisma.user.create({
    data: {
      transportationCompanyId: transportationCompany.id,
      fullName: "RideOps Admin",
      email: "admin@rideops.com",
      passwordHash: adminPasswordHash,
      role: UserRole.COMPANY_ADMIN,
    },
  });

  console.log("Company admin created");

  const client = await prisma.client.create({
    data: {
      transportationCompanyId: transportationCompany.id,
      name: "Herzel High School",
      contactName: "David Cohen",
      contactEmail: "david@school.com",
      contactPhone: "050-9999999",
    },
  });

  console.log("Client created");

  const clientUser = await prisma.user.create({
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