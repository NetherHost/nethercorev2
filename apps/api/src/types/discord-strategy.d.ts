declare module "discord-strategy" {
  import { Strategy } from "passport";
  import { Request } from "express";

  export interface DiscordProfile {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    email?: string;
    verified?: boolean;
    locale?: string;
    mfa_enabled?: boolean;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
  }

  export interface DiscordStrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
  }

  export interface DiscordStrategyVerifyCallback {
    (
      accessToken: string,
      refreshToken: string,
      profile: DiscordProfile,
      done: (error: any, user?: any) => void
    ): void;
  }

  export class Strategy {
    constructor(
      options: DiscordStrategyOptions,
      verify: DiscordStrategyVerifyCallback
    );

    authenticate(req: any, options?: any): any;
  }
}
