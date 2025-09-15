import "dotenv/config";
import { Request, Response } from "express";
import { isDatabaseConnected } from "../../../app";

export const healthController = (req: Request, res: Response) => {
  const dbHealth = isDatabaseConnected();

  res
    .status(200)
    .json({ status: "ok", db: dbHealth ? "connected" : "disconnected" });
};
