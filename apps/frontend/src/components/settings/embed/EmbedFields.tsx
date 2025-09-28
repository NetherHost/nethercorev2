"use client";

import React, { useState } from "react";
import {
  IDiscordEmbed,
  IDiscordEmbedField,
} from "@nethercore/database/types-only";
import Input from "../../ui/Input";
import Button from "../../Button";
import Toggle from "../../ui/Toggle";

interface EmbedFieldsProps {
  embed: IDiscordEmbed;
  setEmbed: React.Dispatch<React.SetStateAction<IDiscordEmbed>>;
}

export default function EmbedFields({ embed, setEmbed }: EmbedFieldsProps) {
  const [editingField, setEditingField] = useState<number | null>(null);
  const [newField, setNewField] = useState<IDiscordEmbedField>({
    name: "",
    value: "",
    inline: false,
  });
  const [editField, setEditField] = useState<IDiscordEmbedField>({
    name: "",
    value: "",
    inline: false,
  });

  const addField = () => {
    if (newField.name && newField.value) {
      setEmbed((prev: IDiscordEmbed) => ({
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

  const startEditField = (index: number) => {
    const field = embed.fields?.[index];
    if (field) {
      setEditField({ ...field });
      setEditingField(index);
    }
  };

  const saveEditField = () => {
    if (editingField !== null && editField.name && editField.value) {
      setEmbed((prev: IDiscordEmbed) => ({
        ...prev,
        fields:
          prev.fields?.map((field: IDiscordEmbedField, index: number) =>
            index === editingField ? editField : field
          ) || [],
      }));
      setEditingField(null);
      setEditField({ name: "", value: "", inline: false });
    }
  };

  const cancelEditField = () => {
    setEditingField(null);
    setEditField({ name: "", value: "", inline: false });
  };

  return (
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
        {embed.fields?.map((field: IDiscordEmbedField, index: number) => (
          <div
            key={index}
            className="bg-black/50 rounded-lg p-3 border border-neutral-800"
          >
            {editingField === index ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input
                    value={editField.name}
                    onChange={(e) =>
                      setEditField((prev: IDiscordEmbedField) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Field name"
                    icon={<i className="fas fa-tag"></i>}
                  />
                  <Input
                    value={editField.value}
                    onChange={(e) =>
                      setEditField((prev: IDiscordEmbedField) => ({
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
                    checked={editField.inline || false}
                    onChange={(checked) =>
                      setEditField((prev: IDiscordEmbedField) => ({
                        ...prev,
                        inline: checked,
                      }))
                    }
                  />
                  <span className="text-white text-sm">Inline</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={saveEditField}
                    size="sm"
                    disabled={!editField.name || !editField.value}
                  >
                    <i className="fas fa-check"></i>
                    Save
                  </Button>
                  <Button
                    onClick={cancelEditField}
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
                    {field.name}
                  </div>
                  <div className="text-neutral-400 text-xs">{field.value}</div>
                  {field.inline && (
                    <span className="text-blue-400 text-xs">Inline</span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEditField(index)}
                    className="text-blue-400 hover:text-blue-300 p-1 transition-colors"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => removeField(index)}
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
