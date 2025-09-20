import { createLogger, LogLevel } from "@nethercore/logger";

import app from "./app";

const port: number = parseInt(process.env.PORT || "3001");

export const logger = createLogger({
  prefix: "API",
  brand: true,
  level: LogLevel.INFO,
  forceColor: true,
});

// start server
app.listen(port, () => {
  logger.info(`Environment: ${process.env.NODE_ENV}`);
  logger.success(`Server running at http://localhost:${port}`).box();
});
