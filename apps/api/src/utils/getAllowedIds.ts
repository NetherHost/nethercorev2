import "dotenv/config";

export const getAllowedIds = () => {
  return process.env.ALLOWED_IDS?.split(",") || [];
};
