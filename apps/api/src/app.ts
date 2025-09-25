import dotenv from "dotenv";
import express, { Application } from "express";
import session from "express-session";
import cors from "cors";
import { createServer } from "http";
import apiRoutes from "./api/v1/routes";
import { Database, DatabaseConfig } from "@nethercore/database";
import { allowedAccess } from "./middleware/allowedAccess";
import { webSocketService } from "./services/websocket";
import { botStatsService } from "./services/botStats";

// get env variables based on environment
const envPath =
  process.env.NODE_ENV === "production" ? ".env.prod" : ".env.local";
dotenv.config({ path: envPath });

const dbConfig: DatabaseConfig = {
  uri: process.env.MONGODB_URI || "mongodb://localhost:27017/nethercore",
  options: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
};

const db = new Database(dbConfig);

(async () => {
  await db.connect();
})();

export const isDatabaseConnected = () => {
  return db.isConnected();
};

export const getDatabase = () => {
  return db;
};

const app: Application = express();

// cors
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      process.env.FRONTEND_URL || "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// app.use(allowedAccess);
app.use(express.json());
app.use("/api/v1", apiRoutes);
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: "Not Found",
    message: "All routes are prefixed with /api/v1. Did you forget to add it?",
  });
});

// Create HTTP server
const server = createServer(app);

// Initialize WebSocket service
webSocketService.initialize(server);

// Start bot stats collection
botStatsService.start();

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  botStatsService.stop();
  webSocketService.destroy();
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  botStatsService.stop();
  webSocketService.destroy();
  server.close(() => {
    console.log("Process terminated");
  });
});

export default app;
export { server };
