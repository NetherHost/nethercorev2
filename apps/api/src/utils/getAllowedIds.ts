import "dotenv/config";

// helper function gets allowed discord user ids from .env
export const getAllowedIds = () => {
  return process.env.ALLOWED_DISCORD_USER_IDS?.split(",") || [];
};
