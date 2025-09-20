import Redis from "ioredis";
import { logger } from "../index";

// redis instance
const redis = new Redis();

export default redis;
