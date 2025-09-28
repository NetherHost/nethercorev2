"use client";

import React from "react";
import { IDiscordEmbed } from "@nethercore/database/types-only";
import Input from "../../ui/Input";

interface EmbedAuthorProps {
  embed: IDiscordEmbed;
  setEmbed: React.Dispatch<React.SetStateAction<IDiscordEmbed>>;
}

export default function EmbedAuthor({ embed, setEmbed }: EmbedAuthorProps) {
  return (
    <div className="bg-black/50 rounded-lg p-4 border border-neutral-800">
      <h3 className="text-white font-medium mb-4">Author</h3>
      <div className="space-y-4">
        <Input
          label="Name"
          value={embed.author?.name || ""}
          onChange={(e) =>
            setEmbed((prev: IDiscordEmbed) => ({
              ...prev,
              author: {
                ...prev.author,
                name: e.target.value,
              },
            }))
          }
          placeholder="Author name"
          icon={<i className="fas fa-user"></i>}
        />

        <Input
          label="URL"
          value={embed.author?.url || ""}
          onChange={(e) =>
            setEmbed((prev: IDiscordEmbed) => ({
              ...prev,
              author: {
                name: prev.author?.name || "",
                url: e.target.value,
                icon_url: prev.author?.icon_url || "",
              },
            }))
          }
          placeholder="https://example.com"
          icon={<i className="fas fa-link"></i>}
        />

        <Input
          label="Icon URL"
          value={embed.author?.icon_url || ""}
          onChange={(e) =>
            setEmbed((prev: IDiscordEmbed) => ({
              ...prev,
              author: {
                name: prev.author?.name || "",
                url: prev.author?.url || "",
                icon_url: e.target.value,
              },
            }))
          }
          placeholder="https://example.com/icon.png"
          icon={<i className="fas fa-image"></i>}
        />
      </div>
    </div>
  );
}
