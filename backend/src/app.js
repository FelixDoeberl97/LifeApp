import cors from "cors";
import express from "express";
import { initializeDatabase } from "./database/database.js";
import authRoutes from "./routes/authRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

export async function createApp(database) {
  const app = express();
  app.locals.database = database ?? (await initializeDatabase());

  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (request, response) => {
    response.json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/budgets", budgetRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/transactions", transactionRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  app.use((request, response) => {
    response.status(404).json({ message: "Endpoint not found." });
  });

  app.use((error, request, response, next) => {
    const statusCode = error.statusCode ?? 500;
    const message = statusCode === 500 ? "Internal server error." : error.message;
    response.status(statusCode).json({ message });
  });

  return app;
}
