import express, { Request, Response } from "express";
import cors from "cors";
import statsRouter from "./stats";
import { createLogger, LogLevel } from "@nethercore/logger";

const logger = createLogger({
  prefix: "BOT-API",
  brand: true,
  level: LogLevel.INFO,
  forceColor: true,
});

export function createBotAPIServer(client: any): express.Express {
  const app = express();
  const port = parseInt(process.env.BOT_API_PORT || "3002");

  app.use(
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

  app.use(express.json());

  (global as any).discordClient = client;

  app.use("/api/stats", statsRouter);

  app.get("/health", (req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Bot API server is running",
      timestamp: new Date().toISOString(),
    });
  });

  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: "Endpoint not found",
    });
  });

  app.listen(port, () => {
    logger.info(`Bot API server running on port ${port}`);
  });

  return app;
}
