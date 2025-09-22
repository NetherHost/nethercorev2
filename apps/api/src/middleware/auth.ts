import { Request, Response, NextFunction } from "express";
import { AuthService } from "../api/v1/auth/service";
import { IUser } from "@nethercore/database";
import "../types/session";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
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

  req.user = user;
  next();
};

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
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

  if (user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  req.user = user;
  next();
};

export const requireRole = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
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

    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `${role} access required`,
      });
    }

    req.user = user;
    next();
  };
};

export const autoRefreshTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.userId) {
    return next();
  }

  try {
    const user = await AuthService.getUserById(req.session.userId);
    if (!user) {
      return next();
    }

    if (AuthService.isTokenExpiringSoon(user.discord_token_expires_at, 1)) {
      const tokenData = await AuthService.refreshTokens(
        user.discord_refresh_token
      );
      if (tokenData) {
        const updatedUser = await AuthService.updateUserTokens(
          user._id,
          tokenData
        );
        if (updatedUser) {
          req.user = updatedUser;
        }
      }
    }

    next();
  } catch (error) {
    console.error("Auto refresh tokens error:", error);
    next();
  }
};

export const ensureValidTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const user = await AuthService.getUserById(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      AuthService.isTokenExpired(user.discord_token_expires_at) ||
      AuthService.isTokenExpiringSoon(user.discord_token_expires_at, 1)
    ) {
      const tokenData = await AuthService.refreshTokens(
        user.discord_refresh_token
      );

      if (!tokenData) {
        return res.status(401).json({
          success: false,
          message:
            "Discord token expired and could not be refreshed. Please re-authenticate.",
          needs_reauth: true,
        });
      }

      const updatedUser = await AuthService.updateUserTokens(
        user._id,
        tokenData
      );
      if (!updatedUser) {
        return res.status(500).json({
          success: false,
          message: "Failed to update tokens in database",
        });
      }

      req.user = updatedUser;
    } else {
      req.user = user;
    }

    next();
  } catch (error) {
    console.error("Ensure valid tokens error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
