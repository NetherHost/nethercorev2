import "dotenv/config";
import { Request, Response } from "express";
import { isDatabaseConnected } from "../../../app";
import redis from "../../../utils/redis";
import { CacheKeys, CacheTTL } from "../../../utils/cacheKeys";
import {
  DBHealthStatus,
  HealthStatus,
  IHealthResponse,
} from "../../../types/health";

export const healthController = async (
  req: Request,
  res: Response<IHealthResponse>
): Promise<void> => {
  try {
    const cacheKey = CacheKeys.health();
    const cachedHealth = await redis.get(cacheKey);

    if (cachedHealth) {
      const health = JSON.parse(cachedHealth);
      res.status(200).json(health);
      return;
    }

    const dbHealth = isDatabaseConnected();

    const health: IHealthResponse = {
      status: HealthStatus.OK,
      db: dbHealth ? DBHealthStatus.CONNECTED : DBHealthStatus.DISCONNECTED,
    };

    await redis.setex(cacheKey, CacheTTL.HEALTH, JSON.stringify(health));

    res.status(200).json(health);
  } catch (error) {
    console.error("Health check error:", error);
    const dbHealth = isDatabaseConnected();
    const health: IHealthResponse = {
      status: HealthStatus.OK,
      db: dbHealth ? DBHealthStatus.CONNECTED : DBHealthStatus.DISCONNECTED,
    };
    res.status(200).json(health);
  }
};
