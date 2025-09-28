import mongoose, { Schema } from "mongoose";
import {
  ModerationAction,
  IModerationAction,
  IModerationSettings,
} from "../types/moderation";

const ModerationActionSchema = new Schema<IModerationAction>(
  {
    userId: { type: String, required: true },
    moderator: { type: String, required: true },
    action: {
      type: String,
      required: true,
      enum: Object.values(ModerationAction),
    },
    reason: { type: String, required: false },
    actionAt: { type: Date, required: true },
  },
  { _id: false }
);

const ModerationSettingsSchema = new Schema<IModerationSettings>(
  {
    _id: {
      type: String,
      default: "moderation-settings",
    },
    enabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    autoModeration: {
      type: Boolean,
      required: true,
      default: false,
    },
    logChannelId: {
      type: String,
      required: false,
      default: "",
    },
    muteRoleId: {
      type: String,
      required: false,
      default: "",
    },
    warnThreshold: {
      type: Number,
      required: true,
      default: 3,
    },
    banThreshold: {
      type: Number,
      required: true,
      default: 5,
    },
    actions: [ModerationActionSchema],
  },
  {
    timestamps: true,
  }
);

export const ModerationSettings = mongoose.model<IModerationSettings>(
  "ModerationSettings",
  ModerationSettingsSchema
);
