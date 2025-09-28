"use client";

import React, { useState } from "react";
import Button from "../Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

interface ModerationAction {
  userId: string;
  moderator: string;
  action: "ban" | "unban" | "mute" | "unmute" | "warn" | "note";
  reason?: string;
  actionAt: Date;
}

interface ModerationSettingsProps {
  actions?: ModerationAction[];
  onSave?: (actions: ModerationAction[]) => void;
}

export default function ModerationSettings({
  actions = [],
  onSave,
}: ModerationSettingsProps) {
  const [moderationActions, setModerationActions] =
    useState<ModerationAction[]>(actions);
  const handleSave = () => {
    onSave?.(moderationActions);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "ban":
        return "text-red-400 bg-red-400/10";
      case "unban":
        return "text-green-400 bg-green-400/10";
      case "mute":
        return "text-yellow-400 bg-yellow-400/10";
      case "unmute":
        return "text-blue-400 bg-blue-400/10";
      case "warn":
        return "text-orange-400 bg-orange-400/10";
      case "note":
        return "text-purple-400 bg-purple-400/10";
      default:
        return "text-neutral-400 bg-neutral-400/10";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "ban":
        return "fas fa-ban";
      case "unban":
        return "fas fa-check-circle";
      case "mute":
        return "fas fa-volume-mute";
      case "unmute":
        return "fas fa-volume-up";
      case "warn":
        return "fas fa-exclamation-triangle";
      case "note":
        return "fas fa-sticky-note";
      default:
        return "fas fa-info-circle";
    }
  };

  return (
    <div className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-neutral-800 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
          <i className="fas fa-shield-alt text-red-500"></i>
        </div>
        <h2 className="text-xl font-semibold text-white">
          Moderation Settings
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-white font-medium mb-4">Moderation Actions</h3>
          <p className="text-neutral-400 text-sm mb-4">
            Actions are automatically recorded by the bot when moderation
            commands are used.
          </p>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {moderationActions.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                <div className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-history text-neutral-400"></i>
                </div>
                <p>No moderation actions yet</p>
              </div>
            ) : (
              moderationActions.map((action, index) => (
                <div
                  key={index}
                  className="bg-black/50 rounded-lg p-4 border border-neutral-800"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${getActionColor(
                          action.action
                        )}`}
                      >
                        <i
                          className={`${getActionIcon(action.action)} text-sm`}
                        ></i>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium capitalize">
                            {action.action}
                          </span>
                          <span className="text-neutral-400">•</span>
                          <span className="text-neutral-400 text-sm">
                            User: {action.userId}
                          </span>
                        </div>
                        <div className="text-neutral-400 text-sm">
                          Moderator: {action.moderator} •{" "}
                          {new Date(action.actionAt).toLocaleString()}
                        </div>
                        {action.reason && (
                          <div className="text-neutral-300 text-sm mt-1">
                            Reason: {action.reason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} variant="primary">
            <i className="fas fa-save"></i>
            Save Moderation Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
