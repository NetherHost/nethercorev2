import { Request, Response, NextFunction } from "express";
import { getAllowedIds } from "../utils/getAllowedIds";

export const allowedAccess = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowedIds = getAllowedIds();
  if (!allowedIds.includes(req.headers.authorization || "")) {
    return res
      .status(401)
      .json({ message: "You're not allowed to access this application" });
  } else {
    next();
  }
};
