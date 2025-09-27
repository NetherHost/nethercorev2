import mongoose, { Schema, Document } from "mongoose";
import { IGiveawaySettings, IBannedUser } from "../types/giveaway";

const BannedUserSchema = new Schema<IBannedUser>({
  userId: {
    type: String,
    required: true,
  },
  moderator: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: false,
  },
  bannedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const GiveawaySettingsSchema = new Schema<IGiveawaySettings & Document>(
  {
    guildId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    totalGiveaways: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    access: {
      type: String,
      required: true,
      enum: ["ENABLED", "DISABLED"],
      default: "ENABLED",
    },
    defaultDuration: {
      type: Number,
      required: true,
      default: 86400000, // 24h in ms
      min: 60000, // minimum 1min
    },
    defaultWinnerCount: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    autoReroll: {
      type: Boolean,
      required: true,
      default: false,
    },
    requiredRoleIds: [
      {
        type: String,
        required: false,
      },
    ],
    allowedRoleIds: [
      {
        type: String,
        required: false,
      },
    ],
    bannedUsers: [BannedUserSchema],
  },
  {
    timestamps: true,
  }
);

GiveawaySettingsSchema.index({ guildId: 1 });

export const GiveawaySettings = mongoose.model<IGiveawaySettings & Document>(
  "GiveawaySettings",
  GiveawaySettingsSchema
);
