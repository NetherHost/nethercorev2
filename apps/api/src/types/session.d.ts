import { IUser } from "@nethercore/database";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    user?: IUser;
  }
}
