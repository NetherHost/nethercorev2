import { webSocketService, BotStats } from "./websocket";
import { createLogger, LogLevel } from "@nethercore/logger";
import axios from "axios";

const logger = createLogger({
  prefix: "BOT-STATS",
  brand: true,
  level: LogLevel.INFO,
  forceColor: true,
});

export class BotStatsService {
  private botApiUrl: string;
  private updateInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor() {
    this.botApiUrl = process.env.BOT_API_URL || "http://localhost:3002";
  }

  start() {
    if (this.isRunning) {
      logger.warn("Bot stats service is already running");
      return;
    }

    this.isRunning = true;
    logger.info("Starting bot stats service");

    this.collectStats();

    this.updateInterval = setInterval(() => {
      this.collectStats();
    }, 1000); // every 1 sec
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    webSocketService.updateBotStats({
      online: false,
      lastHeartbeat: new Date(),
    });

    logger.info("Bot stats service stopped");
  }

  private async collectStats() {
    try {
      const response = await axios.get(`${this.botApiUrl}/api/stats`, {
        timeout: 3000,
      });

      if (response.data && response.data.success) {
        const botData = response.data.data;

        const stats: BotStats = {
          online: true,
          uptime: botData.uptime || 0,
          memoryUsage: {
            rss: botData.memory?.rss || 0,
            heapTotal: botData.memory?.heapTotal || 0,
            heapUsed: botData.memory?.heapUsed || 0,
            external: botData.memory?.external || 0,
          },
          guilds: botData.guilds || 0,
          users: botData.users || 0,
          channels: botData.channels || 0,
          ping: botData.ping || 0,
          lastHeartbeat: new Date(),
        };

        webSocketService.updateBotStats(stats);
        logger.debug("Bot stats updated successfully");
      }
    } catch (error: any) {
      logger.debug("Bot is offline or unreachable:", error.message);

      webSocketService.updateBotStats({
        online: false,
        lastHeartbeat: new Date(),
      });
    }
  }

  updateStats(stats: Partial<BotStats>) {
    webSocketService.updateBotStats({
      ...stats,
      lastHeartbeat: new Date(),
    });
  }
}

export const botStatsService = new BotStatsService();
