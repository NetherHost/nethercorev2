"use client";

import React, { useState } from "react";
import Button from "../Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Toggle from "../ui/Toggle";
import TagInput from "../ui/TagInput";

interface AISettingsProps {
  config?: {
    enabled: boolean;
    provider: string;
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
    topP?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
    systemPrompt?: string;
    maxResponseLength?: number;
    allowedChannelIds: string[];
    allowedRoleIds: string[];
  };
  onSave?: (config: any) => void;
}

export default function AISettings({ config, onSave }: AISettingsProps) {
  const [settings, setSettings] = useState({
    enabled: config?.enabled ?? false,
    provider: config?.provider ?? "openai",
    apiKey: config?.apiKey ?? "",
    model: config?.model ?? "gpt-5-mini",
    maxTokens: config?.maxTokens ?? 1000,
    temperature: config?.temperature ?? 0.7,
    topP: config?.topP ?? 1,
    presencePenalty: config?.presencePenalty ?? 0,
    frequencyPenalty: config?.frequencyPenalty ?? 0,
    systemPrompt: config?.systemPrompt ?? "",
    maxResponseLength: config?.maxResponseLength ?? 2000,
    allowedChannelIds: config?.allowedChannelIds ?? [],
    allowedRoleIds: config?.allowedRoleIds ?? [],
  });

  const handleSave = () => {
    onSave?.(settings);
  };

  return (
    <div className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-neutral-800 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
          <i className="fas fa-robot text-red-500"></i>
        </div>
        <h2 className="text-xl font-semibold text-white">AI Settings</h2>
      </div>

      <div className="space-y-6">
        <Toggle
          label="Enable AI"
          description="Enable AI functionality"
          checked={settings.enabled}
          onChange={(checked) =>
            setSettings((prev) => ({ ...prev, enabled: checked }))
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Provider"
            value={settings.provider}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, provider: e.target.value }))
            }
            options={[{ value: "openai", label: "OpenAI" }]}
            icon={<i className="fas fa-server"></i>}
          />

          <Select
            label="Model"
            value={settings.model}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, model: e.target.value }))
            }
            options={[
              { value: "gpt-5", label: "GPT-5" },
              { value: "gpt-5-mini", label: "GPT-5 Mini" },
              { value: "gpt-5-nano", label: "GPT-5 Nano" },
              { value: "gpt-4.1", label: "GPT-4.1" },
              { value: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
              { value: "gpt-4.1-nano", label: "GPT-4.1 Nano" },
              { value: "o3", label: "O3" },
              { value: "o1-pro", label: "O1 Pro" },
              { value: "o1", label: "O1" },
            ]}
            icon={<i className="fas fa-brain"></i>}
          />
        </div>

        <Input
          label="API Key"
          description="Your OpenAI API key for authentication"
          variant="password"
          value={settings.apiKey}
          onChange={(e) =>
            setSettings((prev) => ({ ...prev, apiKey: e.target.value }))
          }
          placeholder="Enter your API key"
          icon={<i className="fas fa-key"></i>}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Max Tokens"
            description="Maximum tokens for AI response"
            variant="number"
            value={settings.maxTokens}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                maxTokens: parseInt(e.target.value) || 0,
              }))
            }
            icon={<i className="fas fa-hashtag"></i>}
          />

          <Input
            label="Temperature"
            description="Controls randomness (0-2)"
            variant="number"
            step="0.1"
            min="0"
            max="2"
            value={settings.temperature}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                temperature: parseFloat(e.target.value) || 0,
              }))
            }
            icon={<i className="fas fa-thermometer-half"></i>}
          />

          <Input
            label="Top P"
            description="Controls diversity (0-1)"
            variant="number"
            step="0.1"
            min="0"
            max="1"
            value={settings.topP}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                topP: parseFloat(e.target.value) || 0,
              }))
            }
            icon={<i className="fas fa-percentage"></i>}
          />
        </div>

        <Textarea
          label="System Prompt"
          description="Define the AI's behavior and personality"
          value={settings.systemPrompt}
          onChange={(e) =>
            setSettings((prev) => ({ ...prev, systemPrompt: e.target.value }))
          }
          rows={4}
          placeholder="Enter system prompt for AI behavior"
          icon={<i className="fas fa-comment-dots"></i>}
        />

        <TagInput
          label="Allowed Channel IDs"
          description="Channels where AI can respond"
          tags={settings.allowedChannelIds}
          onTagsChange={(tags) =>
            setSettings((prev) => ({ ...prev, allowedChannelIds: tags }))
          }
          placeholder="Enter channel ID"
        />

        <TagInput
          label="Allowed Role IDs"
          description="Roles that can use AI features"
          tags={settings.allowedRoleIds}
          onTagsChange={(tags) =>
            setSettings((prev) => ({ ...prev, allowedRoleIds: tags }))
          }
          placeholder="Enter role ID"
        />

        <div className="flex justify-end">
          <Button onClick={handleSave} variant="primary">
            <i className="fas fa-save"></i>
            Save AI Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
