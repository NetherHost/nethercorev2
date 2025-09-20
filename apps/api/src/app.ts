import dotenv from "dotenv";
import express, { Application } from "express";
import session from "express-session";
import apiRoutes from "./api/v1/routes";
import { Database } from "@nethercore/database";
import { allowedAccess } from "./middleware/allowedAccess";

// get env variables based on environment
const envPath =
  process.env.NODE_ENV === "production" ? ".env.prod" : ".env.local";
dotenv.config({ path: envPath });

// new supabase instance
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

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

app.use(allowedAccess);
app.use(express.json());
app.use("/api/v1", apiRoutes);
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: "Not Found",
    message: "All routes are prefixed with /api/v1. Did you forget to add it?",
  });
});

export default app;
