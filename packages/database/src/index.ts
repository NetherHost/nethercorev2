import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@nethercore/logger";

export interface DatabaseOptions {
  auth?: {
    autoRefreshToken?: boolean;
    persistSession?: boolean;
    detectSessionInUrl?: boolean;
  };
  global?: {
    headers?: Record<string, string>;
  };
  db?: {
    schema?: "public";
  };
  realtime?: {
    params?: {
      eventsPerSecond?: number;
    };
  };
}

export class Database {
  private logger = createLogger({ prefix: "DATABASE", brand: true });
  private supabaseUrl: string;
  private supabaseKey: string;
  private options: DatabaseOptions;
  private client: SupabaseClient<any, "public", "public"> | null = null;
  private isConnectedFlag: boolean = false;

  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    options: DatabaseOptions = {}
  ) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    this.options = {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
        detectSessionInUrl: false,
        ...options.auth,
      },
      global: {
        headers: {
          "X-Client-Info": "nethercore-database",
          ...options.global?.headers,
        },
        ...options.global,
      },
      ...options,
    };
  }

  async connect(): Promise<void> {
    if (this.isConnectedFlag && this.client) {
      this.logger.warn("Database already connected");
      return;
    }

    try {
      this.logger.info(`Connecting to Supabase: ${this.supabaseUrl}`);

      this.client = createClient<any, "public", "public">(
        this.supabaseUrl,
        this.supabaseKey,
        this.options
      );

      this.isConnectedFlag = true;
      this.logger.success(`Connected to Supabase: ${this.supabaseUrl}`);
    } catch (error) {
      this.logger.error(
        `Failed to connect to Supabase: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        this.client = null;
        this.isConnectedFlag = false;
        this.logger.info("Disconnected from Supabase");
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
    return this.isConnectedFlag && this.client !== null;
  }

  getConnectionState(): string {
    if (this.isConnected()) {
      return "connected";
    } else if (this.client === null) {
      return "disconnected";
    } else {
      return "connecting";
    }
  }

  getClient(): SupabaseClient<any, "public", "public"> {
    if (!this.client) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.client;
  }
}

export default Database;
