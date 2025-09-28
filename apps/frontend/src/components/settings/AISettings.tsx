"use client";

import React, { useState, useEffect } from "react";
import Button from "../Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import Toggle from "../ui/Toggle";
import TagInput from "../ui/TagInput";
import { IAIConfig } from "@nethercore/database/types-only";
import { apiClient } from "../../utils/api";

interface AISettingsProps {
  onSave?: (config: IAIConfig) => void;
}

export default function AISettings({ onSave }: AISettingsProps) {
  const [settings, setSettings] = useState<Partial<IAIConfig>>({
    enabled: false,
    provider: "openai" as any,
    apiKey: "",
    model: "gpt-5-mini" as any,
    maxTokens: 1000,
    temperature: 0.7,
    topP: 1,
    presencePenalty: 0,
    frequencyPenalty: 0,
    systemPrompt: "",
    maxResponseLength: 2000,
    allowedChannelIds: [],
    allowedRoleIds: [],
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchAISettings();
  }, []);

  const fetchAISettings = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<IAIConfig>(`/bot/ai`);

      if (response.success && response.data) {
        setSettings(response.data);
      } else {
        setSettings({
          enabled: false,
          provider: "openai" as any,
          apiKey: "",
          model: "gpt-5-mini" as any,
          maxTokens: 1000,
          temperature: 0.7,
          topP: 1,
          presencePenalty: 0,
          frequencyPenalty: 0,
          systemPrompt: "",
          maxResponseLength: 2000,
          allowedChannelIds: [],
          allowedRoleIds: [],
        });
      }
    } catch (err: any) {
      if (err.message?.includes("404")) {
        setSettings({
          enabled: false,
          provider: "openai" as any,
          apiKey: "",
          model: "gpt-5-mini" as any,
          maxTokens: 1000,
          temperature: 0.7,
          topP: 1,
          presencePenalty: 0,
          frequencyPenalty: 0,
          systemPrompt: "",
          maxResponseLength: 2000,
          allowedChannelIds: [],
          allowedRoleIds: [],
        });
      } else {
        setError(err.message || "Failed to fetch AI settings");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = settings._id
        ? await apiClient.put<IAIConfig>(`/bot/ai`, settings)
        : await apiClient.post<IAIConfig>(`/bot/ai`, settings);

      if (response.success && response.data) {
        setSuccess("AI settings saved successfully");
        setSettings(response.data);
        onSave?.(response.data);
      } else {
        setError(response.message || "Failed to save AI settings");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save AI settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-neutral-800 shadow-lg">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
            <span className="text-white">Loading AI settings...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-neutral-800 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
          <i className="fas fa-robot text-red-500"></i>
        </div>
        <h2 className="text-xl font-semibold text-white">AI Settings</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
          <div className="flex items-center gap-2">
            <i className="fas fa-exclamation-circle text-red-400"></i>
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
          <div className="flex items-center gap-2">
            <i className="fas fa-check-circle text-green-400"></i>
            <span className="text-green-400 text-sm">{success}</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <Toggle
          label="Enable AI"
          description="Enable AI functionality"
          checked={settings.enabled || false}
          onChange={(checked) =>
            setSettings((prev) => ({ ...prev, enabled: checked }))
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Provider"
            value={settings.provider || "openai"}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                provider: e.target.value as any,
              }))
            }
            options={[{ value: "openai", label: "OpenAI" }]}
            icon={<i className="fas fa-server"></i>}
          />

          <Select
            label="Model"
            value={settings.model || "gpt-5-mini"}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, model: e.target.value as any }))
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
          tags={settings.allowedChannelIds || []}
          onTagsChange={(tags) =>
            setSettings((prev) => ({ ...prev, allowedChannelIds: tags }))
          }
          placeholder="Enter channel ID"
        />

        <TagInput
          label="Allowed Role IDs"
          description="Roles that can use AI features"
          tags={settings.allowedRoleIds || []}
          onTagsChange={(tags) =>
            setSettings((prev) => ({ ...prev, allowedRoleIds: tags }))
          }
          placeholder="Enter role ID"
        />

        <div className="flex justify-end">
          <Button onClick={handleSave} variant="primary" disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Save AI Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
