import mongoose, { Schema } from "mongoose";
import { ITicketSettings } from "../types/ticket";

const TicketSettingsSchema = new Schema<ITicketSettings>(
  {
    _id: {
      type: String,
      default: "ticket-settings",
    },
    enabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    categoryId: {
      type: String,
      required: false,
      default: "",
    },
    logChannelId: {
      type: String,
      required: false,
      default: "",
    },
    supportRoleIds: [
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
    totalTickets: {
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

export const TicketSettings = mongoose.model<ITicketSettings>(
  "TicketSettings",
  TicketSettingsSchema
);
