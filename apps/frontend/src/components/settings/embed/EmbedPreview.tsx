"use client";

import React from "react";
import {
  IDiscordEmbed,
  IDiscordEmbedField,
  IDiscordButton,
} from "@nethercore/database/types-only";

interface EmbedPreviewProps {
  embed: IDiscordEmbed;
  buttons: IDiscordButton[];
}

export default function EmbedPreview({ embed, buttons }: EmbedPreviewProps) {
  const getPreviewColor = (color: string) => {
    if (color.startsWith("#")) {
      return parseInt(color.slice(1), 16);
    }
    return parseInt(color, 16);
  };

  return (
    <div className="p-6 bg-neutral-900/50">
      <div className="sticky top-6">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <i className="fas fa-eye text-blue-400"></i>
          Live Preview
        </h3>

        <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
          <div
            className="bg-neutral-800 rounded-lg p-4 border-l-4"
            style={{
              borderLeftColor: embed.color || "#5865F2",
            }}
          >
            {embed.author && (
              <div className="flex items-center gap-2 mb-2">
                {embed.author.icon_url && (
                  <img
                    src={embed.author.icon_url}
                    alt=""
                    className="w-6 h-6 rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <span className="text-blue-400 text-sm">
                  {embed.author.url ? (
                    <a href={embed.author.url} className="hover:underline">
                      {embed.author.name}
                    </a>
                  ) : (
                    embed.author.name
                  )}
                </span>
              </div>
            )}

            {embed.title && (
              <h3 className="text-white font-semibold text-lg mb-2">
                {embed.url ? (
                  <a href={embed.url} className="hover:underline">
                    {embed.title}
                  </a>
                ) : (
                  embed.title
                )}
              </h3>
            )}

            {embed.description && (
              <p className="text-neutral-300 mb-3">{embed.description}</p>
            )}

            {embed.thumbnail?.url && (
              <div className="float-right ml-4 mb-2">
                <img
                  src={embed.thumbnail.url}
                  alt=""
                  className="w-20 h-20 rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            {embed.fields && embed.fields.length > 0 && (
              <div className="space-y-2 mb-3">
                {embed.fields.map(
                  (field: IDiscordEmbedField, index: number) => (
                    <div
                      key={index}
                      className={
                        field.inline ? "inline-block w-1/2 pr-2" : "block"
                      }
                    >
                      <div className="text-white font-medium text-sm">
                        {field.name}
                      </div>
                      <div className="text-neutral-300 text-sm">
                        {field.value}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {embed.image?.url && (
              <div className="mb-3">
                <img
                  src={embed.image.url}
                  alt=""
                  className="w-full max-w-md rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            {embed.footer && (
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                {embed.footer.icon_url && (
                  <img
                    src={embed.footer.icon_url}
                    alt=""
                    className="w-4 h-4 rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <span>{embed.footer.text}</span>
                {embed.timestamp && (
                  <>
                    <span>•</span>
                    <span>{new Date(embed.timestamp).toLocaleString()}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {buttons.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {buttons.map((button: IDiscordButton, index: number) => (
                <button
                  key={index}
                  disabled={button.disabled}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    button.disabled
                      ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {button.emoji?.name && (
                    <span className="mr-1">{button.emoji.name}</span>
                  )}
                  {button.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
