import mongoose, { Schema, Document } from "mongoose";
import { ModerationAction, IModerationAction } from "../types/moderation";

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

const ModerationSettingsSchema = new Schema<IModerationAction>(
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
  {
    timestamps: true,
  }
);

export default mongoose.model<IModerationAction>(
  "ModerationSettings",
  ModerationSettingsSchema
);
