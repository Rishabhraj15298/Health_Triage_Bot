// app.js
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import profileRoutes from "./routes/profile.routes.js";
import documentRoutes from "./routes/document.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import riskRoutes from "./routes/risk.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk authentication middleware (applies to all routes)
app.use(clerkMiddleware());

// Request logger
app.use(requestLogger);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HealthAI Backend API"
  });
});

// API Routes
app.use("/api/profile", profileRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/risk", riskRoutes);

// 404 Handler (must be after all routes)
app.use(notFound);

// Error Handler (must be last)
app.use(errorHandler);

export default app;
