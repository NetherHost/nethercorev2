"use client";

import React, { useState } from "react";
import Button from "../Button";
import Input from "../ui/Input";
import Toggle from "../ui/Toggle";
import Textarea from "../ui/Textarea";

interface StaffMember {
  userId: string;
  addedBy: string;
  addedAt: Date;
  lastActive?: Date;
  isActive: boolean;
  notes?: string;
}

interface StaffSettingsProps {
  settings?: {
    guildId: string;
    staffMembers: StaffMember[];
    collectTicketMessages: boolean;
    collectTicketCloses: boolean;
    staffChannelId?: string;
  };
  onSave?: (settings: any) => void;
}

export default function StaffSettings({
  settings,
  onSave,
}: StaffSettingsProps) {
  const [staffSettings, setStaffSettings] = useState({
    guildId: settings?.guildId ?? "",
    staffMembers: settings?.staffMembers ?? [],
    collectTicketMessages: settings?.collectTicketMessages ?? false,
    collectTicketCloses: settings?.collectTicketCloses ?? false,
    staffChannelId: settings?.staffChannelId ?? "",
  });

  const handleSave = () => {
    onSave?.(staffSettings);
  };

  const toggleStaffActive = (index: number) => {
    setStaffSettings((prev) => ({
      ...prev,
      staffMembers: prev.staffMembers.map((member, i) =>
        i === index
          ? { ...member, isActive: !member.isActive, lastActive: new Date() }
          : member
      ),
    }));
  };

  const updateStaffNotes = (index: number, notes: string) => {
    setStaffSettings((prev) => ({
      ...prev,
      staffMembers: prev.staffMembers.map((member, i) =>
        i === index ? { ...member, notes } : member
      ),
    }));
  };

  const formatLastActive = (date?: Date) => {
    if (!date) return "Never";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-neutral-800 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
          <i className="fas fa-users text-red-500"></i>
        </div>
        <h2 className="text-xl font-semibold text-white">Staff Settings</h2>
      </div>

      <div className="space-y-6">
        <Input
          label="Staff Channel ID"
          description="Channel for staff notifications"
          value={staffSettings.staffChannelId}
          onChange={(e) =>
            setStaffSettings((prev) => ({
              ...prev,
              staffChannelId: e.target.value,
            }))
          }
          placeholder="Enter staff channel ID"
          icon={<i className="fas fa-hashtag"></i>}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle
            label="Collect Ticket Messages"
            description="Log ticket messages for staff"
            checked={staffSettings.collectTicketMessages}
            onChange={(checked) =>
              setStaffSettings((prev) => ({
                ...prev,
                collectTicketMessages: checked,
              }))
            }
          />

          <Toggle
            label="Collect Ticket Closes"
            description="Log ticket closure events"
            checked={staffSettings.collectTicketCloses}
            onChange={(checked) =>
              setStaffSettings((prev) => ({
                ...prev,
                collectTicketCloses: checked,
              }))
            }
          />
        </div>

        <div>
          <h3 className="text-white font-medium mb-4">
            Staff Members ({staffSettings.staffMembers.length})
          </h3>
          <p className="text-neutral-400 text-sm mb-4">
            Staff members are automatically added when they use staff commands
            or are assigned by administrators.
          </p>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {staffSettings.staffMembers.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                <div className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-users text-neutral-400"></i>
                </div>
                <p>No staff members added yet</p>
              </div>
            ) : (
              staffSettings.staffMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-black/50 rounded-lg p-4 border border-neutral-800"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          member.isActive
                            ? "bg-green-400/10 text-green-400"
                            : "bg-red-400/10 text-red-400"
                        }`}
                      >
                        <i
                          className={`fas ${
                            member.isActive ? "fa-user-check" : "fa-user-times"
                          } text-sm`}
                        ></i>
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          User: {member.userId}
                        </div>
                        <div className="text-neutral-400 text-sm">
                          Added by: {member.addedBy} •{" "}
                          {new Date(member.addedAt).toLocaleDateString()}
                        </div>
                        <div className="text-neutral-400 text-sm">
                          Last active: {formatLastActive(member.lastActive)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStaffActive(index)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          member.isActive
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        {member.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>

                  <Textarea
                    label="Notes"
                    value={member.notes || ""}
                    onChange={(e) => updateStaffNotes(index, e.target.value)}
                    rows={2}
                    placeholder="Add notes about this staff member"
                    icon={<i className="fas fa-sticky-note"></i>}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} variant="primary">
            <i className="fas fa-save"></i>
            Save Staff Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
