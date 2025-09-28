"use client";

import React, { useState } from "react";
import { IDiscordEmbed, IDiscordButton } from "@nethercore/database/types-only";
import Input from "../ui/Input";
import Button from "../Button";
import EmbedContent from "./embed/EmbedContent";
import EmbedAuthor from "./embed/EmbedAuthor";
import EmbedMedia from "./embed/EmbedMedia";
import EmbedFooter from "./embed/EmbedFooter";
import EmbedProvider from "./embed/EmbedProvider";
import EmbedFields from "./embed/EmbedFields";
import EmbedButtons from "./embed/EmbedButtons";
import EmbedPreview from "./embed/EmbedPreview";

interface EmbedBuilderProps {
  onSave?: (
    embed: IDiscordEmbed,
    buttons: IDiscordButton[],
    channelId: string
  ) => void;
}

export default function EmbedBuilder({ onSave }: EmbedBuilderProps) {
  const [embed, setEmbed] = useState<IDiscordEmbed>({
    title: "",
    description: "",
    color: "#5865F2",
    url: "",
    author: { name: "", url: "", icon_url: "" },
    thumbnail: { url: "" },
    image: { url: "" },
    footer: { text: "", icon_url: "" },
    timestamp: "",
    provider: { name: "", url: "" },
    fields: [],
  });

  const [buttons, setButtons] = useState<IDiscordButton[]>([]);
  const [channelId, setChannelId] = useState<string>("");

  const handleSave = () => {
    onSave?.(embed, buttons, channelId);
  };

  return (
    <div className="bg-black/50 backdrop-blur-md rounded-xl border border-neutral-800 shadow-lg">
      <div className="p-6 border-b border-neutral-800">
        <h2 className="text-xl font-semibold text-white">Embed Builder</h2>
        <p className="text-neutral-400 text-sm mt-1">
          Create and preview Discord embeds with link buttons
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 min-h-[600px]">
        <div className="p-6 border-r border-neutral-800 overflow-y-auto max-h-[600px]">
          <div className="space-y-6">
            <EmbedContent embed={embed} setEmbed={setEmbed} />
            <EmbedAuthor embed={embed} setEmbed={setEmbed} />
            <EmbedMedia embed={embed} setEmbed={setEmbed} />
            <EmbedFooter embed={embed} setEmbed={setEmbed} />
            <EmbedProvider embed={embed} setEmbed={setEmbed} />
            <EmbedFields embed={embed} setEmbed={setEmbed} />
            <EmbedButtons buttons={buttons} setButtons={setButtons} />

            <div className="bg-black/50 rounded-lg p-4 border border-neutral-800">
              <h3 className="text-white font-medium mb-4">Send Settings</h3>
              <Input
                label="Channel ID"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                placeholder="Enter Discord channel ID"
                icon={<i className="fas fa-hashtag"></i>}
              />
            </div>
          </div>
        </div>

        <EmbedPreview embed={embed} buttons={buttons} />
      </div>

      <div className="p-6 border-t border-neutral-800">
        <div className="flex justify-end">
          <Button onClick={handleSave} variant="primary">
            <i className="fas fa-paper-plane"></i>
            Send Embed
          </Button>
        </div>
      </div>
    </div>
  );
}
