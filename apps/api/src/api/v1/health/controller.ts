import "dotenv/config";
import { Request, Response } from "express";
import { isDatabaseConnected } from "../../../app";
import {
  DBHealthStatus,
  HealthStatus,
  IHealthResponse,
} from "../../../types/health";

export const healthController = (
  req: Request,
  res: Response<IHealthResponse>
): void => {
  const dbHealth = isDatabaseConnected();

  const health: IHealthResponse = {
    status: HealthStatus.OK,
    db: dbHealth ? DBHealthStatus.CONNECTED : DBHealthStatus.DISCONNECTED,
  };

  res.status(200).json(health);
};
