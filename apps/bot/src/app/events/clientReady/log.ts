import type { Client } from "discord.js";
import { logger } from "../../../app";

export default function (client: Client<true>) {
  logger.success(`${client.user.username} is online!`);
}
