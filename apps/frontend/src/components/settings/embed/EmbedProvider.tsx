"use client";

import React from "react";
import { IDiscordEmbed } from "@nethercore/database/types-only";
import Input from "../../ui/Input";

interface EmbedProviderProps {
  embed: IDiscordEmbed;
  setEmbed: React.Dispatch<React.SetStateAction<IDiscordEmbed>>;
}

export default function EmbedProvider({ embed, setEmbed }: EmbedProviderProps) {
  return (
    <div className="bg-black/50 rounded-lg p-4 border border-neutral-800">
      <h3 className="text-white font-medium mb-4">Provider</h3>
      <div className="space-y-4">
        <Input
          label="Name"
          value={embed.provider?.name || ""}
          onChange={(e) =>
            setEmbed((prev: IDiscordEmbed) => ({
              ...prev,
              provider: { name: e.target.value, url: "" },
            }))
          }
          placeholder="Provider name"
          icon={<i className="fas fa-building"></i>}
        />

        <Input
          label="Provider URL"
          value={embed.provider?.url || ""}
          onChange={(e) =>
            setEmbed((prev: IDiscordEmbed) => ({
              ...prev,
              provider: {
                name: prev.provider?.name || "",
                url: e.target.value,
              },
            }))
          }
          placeholder="https://example.com"
          icon={<i className="fas fa-link"></i>}
        />
      </div>
    </div>
  );
}
