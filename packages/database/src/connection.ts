import mongoose from "mongoose";
import { createLogger } from "@nethercore/logger";

export interface DatabaseConfig {
  uri: string;
  options?: mongoose.ConnectOptions;
}

export class Database {
  private logger = createLogger({
    prefix: "DATABASE",
    brand: true,
    forceColor: true,
  });

  private config: DatabaseConfig;
  private isConnectedFlag: boolean = false;

  constructor(config: DatabaseConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    if (this.isConnectedFlag) {
      this.logger.warn("Database already connected");
      return;
    }

    try {
      const defaultOptions: mongoose.ConnectOptions = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        ...this.config.options,
      };

      await mongoose.connect(this.config.uri, defaultOptions);

      this.isConnectedFlag = true;
      this.logger.success("Connected to MongoDB database");

      mongoose.connection.on("error", (error: Error) => {
        this.logger.error(`MongoDB connection error: ${error.message}`);
      });

      mongoose.connection.on("disconnected", () => {
        this.logger.warn("MongoDB disconnected");
        this.isConnectedFlag = false;
      });

      mongoose.connection.on("reconnected", () => {
        this.logger.info("MongoDB reconnected");
        this.isConnectedFlag = true;
      });
    } catch (error) {
      this.logger.error(
        `Failed to connect to MongoDB: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.isConnectedFlag) {
        await mongoose.disconnect();
        this.isConnectedFlag = false;
        this.logger.info("Disconnected from MongoDB database");
      }
    } catch (error) {
      this.logger.error(
        `Error during disconnect: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error;
    }
  }

  isConnected(): boolean {
    return this.isConnectedFlag && mongoose.connection.readyState === 1;
  }

  getConnectionState(): string {
    if (this.isConnected()) {
      return "connected";
    } else {
      return "disconnected";
    }
  }

  getConnection(): typeof mongoose.connection {
    return mongoose.connection;
  }

  async createIndexes(): Promise<void> {
    try {
      await import("./models/User");

      await mongoose.connection.db?.admin().command({ listCollections: 1 });
      this.logger.info("Database indexes created/verified");
    } catch (error) {
      this.logger.error(
        `Error creating indexes: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error;
    }
  }
}

export default Database;
