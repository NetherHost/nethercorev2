import mongoose, { Schema, Document } from "mongoose";
import { IUser, IUserInput, UserRole } from "../types/user";

export interface IUserDocument extends Omit<IUser, "_id">, Document {
  _id: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUserDocument>(
  {
    discord_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    discord_username: {
      type: String,
      required: true,
    },
    discord_avatar: {
      type: String,
      required: false,
    },
    discord_access_token: {
      type: String,
      required: true,
    },
    discord_refresh_token: {
      type: String,
      required: true,
    },
    discord_token_expires_at: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

UserSchema.index({ role: 1 });
UserSchema.index({ created_at: -1 });

export const User = mongoose.model<IUserDocument>("User", UserSchema);
