import express from "express";
import cors from "cors";
import { prisma } from "./shared/prisma";
import authRoutes from "./modules/auth/auth.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import tripsRoutes from "./modules/trips/trips.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import exportsRoutes from "./modules/exports/exports.routes";
import clientsRoutes from "./modules/clients/clients.routes";
console.log("EXPORTS ROUTES IMPORTED:", exportsRoutes);
console.log("APP FILE LOADED");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "rideops-backend",
  });
});

app.get("/api/db-check", async (_req, res) => {
  const companiesCount = await prisma.transportationCompany.count();

  res.json({
    status: "ok",
    companiesCount,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/exports", exportsRoutes);
app.use("/api/clients", clientsRoutes);

app.use(errorMiddleware);

export default app;