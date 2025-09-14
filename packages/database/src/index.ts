import mongoose, { ConnectOptions } from 'mongoose';
import { createLogger } from '@nethercore/logger';

export interface DatabaseOptions extends ConnectOptions {
  maxPoolSize?: number;
  serverSelectionTimeoutMS?: number;
  socketTimeoutMS?: number;
  connectTimeoutMS?: number;
}

export class Database {
  private logger = createLogger({ prefix: 'DATABASE', brand: true });
  private uri: string;
  private options: DatabaseOptions;

  constructor(uri: string, options: DatabaseOptions = {}) {
    this.uri = uri;
    this.options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      ...options
    };
  }

  private maskUri(uri: string): string {
    return uri.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@');
  }

  async connect(): Promise<void> {
    if (mongoose.connection.readyState === 1) {
      this.logger.warn('Database already connected');
      return;
    }

    try {
      this.logger.info(`Connecting to MongoDB: ${this.maskUri(this.uri)}`);

      await mongoose.connect(this.uri, this.options);

      this.logger.success(`Connected to MongoDB: ${this.maskUri(this.uri)}`);
    } catch (error) {
      this.logger.error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
        this.logger.info('Disconnected from MongoDB');
      }
    } catch (error) {
      this.logger.error(`Error during disconnect: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  getConnectionState(): string {
    switch (mongoose.connection.readyState) {
      case 0: return 'disconnected';
      case 1: return 'connected';
      case 2: return 'connecting';
      case 3: return 'disconnecting';
      default: return 'unknown';
    }
  }
}

export default Database;
export { mongoose };