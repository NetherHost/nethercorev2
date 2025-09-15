import Redis from "ioredis";
import { logger } from "../index";

const redis = new Redis();

export default redis;
