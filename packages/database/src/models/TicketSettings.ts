import mongoose, { Schema, Document } from "mongoose";
import {
  ITicketSettings,
  ITicketBan,
  IAutoClose,
  IClaims,
  ITicketStats,
} from "../types/ticket";

const TicketBanSchema = new Schema<ITicketBan>({
  userId: {
    type: String,
    required: true,
  },
  moderatorId: {
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

const AutoCloseSchema = new Schema<IAutoClose>({
  enabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  interval: {
    type: Number,
    required: false,
    min: 60000, // minimum 1min
  },
});

const ClaimsSchema = new Schema<IClaims>({
  enabled: {
    type: Boolean,
    required: true,
    default: true,
  },
  autoClaimOnMessage: {
    type: Boolean,
    required: true,
    default: false,
  },
  onlyOneClaimer: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const TicketStatsSchema = new Schema<ITicketStats>({
  totalTicketsResolved: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  averageResponseTime: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  responseTimeLastUpdated: {
    type: Date,
    required: false,
  },
  totalTicketsWithResponse: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
});

const TicketSettingsSchema = new Schema<ITicketSettings & Document>(
  {
    guildId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    access: {
      type: String,
      required: true,
      enum: ["EVERYONE", "CLIENTS_ONLY", "CLOSED"],
      default: "EVERYONE",
    },
    ticketLimit: {
      type: Number,
      required: true,
      default: 3,
      min: 1,
    },
    totalTickets: {
      type: Number,
      required: false,
      min: 0,
    },
    autoClose: {
      type: AutoCloseSchema,
      required: true,
      default: () => ({}),
    },
    claims: {
      type: ClaimsSchema,
      required: true,
      default: () => ({}),
    },
    stats: {
      type: TicketStatsSchema,
      required: true,
      default: () => ({}),
    },
    ticketBanList: [TicketBanSchema],
  },
  {
    timestamps: true,
  }
);

TicketSettingsSchema.index({ guildId: 1 });

export const TicketSettings = mongoose.model<ITicketSettings & Document>(
  "TicketSettings",
  TicketSettingsSchema
);
