import express from "express";
import cors from "cors";
import { prisma } from "./shared/prisma";
import authRoutes from "./modules/auth/auth.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import tripsRoutes from "./modules/trips/trips.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";

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

app.use(errorMiddleware);

export default app;