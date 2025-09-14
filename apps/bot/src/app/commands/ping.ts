import type { ChatInputCommand, CommandData, MessageCommand } from "commandkit";

export const command: CommandData = {
  name: "ping",
  description: "Pong!",
};

export const chatInput: ChatInputCommand = async ({ interaction }) => {
  await interaction.reply("Pong!");
};
