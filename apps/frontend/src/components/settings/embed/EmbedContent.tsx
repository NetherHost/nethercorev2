"use client";

import React from "react";
import { IDiscordEmbed } from "@nethercore/database/types-only";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";

interface EmbedContentProps {
  embed: IDiscordEmbed;
  setEmbed: React.Dispatch<React.SetStateAction<IDiscordEmbed>>;
}

export default function EmbedContent({ embed, setEmbed }: EmbedContentProps) {
  return (
    <div className="bg-black/50 rounded-lg p-4 border border-neutral-800">
      <h3 className="text-white font-medium mb-4">Embed Content</h3>
      <div className="space-y-4">
        <Input
          label="Title"
          value={embed.title || ""}
          onChange={(e) =>
            setEmbed((prev: IDiscordEmbed) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          placeholder="Embed title"
          icon={<i className="fas fa-heading"></i>}
        />

        <Textarea
          label="Description"
          value={embed.description || ""}
          onChange={(e) =>
            setEmbed((prev: IDiscordEmbed) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          placeholder="Embed description"
          rows={3}
        />

        <Input
          label="Color"
          value={embed.color || ""}
          onChange={(e) =>
            setEmbed((prev: IDiscordEmbed) => ({
              ...prev,
              color: e.target.value,
            }))
          }
          placeholder="#5865F2"
          icon={<i className="fas fa-palette"></i>}
        />

        <Input
          label="URL"
          value={embed.url || ""}
          onChange={(e) =>
            setEmbed((prev: IDiscordEmbed) => ({
              ...prev,
              url: e.target.value,
            }))
          }
          placeholder="https://example.com"
          icon={<i className="fas fa-link"></i>}
        />
      </div>
    </div>
  );
}
