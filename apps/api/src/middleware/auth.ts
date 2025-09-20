import { Request, Response, NextFunction } from "express";
import { IUser } from "@nethercore/database";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

// handle checks for auth
export const requireAuth = (
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
  next();
};

export const requireAdmin = (
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

  const user = req.user as IUser;
  if (user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = req.user as IUser;
    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `${role} access required`,
      });
    }

    next();
  };
};
