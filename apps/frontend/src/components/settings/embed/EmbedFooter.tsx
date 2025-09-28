"use client";

import React from "react";
import { IDiscordEmbed } from "@nethercore/database/types-only";
import Input from "../../ui/Input";
import DatePicker from "../../ui/DatePicker";

interface EmbedFooterProps {
  embed: IDiscordEmbed;
  setEmbed: React.Dispatch<React.SetStateAction<IDiscordEmbed>>;
}

export default function EmbedFooter({ embed, setEmbed }: EmbedFooterProps) {
  return (
    <div className="bg-black/50 rounded-lg p-4 border border-neutral-800">
      <h3 className="text-white font-medium mb-4">Footer</h3>
      <div className="space-y-4">
        <Input
          label="Text"
          value={embed.footer?.text || ""}
          onChange={(e) =>
            setEmbed((prev: IDiscordEmbed) => ({
              ...prev,
              footer: { ...prev.footer, text: e.target.value },
            }))
          }
          placeholder="Footer text"
          icon={<i className="fas fa-info-circle"></i>}
        />

        <Input
          label="Footer Icon URL"
          value={embed.footer?.icon_url || ""}
          onChange={(e) =>
            setEmbed((prev: IDiscordEmbed) => ({
              ...prev,
              footer: {
                text: prev.footer?.text || "",
                ...prev.footer,
                icon_url: e.target.value,
              },
            }))
          }
          placeholder="https://example.com/footer-icon.png"
          icon={<i className="fas fa-image"></i>}
        />

        <DatePicker
          label="Timestamp"
          description="When this embed was created"
          value={embed.timestamp || ""}
          onChange={(value) =>
            setEmbed((prev: IDiscordEmbed) => ({
              ...prev,
              timestamp: value,
            }))
          }
          placeholder="Select date and time"
          icon={<i className="fas fa-clock"></i>}
        />
      </div>
    </div>
  );
}
