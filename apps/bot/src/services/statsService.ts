import { Client } from "discord.js";
import { createLogger, LogLevel } from "@nethercore/logger";

const logger = createLogger({
  prefix: "BOT-STATS",
  brand: true,
  level: LogLevel.INFO,
  forceColor: true,
});

export interface BotStatsData {
  online: boolean;
  uptime: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  guilds: number;
  users: number;
  channels: number;
  ping: number;
  lastHeartbeat: Date;
}

export class StatsService {
  private client: Client;
  private startTime: Date;
  private apiUrl: string;

  constructor(client: Client) {
    this.client = client;
    this.startTime = new Date(Date.now() - process.uptime() * 1000);
    this.apiUrl = process.env.API_URL || "http://localhost:3001";
  }

  getStats(): BotStatsData {
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime() * 1000;

    const totalUsers = this.client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );

    const totalChannels = this.client.channels.cache.size;

    return {
      online: this.client.isReady(),
      uptime,
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
      },
      guilds: this.client.guilds.cache.size,
      users: totalUsers,
      channels: totalChannels,
      ping: this.client.ws.ping,
      lastHeartbeat: new Date(),
    };
  }

  async sendStatsToAPI() {
    try {
      const stats = this.getStats();

      const response = await fetch(`${this.apiUrl}/api/v1/bot/stats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stats,
        }),
      });

      if (!response.ok) {
        logger.warn(`Failed to send stats to API: ${response.status}`);
      } else {
        logger.debug("Stats sent to API successfully");
      }
    } catch (error) {
      logger.error("Error sending stats to API:", error);
    }
  }

  startHeartbeat(intervalMs: number = 1000) {
    this.sendStatsToAPI();

    setInterval(() => {
      this.sendStatsToAPI();
    }, intervalMs);

    logger.info(`Bot stats heartbeat started (${intervalMs}ms interval)`);
  }
}
