"use client";

import React from "react";
import { IDiscordEmbed } from "@nethercore/database/types-only";
import Input from "../../ui/Input";

interface EmbedMediaProps {
  embed: IDiscordEmbed;
  setEmbed: React.Dispatch<React.SetStateAction<IDiscordEmbed>>;
}

export default function EmbedMedia({ embed, setEmbed }: EmbedMediaProps) {
  return (
    <div className="bg-black/50 rounded-lg p-4 border border-neutral-800">
      <h3 className="text-white font-medium mb-4">Media</h3>
      <div className="space-y-4">
        <Input
          label="Thumbnail URL"
          value={embed.thumbnail?.url || ""}
          onChange={(e) =>
            setEmbed((prev: IDiscordEmbed) => ({
              ...prev,
              thumbnail: { ...prev.thumbnail, url: e.target.value },
            }))
          }
          placeholder="https://example.com/thumbnail.png"
          icon={<i className="fas fa-image"></i>}
        />

        <Input
          label="Image URL"
          value={embed.image?.url || ""}
          onChange={(e) =>
            setEmbed((prev: IDiscordEmbed) => ({
              ...prev,
              image: { ...prev.image, url: e.target.value },
            }))
          }
          placeholder="https://example.com/image.png"
          icon={<i className="fas fa-image"></i>}
        />
      </div>
    </div>
  );
}
