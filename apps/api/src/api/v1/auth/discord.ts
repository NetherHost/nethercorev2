import { Request, Response } from "express";
import passport from "passport";
import axios from "axios";
import { getDatabase } from "../../../app";
import { IUser } from "@nethercore/database";

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

export const discordAuthController = passport.authenticate("discord", {
  scope: ["identify", "email", "guilds"],
});

export const discordCallbackController = [
  passport.authenticate("discord", { failureRedirect: "/api/v1/auth/failure" }),
  (req: Request, res: Response) => {
    const user = req.user as IUser;

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    // redirect to frontend with success indicator
    res.redirect(
      `${frontendUrl}/dashboard?auth=success&user=${encodeURIComponent(
        user.discord_username
      )}`
    );
  },
];

export const getCurrentUserController = async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = req.user as IUser;

    const safeUser = {
      id: user.id,
      discord_id: user.discord_id,
      discord_username: user.discord_username,
      discord_avatar: user.discord_avatar,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    res.json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logoutController = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({
        success: false,
        message: "Error during logout",
      });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({
          success: false,
          message: "Error destroying session",
        });
      }

      res.clearCookie("connect.sid");
      res.json({
        success: true,
        message: "Logged out successfully",
      });
    });
  });
};

export const checkAuthController = (req: Request, res: Response) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.isAuthenticated()
      ? {
          id: (req.user as IUser).id,
          discord_username: (req.user as IUser).discord_username,
          role: (req.user as IUser).role,
        }
      : null,
  });
};

export const checkTokenStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = req.user as IUser;
    const tokenExpiry = new Date(user.discord_token_expires_at);
    const now = new Date();
    const timeUntilExpiry = tokenExpiry.getTime() - now.getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneHour = 60 * 60 * 1000;

    const isExpired = timeUntilExpiry <= 0;
    const needsRefresh = timeUntilExpiry <= oneHour;
    const needsSoonRefresh = timeUntilExpiry <= oneDay;

    res.json({
      success: true,
      token_status: {
        is_expired: isExpired,
        needs_refresh: needsRefresh,
        needs_soon_refresh: needsSoonRefresh,
        expires_at: user.discord_token_expires_at,
        time_until_expiry_ms: Math.max(0, timeUntilExpiry),
        time_until_expiry_hours: Math.max(
          0,
          timeUntilExpiry / (60 * 60 * 1000)
        ),
      },
    });
  } catch (error) {
    console.error("Error checking token status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const refreshTokensController = async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = req.user as IUser;
    const db = getDatabase();
    const supabase = db.getClient();

    const tokenExpiry = new Date(user.discord_token_expires_at);
    const now = new Date();
    const timeUntilExpiry = tokenExpiry.getTime() - now.getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (timeUntilExpiry > oneDay) {
      return res.json({
        success: true,
        message: "Token is still valid",
        expires_at: user.discord_token_expires_at,
        needs_refresh: false,
      });
    }

    const tokenData = await refreshDiscordToken(user.discord_refresh_token);

    if (!tokenData) {
      return res.status(400).json({
        success: false,
        message: "Failed to refresh token. User may need to re-authenticate.",
        needs_reauth: true,
      });
    }

    const newExpiresAt = new Date(
      Date.now() + tokenData.expires_in * 1000
    ).toISOString();

    const { data: updatedUser, error: updateError } = await getDatabase()
      .getClient()
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

    if (updateError) {
      console.error("Error updating user tokens:", updateError);
      return res.status(500).json({
        success: false,
        message: "Failed to update tokens in database",
      });
    }

    req.login(updatedUser, (err) => {
      if (err) {
        console.error("Error updating session:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to update session",
        });
      }

      res.json({
        success: true,
        message: "Tokens refreshed successfully",
        expires_at: newExpiresAt,
        needs_refresh: false,
      });
    });
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
