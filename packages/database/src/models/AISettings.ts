import mongoose, { Schema, Document } from "mongoose";
import {
  GeneralModels,
  ReasoningModels,
  CanaryModels,
  AIProvider,
  IAIConfig,
  IAIBan,
  IRateLimitConfig,
} from "../types/ai";

const RateLimitConfigSchema = new Schema<IRateLimitConfig>(
  {
    userId: { type: String, required: true },
    requestsPerUser: { type: Number, required: true },
    threshold: { type: Number, required: true },
  },
  { _id: false }
);

const AIBanSchema = new Schema<IAIBan>(
  {
    userId: { type: String, required: true },
    moderator: { type: String, required: true },
    reason: { type: String, required: false },
    bannedAt: { type: Date, required: true },
  },
  { _id: false }
);

const AISettingsSchema = new Schema<IAIConfig>(
  {
    _id: {
      type: String,
      default: "ai-settings",
    },
    enabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    provider: {
      type: String,
      required: true,
      enum: Object.values(AIProvider),
    },
    apiKey: {
      type: String,
      required: false,
    },
    model: {
      type: String,
      required: true,
      enum: [
        ...Object.values(GeneralModels),
        ...Object.values(ReasoningModels),
        ...Object.values(CanaryModels),
      ],
    },
    maxTokens: {
      type: Number,
      required: true,
      default: 1000,
      min: 1,
    },
    temperature: {
      type: Number,
      required: true,
      default: 0.5,
    },
    topP: {
      type: Number,
      required: false,
      default: 1,
    },
    presencePenalty: {
      type: Number,
      required: false,
      default: 0,
    },
    frequencyPenalty: {
      type: Number,
      required: false,
      default: 0,
    },
    systemPrompt: {
      type: String,
      required: false,
    },
    maxResponseLength: {
      type: Number,
      required: false,
      default: 1000,
    },
    allowedChannelIds: {
      type: [String],
      required: true,
    },
    allowedRoleIds: {
      type: [String],
      required: true,
    },
    rateLimits: {
      type: [RateLimitConfigSchema],
      required: false,
    },
    bannedUsers: {
      type: [AIBanSchema],
      required: false,
    },
    createdAt: {
      type: Date,
      required: false,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      required: false,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const AISettings = mongoose.model<IAIConfig>(
  "AISettings",
  AISettingsSchema
);
