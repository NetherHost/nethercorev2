import "dotenv/config";
import express, { Application } from "express";
import apiRoutes from "./api/v1/routes";
import { Database } from "@nethercore/database";
import { allowedAccess } from "./middleware/allowedAccess";

const db = new Database(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

(async () => {
  await db.connect();
})();

export const isDatabaseConnected = () => {
  return db.isConnected();
};

export const getDatabase = () => {
  return db;
};

const app: Application = express();

app.use(allowedAccess);
app.use(express.json());
app.use("/", (req, res) => {
  res.status(200).json({
    message: "All routes are prefixed with /api/v1. Did you forget to add it?",
  });
});
app.use("/api/v1", apiRoutes);

export default app;
