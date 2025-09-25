import dotenv from "dotenv";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { Database } from "@nethercore/database";
import { createLogger, LogLevel } from "@nethercore/logger";
import { StatsService } from "./services/statsService";
import { createBotAPIServer } from "./api/server";

const envPath =
  process.env.NODE_ENV === "production" ? ".env.prod" : ".env.local";
dotenv.config({ path: envPath });

const db = new Database({ uri: process.env.MONGODB_URI! });
const logger = createLogger({
  prefix: "BOT",
  brand: true,
  level: LogLevel.INFO,
  forceColor: true,
});

(async () => {
  await db.connect();
})();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

let statsService: StatsService;

createBotAPIServer(client);

client.once("clientReady", () => {
  statsService = new StatsService(client);
  statsService.startHeartbeat(1000); // Send stats every 1 second

  logger.info("Bot stats service started");
});

logger.info(`Environment: ${process.env.NODE_ENV}`);

export default client;
export { logger, statsService };
