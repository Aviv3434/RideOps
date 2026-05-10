import express from "express";
import cors from "cors";
import { prisma } from "./shared/prisma";

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
  res.json({
    status: "Database connection works",
  });
});

export default app;