"use client";

import React, { useState } from "react";
import Button from "../Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Toggle from "../ui/Toggle";
import Slider from "../ui/Slider";
import StatCard from "../ui/StatCard";

interface BannedUser {
  userId: string;
  moderatorId: string;
  reason?: string;
  bannedAt: Date;
}

interface TicketSettingsProps {
  settings?: {
    guildId: string;
    access: "EVERYONE" | "CLIENTS_ONLY" | "CLOSED";
    ticketLimit: number;
    totalTickets?: number;
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
      totalTicketsResolved: number;
      averageResponseTime: number;
      responseTimeLastUpdated?: Date;
      totalTicketsWithResponse: number;
    };
    ticketBanList?: BannedUser[];
  };
  onSave?: (settings: any) => void;
}

export default function TicketSettings({
  settings,
  onSave,
}: TicketSettingsProps) {
  const [ticketSettings, setTicketSettings] = useState({
    guildId: settings?.guildId ?? "",
    access: settings?.access ?? "EVERYONE",
    ticketLimit: settings?.ticketLimit ?? 1,
    totalTickets: settings?.totalTickets ?? 0,
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
      totalTicketsResolved: settings?.stats?.totalTicketsResolved ?? 0,
      averageResponseTime: settings?.stats?.averageResponseTime ?? 0,
      responseTimeLastUpdated: settings?.stats?.responseTimeLastUpdated,
      totalTicketsWithResponse: settings?.stats?.totalTicketsWithResponse ?? 0,
    },
    ticketBanList: settings?.ticketBanList ?? [],
  });

  const handleSave = () => {
    onSave?.(ticketSettings);
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
          <i className="fas fa-ticket-alt text-red-500"></i>
        </div>
        <h2 className="text-xl font-semibold text-white">Ticket Settings</h2>
      </div>

      <div className="space-y-6">
        <Select
          label="Access Level"
          description="Who can create tickets"
          value={ticketSettings.access}
          onChange={(e) =>
            setTicketSettings((prev) => ({
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
            label="Ticket Limit per User"
            description="Maximum tickets per user"
            variant="number"
            min="1"
            value={ticketSettings.ticketLimit}
            onChange={(e) =>
              setTicketSettings((prev) => ({
                ...prev,
                ticketLimit: parseInt(e.target.value) || 1,
              }))
            }
            icon={<i className="fas fa-user"></i>}
          />

          <div className="space-y-2">
            <label className="block text-white font-medium text-sm">
              Total Tickets
            </label>
            <div className="w-full bg-black/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-white">
              <div className="flex items-center gap-2">
                <i className="fas fa-ticket-alt text-neutral-400"></i>
                <span>{ticketSettings.totalTickets}</span>
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
              description="Automatically close inactive tickets"
              checked={ticketSettings.autoClose.enabled}
              onChange={(checked) =>
                setTicketSettings((prev) => ({
                  ...prev,
                  autoClose: {
                    ...prev.autoClose,
                    enabled: checked,
                  },
                }))
              }
            />

            {ticketSettings.autoClose.enabled && (
              <Slider
                label="Auto Close Interval"
                description="Time before auto-closing inactive tickets"
                value={ticketSettings.autoClose.interval}
                onChange={(value) =>
                  setTicketSettings((prev) => ({
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
              description="Allow staff to claim tickets"
              checked={ticketSettings.claims.enabled}
              onChange={(checked) =>
                setTicketSettings((prev) => ({
                  ...prev,
                  claims: { ...prev.claims, enabled: checked },
                }))
              }
            />

            {ticketSettings.claims.enabled && (
              <div className="space-y-3">
                <Toggle
                  label="Auto Claim on Message"
                  description="Automatically claim when staff responds"
                  checked={ticketSettings.claims.autoClaimOnMessage}
                  onChange={(checked) =>
                    setTicketSettings((prev) => ({
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
                  checked={ticketSettings.claims.onlyOneClaimer}
                  onChange={(checked) =>
                    setTicketSettings((prev) => ({
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
            title="Tickets Resolved"
            value={ticketSettings.stats.totalTicketsResolved}
            icon={<i className="fas fa-check-circle"></i>}
            color="green"
          />
          <StatCard
            title="Avg Response Time"
            value={formatResponseTime(ticketSettings.stats.averageResponseTime)}
            icon={<i className="fas fa-clock"></i>}
            color="blue"
          />
          <StatCard
            title="With Response"
            value={ticketSettings.stats.totalTicketsWithResponse}
            icon={<i className="fas fa-reply"></i>}
            color="purple"
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">
            Banned Users
          </label>
          <p className="text-neutral-400 text-sm mb-4">
            Users are automatically banned from creating tickets when moderation
            actions are taken.
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {ticketSettings.ticketBanList.map((user, index) => (
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
            Save Ticket Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
