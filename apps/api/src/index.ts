import "dotenv/config";
import app from "./app";
import { createLogger, LogLevel } from "@nethercore/logger";

const port: number = parseInt(process.env.PORT || "3001");

const logger = createLogger({
  prefix: "API",
  brand: true,
  level: LogLevel.INFO,
  forceColor: true,
});

app.listen(port, () => {
  logger.success(`Server running at http://localhost:${port}`).box();
});
