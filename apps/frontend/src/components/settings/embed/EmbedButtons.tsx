"use client";

import React, { useState } from "react";
import {
  IDiscordButton,
  DiscordButtonStyle,
} from "@nethercore/database/types-only";
import Input from "../../ui/Input";
import Button from "../../Button";
import Toggle from "../../ui/Toggle";

interface EmbedButtonsProps {
  buttons: IDiscordButton[];
  setButtons: React.Dispatch<React.SetStateAction<IDiscordButton[]>>;
}

export default function EmbedButtons({
  buttons,
  setButtons,
}: EmbedButtonsProps) {
  const [editingButton, setEditingButton] = useState<number | null>(null);
  const [newButton, setNewButton] = useState<IDiscordButton>({
    style: DiscordButtonStyle.LINK,
    url: "",
    label: "",
    emoji: { id: "", name: "", animated: false },
    disabled: false,
  });
  const [editButton, setEditButton] = useState<IDiscordButton>({
    style: DiscordButtonStyle.LINK,
    url: "",
    label: "",
    emoji: { id: "", name: "", animated: false },
    disabled: false,
  });

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

  const startEditButton = (index: number) => {
    const button = buttons[index];
    if (button) {
      setEditButton({ ...button });
      setEditingButton(index);
    }
  };

  const saveEditButton = () => {
    if (editingButton !== null && editButton.url && editButton.label) {
      setButtons((prev: IDiscordButton[]) =>
        prev.map((button: IDiscordButton, index: number) =>
          index === editingButton ? editButton : button
        )
      );
      setEditingButton(null);
      setEditButton({
        style: DiscordButtonStyle.LINK,
        url: "",
        label: "",
        emoji: { id: "", name: "", animated: false },
        disabled: false,
      });
    }
  };

  const cancelEditButton = () => {
    setEditingButton(null);
    setEditButton({
      style: DiscordButtonStyle.LINK,
      url: "",
      label: "",
      emoji: { id: "", name: "", animated: false },
      disabled: false,
    });
  };

  return (
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
        <div className="flex items-center gap-4">
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
            className="bg-black/50 rounded-lg p-3 border border-neutral-800"
          >
            {editingButton === index ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    value={editButton.label || ""}
                    onChange={(e) =>
                      setEditButton((prev: IDiscordButton) => ({
                        ...prev,
                        label: e.target.value,
                      }))
                    }
                    placeholder="Button label"
                    icon={<i className="fas fa-tag"></i>}
                  />
                  <Input
                    value={editButton.url}
                    onChange={(e) =>
                      setEditButton((prev: IDiscordButton) => ({
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
                    value={editButton.emoji?.name || ""}
                    onChange={(e) =>
                      setEditButton((prev: IDiscordButton) => ({
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
                    value={editButton.emoji?.id || ""}
                    onChange={(e) =>
                      setEditButton((prev: IDiscordButton) => ({
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
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Toggle
                      checked={editButton.emoji?.animated || false}
                      onChange={(checked) =>
                        setEditButton((prev: IDiscordButton) => ({
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
                      checked={editButton.disabled || false}
                      onChange={(checked) =>
                        setEditButton((prev: IDiscordButton) => ({
                          ...prev,
                          disabled: checked,
                        }))
                      }
                    />
                    <span className="text-white text-sm">Disabled</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={saveEditButton}
                    size="sm"
                    disabled={!editButton.url || !editButton.label}
                  >
                    <i className="fas fa-check"></i>
                    Save
                  </Button>
                  <Button
                    onClick={cancelEditButton}
                    size="sm"
                    variant="secondary"
                  >
                    <i className="fas fa-times"></i>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white text-sm font-medium">
                    {button.emoji?.name && <span>{button.emoji.name}</span>}
                    {button.label}
                  </div>
                  <div className="text-neutral-400 text-xs">{button.url}</div>
                  {button.disabled && (
                    <span className="text-red-400 text-xs">Disabled</span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEditButton(index)}
                    className="text-blue-400 hover:text-blue-300 p-1 transition-colors"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => removeButton(index)}
                    className="text-red-400 hover:text-red-300 p-1 transition-colors"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
