import { Request, Response, NextFunction } from "express";
import { IUser } from "@nethercore/database";
import { getDatabase } from "../app";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

const refreshDiscordToken = async (
  refreshToken: string
): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
} | null> => {
  try {
    const axios = (await import("axios")).default;
    const response = await axios.post(
      "https://discord.com/api/oauth2/token",
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
    console.error("Error refreshing Discord token:", error);
    return null;
  }
};

export const autoRefreshTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    return next();
  }

  try {
    const user = req.user as IUser;
    const tokenExpiry = new Date(user.discord_token_expires_at);
    const now = new Date();
    const timeUntilExpiry = tokenExpiry.getTime() - now.getTime();
    const oneHour = 60 * 60 * 1000;

    if (timeUntilExpiry <= oneHour) {
      const tokenData = await refreshDiscordToken(user.discord_refresh_token);

      if (tokenData) {
        const db = getDatabase();
        const supabase = db.getClient();

        const newExpiresAt = new Date(
          Date.now() + tokenData.expires_in * 1000
        ).toISOString();

        const { data: updatedUser, error: updateError } = await supabase
          .from("users")
          .update({
            discord_access_token: tokenData.access_token,
            discord_refresh_token: tokenData.refresh_token,
            discord_token_expires_at: newExpiresAt,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)
          .select()
          .single();

        if (!updateError && updatedUser) {
          req.login(updatedUser, (err) => {
            if (err) {
              console.error("Error updating session after token refresh:", err);
            }
            next();
          });
          return;
        }
      }
    }

    next();
  } catch (error) {
    console.error("Error in autoRefreshTokens middleware:", error);
    next();
  }
};

export const ensureValidTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const user = req.user as IUser;
    const tokenExpiry = new Date(user.discord_token_expires_at);
    const now = new Date();
    const timeUntilExpiry = tokenExpiry.getTime() - now.getTime();
    const oneHour = 60 * 60 * 1000;

    if (timeUntilExpiry <= oneHour) {
      const tokenData = await refreshDiscordToken(user.discord_refresh_token);

      if (!tokenData) {
        return res.status(401).json({
          success: false,
          message:
            "Discord token expired and could not be refreshed. Please re-authenticate.",
          needs_reauth: true,
        });
      }

      const db = getDatabase();
      const supabase = db.getClient();

      const newExpiresAt = new Date(
        Date.now() + tokenData.expires_in * 1000
      ).toISOString();

      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({
          discord_access_token: tokenData.access_token,
          discord_refresh_token: tokenData.refresh_token,
          discord_token_expires_at: newExpiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (updateError || !updatedUser) {
        return res.status(500).json({
          success: false,
          message: "Failed to update tokens in database",
        });
      }

      req.login(updatedUser, (err) => {
        if (err) {
          console.error("Error updating session after token refresh:", err);
          return res.status(500).json({
            success: false,
            message: "Failed to update session",
          });
        }
        next();
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Error in ensureValidTokens middleware:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
