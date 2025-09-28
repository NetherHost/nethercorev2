import mongoose, { Schema } from "mongoose";
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
    _id: {
      type: String,
      default: "staff-settings",
    },
    members: {
      type: [StaffMemberSchema],
      required: true,
      default: [],
    },
    roles: [
      {
        type: String,
        required: false,
      },
    ],
    permissions: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Staff = mongoose.model<IStaff>("Staff", StaffSchema);
