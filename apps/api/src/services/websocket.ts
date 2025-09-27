import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { createLogger, LogLevel } from "@nethercore/logger";

const logger = createLogger({
  prefix: "WEBSOCKET",
  brand: true,
  level: LogLevel.INFO,
  forceColor: true,
});

export interface BotStats {
  online: boolean;
  uptime: number;
  memoryUsage: {
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

class WebSocketService {
  private io: SocketIOServer | null = null;
  private connectedClients: Set<string> = new Set();
  private botStats: BotStats | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: [
          "http://localhost:3000",
          "http://127.0.0.1:3000",
          process.env.FRONTEND_URL || "http://localhost:3000",
        ],
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });

    this.io.on("connection", (socket) => {
      logger.info(`Client connected: ${socket.id}`);
      this.connectedClients.add(socket.id);

      if (this.botStats) {
        socket.emit("bot-stats", this.botStats);
      }

      socket.on("disconnect", () => {
        logger.info(`Client disconnected: ${socket.id}`);
        this.connectedClients.delete(socket.id);
      });

      socket.on("request-stats", () => {
        if (this.botStats) {
          socket.emit("bot-stats", this.botStats);
        }
      });
    });

    this.startHeartbeat();

    logger.info("WebSocket service initialized");
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.botStats) {
        const now = new Date();
        const timeSinceLastHeartbeat =
          now.getTime() - this.botStats.lastHeartbeat.getTime();

        if (timeSinceLastHeartbeat > 30000) {
          this.botStats.online = false;
          this.broadcastStats();
        }
      }
    }, 30000); // check every 30 seconds
  }

  updateBotStats(stats: Partial<BotStats>) {
    if (!this.botStats) {
      this.botStats = {
        online: true,
        uptime: 0,
        memoryUsage: {
          rss: 0,
          heapTotal: 0,
          heapUsed: 0,
          external: 0,
        },
        guilds: 0,
        users: 0,
        channels: 0,
        ping: 0,
        lastHeartbeat: new Date(),
      };
    }

    this.botStats = {
      ...this.botStats,
      ...stats,
      lastHeartbeat: new Date(),
    };

    this.broadcastStats();
  }

  private broadcastStats() {
    if (this.io && this.botStats) {
      this.io.emit("bot-stats", this.botStats);
      logger.debug(
        `Broadcasted bot stats to ${this.connectedClients.size} clients`
      );
    }
  }

  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  getBotStats(): BotStats | null {
    return this.botStats;
  }

  destroy() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.io) {
      this.io.close();
    }
    logger.info("WebSocket service destroyed");
  }
}

export const webSocketService = new WebSocketService();
