import "dotenv/config";

export const getAllowedIds = () => {
  return process.env.ALLOWED_DISCORD_USER_IDS?.split(",") || [];
};
