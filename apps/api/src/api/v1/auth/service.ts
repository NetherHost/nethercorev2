import axios from "axios";
import { getDatabase } from "../../../app";
import { IUser, IUserInput, UserRole } from "@nethercore/database";

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
    } catch (error) {
      console.error("Error exchanging code for tokens:", error);
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
    } catch (error) {
      console.error("Error refreshing tokens:", error);
      return null;
    }
  }

  static async getDiscordUser(
    accessToken: string
  ): Promise<DiscordUser | null> {
    try {
      const response = await axios.get(`${this.DISCORD_API_BASE}/users/@me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching Discord user:", error);
      return null;
    }
  }

  static async findOrCreateUser(
    discordUser: DiscordUser,
    tokens: DiscordTokenResponse
  ): Promise<IUser | null> {
    try {
      const db = getDatabase();
      const supabase = db.getClient();

      const tokenExpiresAt = new Date(
        Date.now() + tokens.expires_in * 1000
      ).toISOString();

      const avatarUrl = discordUser.avatar
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${
            parseInt(discordUser.discriminator) % 5
          }.png`;

      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("discord_id", discordUser.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching user:", fetchError);
        return null;
      }

      if (existingUser) {
        const { data: updatedUser, error: updateError } = await supabase
          .from("users")
          .update({
            discord_username: discordUser.username,
            discord_avatar: avatarUrl,
            discord_access_token: tokens.access_token,
            discord_refresh_token: tokens.refresh_token,
            discord_token_expires_at: tokenExpiresAt,
            updated_at: new Date().toISOString(),
          })
          .eq("discord_id", discordUser.id)
          .select()
          .single();

        if (updateError) {
          console.error("Error updating user:", updateError);
          return null;
        }

        return updatedUser;
      } else {
        const newUserInput: IUserInput = {
          discord_id: discordUser.id,
          discord_username: discordUser.username,
          discord_avatar: avatarUrl,
          discord_access_token: tokens.access_token,
          discord_refresh_token: tokens.refresh_token,
          discord_token_expires_at: tokenExpiresAt,
          role: UserRole.USER,
        };

        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert(newUserInput)
          .select()
          .single();

        if (insertError) {
          console.error("Error creating user:", insertError);
          return null;
        }

        return newUser;
      }
    } catch (error) {
      console.error("Error in findOrCreateUser:", error);
      return null;
    }
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    try {
      const db = getDatabase();
      const supabase = db.getClient();

      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user by ID:", error);
        return null;
      }

      return user;
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
      const db = getDatabase();
      const supabase = db.getClient();

      const tokenExpiresAt = new Date(
        Date.now() + tokens.expires_in * 1000
      ).toISOString();

      const { data: updatedUser, error } = await supabase
        .from("users")
        .update({
          discord_access_token: tokens.access_token,
          discord_refresh_token: tokens.refresh_token,
          discord_token_expires_at: tokenExpiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating user tokens:", error);
        return null;
      }

      return updatedUser;
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
