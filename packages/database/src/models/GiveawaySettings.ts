import mongoose, { Schema } from "mongoose";
import { IGiveawaySettings } from "../types/giveaway";

const GiveawaySettingsSchema = new Schema<IGiveawaySettings>(
  {
    _id: {
      type: String,
      default: "giveaway-settings",
    },
    enabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    logChannelId: {
      type: String,
      required: false,
      default: "",
    },
    defaultDuration: {
      type: Number,
      required: true,
      default: 7 * 24 * 60 * 60 * 1000, // 7 days
      min: 60000, // minimum 1min
    },
    maxWinners: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    requiredRoleIds: [
      {
        type: String,
        required: false,
      },
    ],
    bannedUserIds: [
      {
        type: String,
        required: false,
      },
    ],
    totalGiveaways: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const GiveawaySettings = mongoose.model<IGiveawaySettings>(
  "GiveawaySettings",
  GiveawaySettingsSchema
);
