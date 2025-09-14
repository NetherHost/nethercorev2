import chalk from "chalk";

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LoggerOptions {
  level?: LogLevel;
  showTimestamp?: boolean;
  showLevel?: boolean;
  brand?: boolean;
  prefix?: string;
  forceColor?: boolean;
}

export class NetherLogger {
  private options: Required<LoggerOptions>;
  private originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    clear: console.clear,
    group: console.group,
    groupEnd: console.groupEnd,
    table: console.table,
  };

  constructor(options: LoggerOptions = {}) {
    this.options = {
      level: LogLevel.INFO,
      showTimestamp: true,
      showLevel: true,
      brand: true,
      prefix: "",
      forceColor: false,
      ...options,
    };

    if (this.options.forceColor) {
      process.env.FORCE_COLOR = "1";
      process.env.COLORTERM = "truecolor";
      (chalk as any).level = 3;
    }
  }

  private formatTimestamp(): string {
    const now = new Date();
    return chalk.gray(`[${now.toISOString()}]`);
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    ...args: any[]
  ): string {
    const parts: string[] = [];

    if (this.options.showTimestamp) {
      parts.push(this.formatTimestamp());
    }

    if (this.options.brand) {
      parts.push(chalk.red.bold("⚡ NETHER"));
    }

    if (this.options.prefix) {
      parts.push(chalk.cyan(`[${this.options.prefix}]`));
    }

    if (this.options.showLevel) {
      switch (level) {
        case LogLevel.DEBUG:
          parts.push(chalk.magenta("[DEBUG]"));
          break;
        case LogLevel.INFO:
          parts.push(chalk.cyan("[INFO]"));
          break;
        case LogLevel.WARN:
          parts.push(chalk.yellow("[WARN]"));
          break;
        case LogLevel.ERROR:
          parts.push(chalk.red("[ERROR]"));
          break;
        case LogLevel.FATAL:
          parts.push(chalk.bgRed.white("[FATAL]"));
          break;
      }
    }

    const formattedArgs =
      args.length > 0
        ? args
            .map((arg) =>
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : String(arg)
            )
            .join(" ")
        : "";

    return `${parts.join(" ")} ${message} ${formattedArgs}`.trim();
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.options.level;
  }

  debug(message: string, ...args: any[]): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    this.originalConsole.log(
      chalk.magenta(this.formatMessage(LogLevel.DEBUG, message, ...args))
    );
  }

  info(message: string, ...args: any[]): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    this.originalConsole.log(
      chalk.cyan(this.formatMessage(LogLevel.INFO, message, ...args))
    );
  }

  log(message: string, ...args: any[]): void {
    this.originalConsole.log(
      chalk.gray(message + (args.length ? " " + args.join(" ") : ""))
    );
  }

  warn(message: string, ...args: any[]): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    this.originalConsole.warn(
      chalk.yellow(this.formatMessage(LogLevel.WARN, message, ...args))
    );
  }

  error(message: string, ...args: any[]): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    this.originalConsole.error(
      chalk.red(this.formatMessage(LogLevel.ERROR, message, ...args))
    );
  }

  fatal(message: string, ...args: any[]): void {
    if (!this.shouldLog(LogLevel.FATAL)) return;
    this.originalConsole.error(
      chalk.bgRed.white.bold(
        this.formatMessage(LogLevel.FATAL, message, ...args)
      )
    );
  }

  success(message: string, ...args: any[]): void {
    this.originalConsole.log(
      chalk.green(this.formatMessage(LogLevel.INFO, message, ...args))
    );
  }

  clear(): void {
    this.originalConsole.clear();
    this.originalConsole.log(chalk.magenta("⚡ NETHER HOST - Console Cleared"));
  }
}

const defaultLogger = new NetherLogger();

export const logger = defaultLogger;
export default defaultLogger;

export const createLogger = (options: LoggerOptions = {}) =>
  new NetherLogger(options);

export const replaceConsole = (options: LoggerOptions = {}) => {
  const netherLogger = new NetherLogger(options);

  global.console = {
    ...global.console,
    log: netherLogger.log.bind(netherLogger),
    info: netherLogger.info.bind(netherLogger),
    warn: netherLogger.warn.bind(netherLogger),
    error: netherLogger.error.bind(netherLogger),
    debug: netherLogger.debug.bind(netherLogger),
    clear: netherLogger.clear.bind(netherLogger),
  };

  return netherLogger;
};

export const forceColors = () => {
  process.env.FORCE_COLOR = "1";
  process.env.COLORTERM = "truecolor";
  (chalk as any).level = 3; // force colors because commandkit disables them
};
