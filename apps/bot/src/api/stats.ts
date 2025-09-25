import express, { Router } from "express";
import cors from "cors";
import { Client } from "discord.js";
import { StatsService } from "../services/statsService";

const router: Router = express.Router();

router.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      process.env.FRONTEND_URL || "http://localhost:3000",
    ],
    credentials: true,
  })
);

router.get("/", (req, res) => {
  try {
    const client = (global as any).discordClient as Client;

    if (!client) {
      return res.status(503).json({
        success: false,
        message: "Bot client not available",
      });
    }

    const statsService = new StatsService(client);
    const stats = statsService.getStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error getting bot stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/health", (req, res) => {
  const client = (global as any).discordClient as Client;

  res.json({
    success: true,
    data: {
      online: client?.isReady() || false,
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
