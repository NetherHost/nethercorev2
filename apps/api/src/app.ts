import "dotenv/config";
import express, { Application } from "express";
import apiRoutes from "./api/v1/routes";
import { Database } from "@nethercore/database";
import { logger } from "./index";
import { allowedAccess } from "./middleware/allowedAccess";

const db = new Database(process.env.MONGODB_URI!);

(async () => {
  await db.connect().catch((e) => {
    logger.fatal(
      `Failed to connect to MongoDB: ${
        e instanceof Error ? e.message : "Unknown error"
      }`
    );
    process.exit(1);
  });
})();

export const isDatabaseConnected = () => {
  return db.isConnected();
};

const app: Application = express();

app.use(allowedAccess);
app.use("/api/v1", apiRoutes);

export default app;
