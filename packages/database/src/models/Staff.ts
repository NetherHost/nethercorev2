import mongoose, { Schema, Document } from "mongoose";
import { IStaff, IStaffMember } from "../types/staff";

const StaffMemberSchema = new Schema<IStaffMember>(
  {
    userId: { type: String, required: true },
    addedBy: { type: String, required: true },
    addedAt: { type: Date, required: true },
    lastActive: { type: Date, required: false },
    isActive: { type: Boolean, required: true, default: true },
    notes: { type: String, required: false },
  },
  { _id: false }
);

const StaffSchema = new Schema<IStaff>(
  {
    guildId: { type: String, required: true, unique: true },
    staffMembers: {
      type: [StaffMemberSchema],
      required: true,
      default: [],
    },
    collectTicketMessages: { type: Boolean, required: true, default: true },
    collectTicketCloses: { type: Boolean, required: true, default: true },
    staffChannelId: { type: String, required: false },
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

export default mongoose.model<IStaff>("Staff", StaffSchema);
