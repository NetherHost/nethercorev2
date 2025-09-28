"use client";

import React, { useState } from "react";
import Button from "../Button";
import Input from "../ui/Input";
import Toggle from "../ui/Toggle";
import Slider from "../ui/Slider";
import TagInput from "../ui/TagInput";

interface BannedUser {
  userId: string;
  moderatorId: string;
  reason?: string;
  bannedAt: Date;
}

interface GiveawaySettingsProps {
  settings?: {
    guildId: string;
    totalGiveaways: number;
    access: "ENABLED" | "DISABLED";
    defaultDuration: number;
    defaultWinnerCount: number;
    autoReroll: boolean;
    requiredRoleIds?: string[];
    allowedRoleIds?: string[];
    bannedUsers?: BannedUser[];
  };
  onSave?: (settings: any) => void;
}

export default function GiveawaySettings({
  settings,
  onSave,
}: GiveawaySettingsProps) {
  const [giveawaySettings, setGiveawaySettings] = useState({
    guildId: settings?.guildId ?? "",
    totalGiveaways: settings?.totalGiveaways ?? 0,
    access: settings?.access ?? "ENABLED",
    defaultDuration: settings?.defaultDuration ?? 86400000,
    defaultWinnerCount: settings?.defaultWinnerCount ?? 1,
    autoReroll: settings?.autoReroll ?? false,
    requiredRoleIds: settings?.requiredRoleIds ?? [],
    allowedRoleIds: settings?.allowedRoleIds ?? [],
    bannedUsers: settings?.bannedUsers ?? [],
  });

  const handleSave = () => {
    onSave?.(giveawaySettings);
  };

  const formatDuration = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-neutral-800 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
          <i className="fas fa-gift text-red-500"></i>
        </div>
        <h2 className="text-xl font-semibold text-white">Giveaway Settings</h2>
      </div>

      <div className="space-y-6">
        <Toggle
          label="Enable Giveaways"
          description="Allow giveaways in this server"
          checked={giveawaySettings.access === "ENABLED"}
          onChange={(checked) =>
            setGiveawaySettings((prev) => ({
              ...prev,
              access: checked ? "ENABLED" : "DISABLED",
            }))
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Total Giveaways"
            description="Number of giveaways created"
            variant="number"
            value={giveawaySettings.totalGiveaways}
            onChange={(e) =>
              setGiveawaySettings((prev) => ({
                ...prev,
                totalGiveaways: parseInt(e.target.value) || 0,
              }))
            }
            icon={<i className="fas fa-trophy"></i>}
          />

          <Input
            label="Default Winner Count"
            description="Default number of winners"
            variant="number"
            min="1"
            value={giveawaySettings.defaultWinnerCount}
            onChange={(e) =>
              setGiveawaySettings((prev) => ({
                ...prev,
                defaultWinnerCount: parseInt(e.target.value) || 1,
              }))
            }
            icon={<i className="fas fa-users"></i>}
          />
        </div>

        <Slider
          label="Default Duration"
          description="Default duration for new giveaways"
          value={giveawaySettings.defaultDuration}
          onChange={(value) =>
            setGiveawaySettings((prev) => ({
              ...prev,
              defaultDuration: value,
            }))
          }
          min={3600000}
          max={604800000}
          step={3600000}
          formatValue={formatDuration}
        />

        <Toggle
          label="Auto Reroll"
          description="Automatically reroll inactive winners"
          checked={giveawaySettings.autoReroll}
          onChange={(checked) =>
            setGiveawaySettings((prev) => ({
              ...prev,
              autoReroll: checked,
            }))
          }
        />

        <TagInput
          label="Required Role IDs"
          description="Roles required to participate in giveaways"
          tags={giveawaySettings.requiredRoleIds}
          onTagsChange={(tags) =>
            setGiveawaySettings((prev) => ({ ...prev, requiredRoleIds: tags }))
          }
          placeholder="Enter role ID"
        />

        <TagInput
          label="Allowed Role IDs"
          description="Roles allowed to create giveaways"
          tags={giveawaySettings.allowedRoleIds}
          onTagsChange={(tags) =>
            setGiveawaySettings((prev) => ({ ...prev, allowedRoleIds: tags }))
          }
          placeholder="Enter role ID"
        />

        <div>
          <label className="block text-white font-medium mb-2">
            Banned Users
          </label>
          <p className="text-neutral-400 text-sm mb-4">
            Users are automatically banned from giveaways when moderation
            actions are taken.
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {giveawaySettings.bannedUsers.map((user, index) => (
              <div
                key={index}
                className="bg-black/50 rounded-lg p-3 border border-neutral-800"
              >
                <div>
                  <div className="text-white text-sm">User: {user.userId}</div>
                  <div className="text-neutral-400 text-xs">
                    Banned by: {user.moderatorId} •{" "}
                    {new Date(user.bannedAt).toLocaleString()}
                  </div>
                  {user.reason && (
                    <div className="text-neutral-300 text-xs">
                      Reason: {user.reason}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} variant="primary">
            <i className="fas fa-save"></i>
            Save Giveaway Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
