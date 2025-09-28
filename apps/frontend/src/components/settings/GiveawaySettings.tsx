"use client";

import React, { useState } from "react";
import Button from "../Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Toggle from "../ui/Toggle";
import Slider from "../ui/Slider";
import TagInput from "../ui/TagInput";
import StatCard from "../ui/StatCard";

interface BannedUser {
  userId: string;
  moderatorId: string;
  reason?: string;
  bannedAt: Date;
}

interface GiveawaySettingsProps {
  settings?: {
    guildId: string;
    access: "EVERYONE" | "CLIENTS_ONLY" | "CLOSED";
    giveawayLimit: number;
    totalGiveaways?: number;
    autoClose: {
      enabled: boolean;
      interval?: number;
    };
    claims: {
      enabled: boolean;
      autoClaimOnMessage: boolean;
      onlyOneClaimer: boolean;
    };
    stats: {
      totalGiveawaysCompleted: number;
      averageParticipants: number;
      responseTimeLastUpdated?: Date;
      totalGiveawaysWithWinners: number;
    };
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
    access: settings?.access ?? "EVERYONE",
    giveawayLimit: settings?.giveawayLimit ?? 1,
    totalGiveaways: settings?.totalGiveaways ?? 0,
    autoClose: {
      enabled: settings?.autoClose?.enabled ?? false,
      interval: settings?.autoClose?.interval ?? 86400000,
    },
    claims: {
      enabled: settings?.claims?.enabled ?? false,
      autoClaimOnMessage: settings?.claims?.autoClaimOnMessage ?? false,
      onlyOneClaimer: settings?.claims?.onlyOneClaimer ?? false,
    },
    stats: {
      totalGiveawaysCompleted: settings?.stats?.totalGiveawaysCompleted ?? 0,
      averageParticipants: settings?.stats?.averageParticipants ?? 0,
      responseTimeLastUpdated: settings?.stats?.responseTimeLastUpdated,
      totalGiveawaysWithWinners:
        settings?.stats?.totalGiveawaysWithWinners ?? 0,
    },
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

  const formatResponseTime = (ms: number) => {
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    if (ms < 3600000) return `${Math.round(ms / 60000)}m`;
    return `${Math.round(ms / 3600000)}h`;
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
        <Select
          label="Access Level"
          description="Who can create giveaways"
          value={giveawaySettings.access}
          onChange={(e) =>
            setGiveawaySettings((prev) => ({
              ...prev,
              access: e.target.value as any,
            }))
          }
          options={[
            { value: "EVERYONE", label: "Everyone" },
            { value: "CLIENTS_ONLY", label: "Clients Only" },
            { value: "CLOSED", label: "Closed" },
          ]}
          icon={<i className="fas fa-users"></i>}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Giveaway Limit per User"
            description="Maximum giveaways per user"
            variant="number"
            min="1"
            value={giveawaySettings.giveawayLimit}
            onChange={(e) =>
              setGiveawaySettings((prev) => ({
                ...prev,
                giveawayLimit: parseInt(e.target.value) || 1,
              }))
            }
            icon={<i className="fas fa-user"></i>}
          />

          <div className="space-y-2">
            <label className="block text-white font-medium text-sm">
              Total Giveaways
            </label>
            <div className="w-full bg-black/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-white">
              <div className="flex items-center gap-2">
                <i className="fas fa-gift text-neutral-400"></i>
                <span>{giveawaySettings.totalGiveaways}</span>
              </div>
            </div>
            <p className="text-neutral-400 text-xs">
              Automatically tracked by the bot
            </p>
          </div>
        </div>

        <div className="bg-black/50 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-white font-medium mb-4">Auto Close Settings</h3>
          <div className="space-y-4">
            <Toggle
              label="Enable Auto Close"
              description="Automatically close inactive giveaways"
              checked={giveawaySettings.autoClose.enabled}
              onChange={(checked) =>
                setGiveawaySettings((prev) => ({
                  ...prev,
                  autoClose: {
                    ...prev.autoClose,
                    enabled: checked,
                  },
                }))
              }
            />

            {giveawaySettings.autoClose.enabled && (
              <Slider
                label="Auto Close Interval"
                description="Time before auto-closing inactive giveaways"
                value={giveawaySettings.autoClose.interval}
                onChange={(value) =>
                  setGiveawaySettings((prev) => ({
                    ...prev,
                    autoClose: {
                      ...prev.autoClose,
                      interval: value,
                    },
                  }))
                }
                min={3600000}
                max={604800000}
                step={3600000}
                formatValue={formatDuration}
              />
            )}
          </div>
        </div>

        <div className="bg-black/50 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-white font-medium mb-4">Claim Settings</h3>
          <div className="space-y-4">
            <Toggle
              label="Enable Claims"
              description="Allow staff to claim giveaways"
              checked={giveawaySettings.claims.enabled}
              onChange={(checked) =>
                setGiveawaySettings((prev) => ({
                  ...prev,
                  claims: { ...prev.claims, enabled: checked },
                }))
              }
            />

            {giveawaySettings.claims.enabled && (
              <div className="space-y-3">
                <Toggle
                  label="Auto Claim on Message"
                  description="Automatically claim when staff responds"
                  checked={giveawaySettings.claims.autoClaimOnMessage}
                  onChange={(checked) =>
                    setGiveawaySettings((prev) => ({
                      ...prev,
                      claims: {
                        ...prev.claims,
                        autoClaimOnMessage: checked,
                      },
                    }))
                  }
                />

                <Toggle
                  label="Only One Claimer"
                  description="Prevent multiple staff from claiming"
                  checked={giveawaySettings.claims.onlyOneClaimer}
                  onChange={(checked) =>
                    setGiveawaySettings((prev) => ({
                      ...prev,
                      claims: {
                        ...prev.claims,
                        onlyOneClaimer: checked,
                      },
                    }))
                  }
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Giveaways Completed"
            value={giveawaySettings.stats.totalGiveawaysCompleted}
            icon={<i className="fas fa-check-circle"></i>}
            color="green"
          />
          <StatCard
            title="Avg Participants"
            value={giveawaySettings.stats.averageParticipants}
            icon={<i className="fas fa-users"></i>}
            color="blue"
          />
          <StatCard
            title="With Winners"
            value={giveawaySettings.stats.totalGiveawaysWithWinners}
            icon={<i className="fas fa-trophy"></i>}
            color="purple"
          />
        </div>

        <div className="bg-black/50 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-white font-medium mb-4">Default Settings</h3>
          <div className="space-y-4">
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
          </div>
        </div>

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
