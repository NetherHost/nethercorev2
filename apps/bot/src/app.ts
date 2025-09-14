import "dotenv/config";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { Database } from "@nethercore/database";
import { createLogger, LogLevel } from "@nethercore/logger";

const db = new Database(process.env.MONGODB_URI!);
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

// client.token = process.env.DISCORD_TOKEN!;

export default client;
export { logger };
