import mongoose, { Schema, Document } from "mongoose";
import { IDiscordUser } from "../types/discord_user";

const TimestampsSchema = new Schema(
  {
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    joinedAt: { type: Date, required: true },
    leftAt: { type: Date, required: false },
    lastActiveAt: { type: Date, required: true },
  },
  { _id: false }
);

const DiscordUserSchema = new Schema<IDiscordUser>(
  {
    userId: { type: String, required: true, unique: true },
    isStaff: { type: Boolean, required: true, default: false },
    timestamps: {
      type: TimestampsSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const DiscordUser = mongoose.model<IDiscordUser>(
  "DiscordUser",
  DiscordUserSchema
);
