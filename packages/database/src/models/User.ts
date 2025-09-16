import { model, Schema } from "mongoose";
import { IUser, UserRole } from "../types/user";

const userSchema = new Schema<IUser>({
  discordId: { type: String, required: true, unique: true },
  discordUsername: { type: String, required: true },
  discordAvatar: { type: String, required: true },
  discordAccessToken: { type: String, required: true },
  discordRefreshToken: { type: String, required: true },
  discordTokenExpiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  role: { type: String, enum: UserRole, default: UserRole.USER },
});

const User = model<IUser>("User", userSchema);

export default User;
