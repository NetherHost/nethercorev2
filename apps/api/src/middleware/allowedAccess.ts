import { Request, Response, NextFunction } from "express";
import { getAllowedIds } from "../utils/getAllowedIds";

// function to check discord ids
// user makes auth request > discord returns user info > compare discord id with allowed ids in .env
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
