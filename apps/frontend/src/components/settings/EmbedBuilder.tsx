"use client";

import React, { useState } from "react";
import {
  IDiscordEmbed,
  IDiscordEmbedField,
  IDiscordButton,
  DiscordButtonStyle,
} from "@nethercore/database/types-only";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../Button";
import Toggle from "../ui/Toggle";

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
    footer: { text: "" },
    image: { url: "" },
    thumbnail: { url: "" },
    author: { name: "", url: "", icon_url: "" },
    timestamp: "",
    url: "",
    provider: { name: "", url: "" },
    fields: [],
  });

  const [buttons, setButtons] = useState<IDiscordButton[]>([]);
  const [channelId, setChannelId] = useState("");
  const [newField, setNewField] = useState<IDiscordEmbedField>({
    name: "",
    value: "",
    inline: false,
  });
  const [newButton, setNewButton] = useState<IDiscordButton>({
    style: DiscordButtonStyle.LINK,
    url: "",
    label: "",
    emoji: { id: "", name: "", animated: false },
    disabled: false,
  });

  const handleSave = () => {
    onSave?.(embed, buttons, channelId);
  };

  const addField = () => {
    if (newField.name && newField.value) {
      setEmbed((prev) => ({
        ...prev,
        fields: [...(prev.fields || []), { ...newField }],
      }));
      setNewField({ name: "", value: "", inline: false });
    }
  };

  const removeField = (index: number) => {
    setEmbed((prev: IDiscordEmbed) => ({
      ...prev,
      fields:
        prev.fields?.filter(
          (_: IDiscordEmbedField, i: number) => i !== index
        ) || [],
    }));
  };

  const addButton = () => {
    if (newButton.url && newButton.label) {
      setButtons((prev: IDiscordButton[]) => [...prev, { ...newButton }]);
      setNewButton({
        style: DiscordButtonStyle.LINK,
        url: "",
        label: "",
        emoji: { id: "", name: "", animated: false },
        disabled: false,
      });
    }
  };

  const removeButton = (index: number) => {
    setButtons((prev: IDiscordButton[]) =>
      prev.filter((_: IDiscordButton, i: number) => i !== index)
    );
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

            <div className="bg-black/50 rounded-lg p-4 border border-neutral-800">
              <h3 className="text-white font-medium mb-4">Author</h3>
              <div className="space-y-4">
                <Input
                  label="Name"
                  value={embed.author?.name || ""}
                  onChange={(e) =>
                    setEmbed((prev: IDiscordEmbed) => ({
                      ...prev,
                      author: { name: e.target.value, url: "", icon_url: "" },
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

            <div className="bg-black/50 rounded-lg p-4 border border-neutral-800">
              <h3 className="text-white font-medium mb-4">Media</h3>
              <div className="space-y-4">
                <Input
                  label="Thumbnail URL"
                  value={embed.thumbnail?.url || ""}
                  onChange={(e) =>
                    setEmbed((prev: IDiscordEmbed) => ({
                      ...prev,
                      thumbnail: { url: e.target.value },
                    }))
                  }
                  placeholder="https://example.com/thumb.png"
                  icon={<i className="fas fa-image"></i>}
                />

                <Input
                  label="Image URL"
                  value={embed.image?.url || ""}
                  onChange={(e) =>
                    setEmbed((prev: IDiscordEmbed) => ({
                      ...prev,
                      image: { url: e.target.value },
                    }))
                  }
                  placeholder="https://example.com/image.png"
                  icon={<i className="fas fa-image"></i>}
                />
              </div>
            </div>

            <div className="bg-black/50 rounded-lg p-4 border border-neutral-800">
              <h3 className="text-white font-medium mb-4">Footer</h3>
              <div className="space-y-4">
                <Input
                  label="Footer Text"
                  value={embed.footer?.text || ""}
                  onChange={(e) =>
                    setEmbed((prev: IDiscordEmbed) => ({
                      ...prev,
                      footer: { text: e.target.value, icon_url: "" },
                    }))
                  }
                  placeholder="Footer text"
                  icon={<i className="fas fa-info"></i>}
                />

                <Input
                  label="Footer Icon URL"
                  value={embed.footer?.icon_url || ""}
                  onChange={(e) =>
                    setEmbed((prev: IDiscordEmbed) => ({
                      ...prev,
                      footer: {
                        text: prev.footer?.text || "",
                        icon_url: e.target.value,
                      },
                    }))
                  }
                  placeholder="https://example.com/footer-icon.png"
                  icon={<i className="fas fa-image"></i>}
                />

                <Input
                  label="Timestamp"
                  value={embed.timestamp || ""}
                  onChange={(e) =>
                    setEmbed((prev: IDiscordEmbed) => ({
                      ...prev,
                      timestamp: e.target.value,
                    }))
                  }
                  placeholder="ISO 8601 timestamp"
                  icon={<i className="fas fa-clock"></i>}
                />
              </div>
            </div>

            <div className="bg-black/50 rounded-lg p-4 border border-neutral-800">
              <h3 className="text-white font-medium mb-4">Provider</h3>
              <div className="space-y-4">
                <Input
                  label="Provider Name"
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

            <div className="bg-black/50 rounded-lg p-4 border border-neutral-800">
              <h3 className="text-white font-medium mb-4">Fields</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    value={newField.name}
                    onChange={(e) =>
                      setNewField((prev: IDiscordEmbedField) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Field name"
                    icon={<i className="fas fa-tag"></i>}
                  />
                  <Input
                    value={newField.value}
                    onChange={(e) =>
                      setNewField((prev: IDiscordEmbedField) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                    placeholder="Field value"
                    icon={<i className="fas fa-text-width"></i>}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Toggle
                    checked={newField.inline || false}
                    onChange={(checked) =>
                      setNewField((prev: IDiscordEmbedField) => ({
                        ...prev,
                        inline: checked,
                      }))
                    }
                  />
                  <span className="text-white text-sm">Inline</span>
                </div>
                <Button
                  onClick={addField}
                  size="sm"
                  disabled={!newField.name || !newField.value}
                >
                  <i className="fas fa-plus"></i>
                  Add Field
                </Button>
              </div>

              <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                {embed.fields?.map(
                  (field: IDiscordEmbedField, index: number) => (
                    <div
                      key={index}
                      className="bg-black/50 rounded-lg p-3 flex items-center justify-between border border-neutral-800"
                    >
                      <div>
                        <div className="text-white text-sm font-medium">
                          {field.name}
                        </div>
                        <div className="text-neutral-400 text-xs">
                          {field.value}
                        </div>
                        {field.inline && (
                          <span className="text-blue-400 text-xs">Inline</span>
                        )}
                      </div>
                      <button
                        onClick={() => removeField(index)}
                        className="text-red-400 hover:text-red-300 p-1 transition-colors"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-black/50 rounded-lg p-4 border border-neutral-800">
              <h3 className="text-white font-medium mb-4">Link Buttons</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    value={newButton.label || ""}
                    onChange={(e) =>
                      setNewButton((prev: IDiscordButton) => ({
                        ...prev,
                        label: e.target.value,
                      }))
                    }
                    placeholder="Button label"
                    icon={<i className="fas fa-tag"></i>}
                  />
                  <Input
                    value={newButton.url}
                    onChange={(e) =>
                      setNewButton((prev: IDiscordButton) => ({
                        ...prev,
                        url: e.target.value,
                      }))
                    }
                    placeholder="Button URL"
                    icon={<i className="fas fa-link"></i>}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    value={newButton.emoji?.name || ""}
                    onChange={(e) =>
                      setNewButton((prev: IDiscordButton) => ({
                        ...prev,
                        emoji: {
                          id: prev.emoji?.id || "",
                          name: e.target.value,
                          animated: prev.emoji?.animated || false,
                        },
                      }))
                    }
                    placeholder="Emoji name"
                    icon={<i className="fas fa-smile"></i>}
                  />
                  <Input
                    value={newButton.emoji?.id || ""}
                    onChange={(e) =>
                      setNewButton((prev: IDiscordButton) => ({
                        ...prev,
                        emoji: {
                          id: e.target.value,
                          name: prev.emoji?.name || "",
                          animated: prev.emoji?.animated || false,
                        },
                      }))
                    }
                    placeholder="Emoji ID"
                    icon={<i className="fas fa-hashtag"></i>}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Toggle
                    checked={newButton.emoji?.animated || false}
                    onChange={(checked) =>
                      setNewButton((prev: IDiscordButton) => ({
                        ...prev,
                        emoji: {
                          id: prev.emoji?.id || "",
                          name: prev.emoji?.name || "",
                          animated: checked,
                        },
                      }))
                    }
                  />
                  <span className="text-white text-sm">Animated Emoji</span>
                </div>
                <div className="flex items-center gap-2">
                  <Toggle
                    checked={newButton.disabled || false}
                    onChange={(checked) =>
                      setNewButton((prev: IDiscordButton) => ({
                        ...prev,
                        disabled: checked,
                      }))
                    }
                  />
                  <span className="text-white text-sm">Disabled</span>
                </div>
                <Button
                  onClick={addButton}
                  size="sm"
                  disabled={!newButton.url || !newButton.label}
                >
                  <i className="fas fa-plus"></i>
                  Add Button
                </Button>
              </div>

              <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                {buttons.map((button: IDiscordButton, index: number) => (
                  <div
                    key={index}
                    className="bg-black/50 rounded-lg p-3 flex items-center justify-between border border-neutral-800"
                  >
                    <div>
                      <div className="text-white text-sm font-medium">
                        {button.emoji?.name && <span>{button.emoji.name}</span>}
                        {button.label}
                      </div>
                      <div className="text-neutral-400 text-xs">
                        {button.url}
                      </div>
                      {button.disabled && (
                        <span className="text-red-400 text-xs">Disabled</span>
                      )}
                    </div>
                    <button
                      onClick={() => removeButton(index)}
                      className="text-red-400 hover:text-red-300 p-1 transition-colors"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

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
                        <span>
                          {new Date(embed.timestamp).toLocaleString()}
                        </span>
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
