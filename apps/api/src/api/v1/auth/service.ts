import axios from "axios";
import redis from "../../../utils/redis";
import { CacheKeys, CacheTTL } from "../../../utils/cacheKeys";
import {
  IUser,
  IUserInput,
  UserRole,
  User,
  IUserDocument,
} from "@nethercore/database";

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
  verified?: boolean;
}

export interface DiscordTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export class AuthService {
  private static readonly DISCORD_API_BASE = "https://discord.com/api/v10";
  private static readonly DISCORD_OAUTH_BASE = "https://discord.com/api/oauth2";

  private static mapUserDocument(user: IUserDocument): IUser {
    return {
      _id: user._id.toString(),
      discord_id: user.discord_id,
      discord_username: user.discord_username,
      discord_avatar: user.discord_avatar,
      discord_access_token: user.discord_access_token,
      discord_refresh_token: user.discord_refresh_token,
      discord_token_expires_at: user.discord_token_expires_at,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  static generateAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      redirect_uri: process.env.DISCORD_CALLBACK_URL!,
      response_type: "code",
      scope: "identify email guilds",
    });

    return `${this.DISCORD_OAUTH_BASE}/authorize?${params.toString()}`;
  }

  static async exchangeCodeForTokens(
    code: string
  ): Promise<DiscordTokenResponse | null> {
    try {
      const response = await axios.post(
        `${this.DISCORD_OAUTH_BASE}/token`,
        new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID!,
          client_secret: process.env.DISCORD_CLIENT_SECRET!,
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.DISCORD_CALLBACK_URL!,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error exchanging code for tokens:", error);
      if (error.response) {
        console.error("Discord API response:", error.response.data);
        console.error("Status:", error.response.status);
      }
      return null;
    }
  }

  static async refreshTokens(
    refreshToken: string
  ): Promise<DiscordTokenResponse | null> {
    try {
      const response = await axios.post(
        `${this.DISCORD_OAUTH_BASE}/token`,
        new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID!,
          client_secret: process.env.DISCORD_CLIENT_SECRET!,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error refreshing tokens:", error);
      return null;
    }
  }

  static async getDiscordUser(
    accessToken: string
  ): Promise<DiscordUser | null> {
    try {
      const tokenHash = accessToken.substring(0, 10);
      const cacheKey = CacheKeys.discordUser(tokenHash);

      const cachedUser = await redis.get(cacheKey);
      if (cachedUser) {
        return JSON.parse(cachedUser);
      }

      const response = await axios.get(`${this.DISCORD_API_BASE}/users/@me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userData = response.data;

      await redis.setex(
        cacheKey,
        CacheTTL.DISCORD_USER,
        JSON.stringify(userData)
      );

      return userData;
    } catch (error: any) {
      console.error("Error fetching Discord user:", error);
      return null;
    }
  }

  static async findOrCreateUser(
    discordUser: DiscordUser,
    tokens: DiscordTokenResponse
  ): Promise<IUser | null> {
    try {
      const tokenExpiresAt = new Date(
        Date.now() + tokens.expires_in * 1000
      ).toISOString();

      const avatarUrl = discordUser.avatar
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${
            parseInt(discordUser.discriminator) % 5
          }.png`;

      const existingUser = await User.findOne({ discord_id: discordUser.id });

      if (existingUser) {
        const updatedUser = await User.findByIdAndUpdate(
          existingUser._id,
          {
            discord_username: discordUser.username,
            discord_avatar: avatarUrl,
            discord_access_token: tokens.access_token,
            discord_refresh_token: tokens.refresh_token,
            discord_token_expires_at: tokenExpiresAt,
            updated_at: new Date(),
          },
          { new: true, runValidators: true }
        );

        if (!updatedUser) {
          console.error("Error updating user");
          return null;
        }

        const cacheKey = CacheKeys.user(updatedUser._id.toString());
        await redis.del(cacheKey);

        return this.mapUserDocument(updatedUser);
      } else {
        const newUser = new User({
          discord_id: discordUser.id,
          discord_username: discordUser.username,
          discord_avatar: avatarUrl,
          discord_access_token: tokens.access_token,
          discord_refresh_token: tokens.refresh_token,
          discord_token_expires_at: tokenExpiresAt,
          role: UserRole.USER,
        });

        const savedUser = await newUser.save();

        if (!savedUser) {
          console.error("Error creating user");
          return null;
        }

        const cacheKey = CacheKeys.user(savedUser._id.toString());
        await redis.del(cacheKey);

        return this.mapUserDocument(savedUser);
      }
    } catch (error: any) {
      console.error("Error in findOrCreateUser:", error);
      return null;
    }
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(userId);

      if (!user) {
        console.error("User not found");
        return null;
      }

      return this.mapUserDocument(user);
    } catch (error) {
      console.error("Error in getUserById:", error);
      return null;
    }
  }

  static async updateUserTokens(
    userId: string,
    tokens: DiscordTokenResponse
  ): Promise<IUser | null> {
    try {
      const tokenExpiresAt = new Date(
        Date.now() + tokens.expires_in * 1000
      ).toISOString();

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          discord_access_token: tokens.access_token,
          discord_refresh_token: tokens.refresh_token,
          discord_token_expires_at: tokenExpiresAt,
          updated_at: new Date(),
        },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        console.error("Error updating user tokens");
        return null;
      }

      const cacheKey = CacheKeys.user(updatedUser._id.toString());
      await redis.del(cacheKey);

      return this.mapUserDocument(updatedUser);
    } catch (error) {
      console.error("Error in updateUserTokens:", error);
      return null;
    }
  }

  static isTokenExpired(expiresAt: string): boolean {
    const expiry = new Date(expiresAt);
    const now = new Date();
    return expiry.getTime() <= now.getTime();
  }

  static isTokenExpiringSoon(
    expiresAt: string,
    hoursThreshold: number = 1
  ): boolean {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const timeUntilExpiry = expiry.getTime() - now.getTime();
    const thresholdMs = hoursThreshold * 60 * 60 * 1000;
    return timeUntilExpiry <= thresholdMs;
  }
}
