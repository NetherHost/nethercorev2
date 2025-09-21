import { Request, Response } from "express";
import { AuthService } from "./service";
import { IUser } from "@nethercore/database";
import "../../../types/session.d";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const initiateAuth = (req: Request, res: Response) => {
  const authUrl = AuthService.generateAuthUrl();
  res.redirect(authUrl);
};

export const handleCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        message: "Authorization code is required",
      });
    }

    const tokens = await AuthService.exchangeCodeForTokens(code);
    if (!tokens) {
      return res.status(400).json({
        success: false,
        message: "Failed to exchange code for tokens",
      });
    }

    const discordUser = await AuthService.getDiscordUser(tokens.access_token);
    if (!discordUser) {
      return res.status(400).json({
        success: false,
        message: "Failed to fetch Discord user information",
      });
    }

    const user = await AuthService.findOrCreateUser(discordUser, tokens);
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Failed to create or update user",
      });
    }

    req.session.userId = user._id;
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to save session",
        });
      }

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      res.redirect(
        `${frontendUrl}/?auth=success&user=${encodeURIComponent(
          user.discord_username
        )}`
      );
    });
  } catch (error) {
    console.error("Callback error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await AuthService.getUserById(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const safeUser = {
      id: user._id,
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
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const checkAuthStatus = (req: Request, res: Response) => {
  const isAuthenticated = !!req.session.userId;

  res.json({
    authenticated: isAuthenticated,
    user: isAuthenticated
      ? {
          id: req.user?._id,
          discord_username: req.user?.discord_username,
          role: req.user?.role,
        }
      : null,
  });
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to logout",
      });
    }

    res.clearCookie("connect.sid");
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  });
};

export const checkTokenStatus = async (req: Request, res: Response) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await AuthService.getUserById(req.session.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const isExpired = AuthService.isTokenExpired(user.discord_token_expires_at);
    const needsRefresh = AuthService.isTokenExpiringSoon(
      user.discord_token_expires_at,
      1
    );
    const needsSoonRefresh = AuthService.isTokenExpiringSoon(
      user.discord_token_expires_at,
      24
    );

    const tokenExpiry = new Date(user.discord_token_expires_at);
    const now = new Date();
    const timeUntilExpiry = tokenExpiry.getTime() - now.getTime();

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
    console.error("Check token status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const refreshTokens = async (req: Request, res: Response) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await AuthService.getUserById(req.session.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (!AuthService.isTokenExpiringSoon(user.discord_token_expires_at, 24)) {
      return res.json({
        success: true,
        message: "Token is still valid",
        expires_at: user.discord_token_expires_at,
        needs_refresh: false,
      });
    }

    const tokenData = await AuthService.refreshTokens(
      user.discord_refresh_token
    );
    if (!tokenData) {
      return res.status(400).json({
        success: false,
        message: "Failed to refresh token. User may need to re-authenticate.",
        needs_reauth: true,
      });
    }

    const updatedUser = await AuthService.updateUserTokens(user._id, tokenData);
    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to update tokens in database",
      });
    }

    req.user = updatedUser;

    res.json({
      success: true,
      message: "Tokens refreshed successfully",
      expires_at: updatedUser.discord_token_expires_at,
      needs_refresh: false,
    });
  } catch (error) {
    console.error("Refresh tokens error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
