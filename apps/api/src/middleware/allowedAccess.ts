import { Request, Response, NextFunction } from "express";
import { getAllowedIds } from "../utils/getAllowedIds";

// To allow access, you must include an 'Authorization' header in your request.
// Example:
//   Authorization: <your-allowed-id>
// The value of the 'Authorization' header must match one of the allowed IDs returned by getAllowedIds().

export const allowedAccess = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowedIds = getAllowedIds();
  // Check if the 'Authorization' header is present and matches an allowed ID
  if (!allowedIds.includes(req.headers.authorization || "")) {
    return res
      .status(401)
      .json({ message: "You're not allowed to access this application" });
  } else {
    next();
  }
};
