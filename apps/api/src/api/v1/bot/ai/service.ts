import {
  AISettings,
  IAIConfig,
  IAIBan,
  IRateLimitConfig,
} from "@nethercore/database";

export class AISettingsService {
  async getAISettings(): Promise<IAIConfig> {
    try {
      let settings = await AISettings.findById("ai-settings");

      if (!settings) {
        const defaultSettings = new AISettings({
          _id: "ai-settings",
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
          bannedUsers: [],
          rateLimits: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        settings = await defaultSettings.save();
      }

      return settings.toObject();
    } catch (error) {
      throw new Error(`Failed to fetch AI settings: ${error}`);
    }
  }

  async createAISettings(config: Partial<IAIConfig>): Promise<IAIConfig> {
    try {
      const existingSettings = await AISettings.findById("ai-settings");

      if (existingSettings) {
        return await this.updateAISettings(config);
      }

      const newSettings = new AISettings({
        _id: "ai-settings",
        ...config,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const savedSettings = await newSettings.save();
      return savedSettings.toObject();
    } catch (error) {
      throw new Error(`Failed to create AI settings: ${error}`);
    }
  }

  async updateAISettings(config: Partial<IAIConfig>): Promise<IAIConfig> {
    try {
      const updatedSettings = await AISettings.findByIdAndUpdate(
        "ai-settings",
        {
          ...config,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      if (!updatedSettings) {
        const newSettings = new AISettings({
          _id: "ai-settings",
          ...config,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        const savedSettings = await newSettings.save();
        return savedSettings.toObject();
      }

      return updatedSettings.toObject();
    } catch (error) {
      throw new Error(`Failed to update AI settings: ${error}`);
    }
  }

  async deleteAISettings(): Promise<boolean> {
    try {
      const result = await AISettings.findByIdAndDelete("ai-settings");
      return !!result;
    } catch (error) {
      throw new Error(`Failed to delete AI settings: ${error}`);
    }
  }

  async addBannedUser(banData: {
    userId: string;
    moderator: string;
    reason?: string;
  }): Promise<IAIConfig> {
    try {
      let settings = await AISettings.findById("ai-settings");

      if (!settings) {
        await this.getAISettings();
        settings = await AISettings.findById("ai-settings");
      }

      const newBan = {
        userId: banData.userId,
        moderator: banData.moderator,
        reason: banData.reason,
        bannedAt: new Date(),
      };

      settings!.bannedUsers = settings!.bannedUsers || [];
      settings!.bannedUsers.push(newBan);
      settings!.updatedAt = new Date();

      const updatedSettings = await settings!.save();
      return updatedSettings.toObject();
    } catch (error) {
      throw new Error(`Failed to add banned user: ${error}`);
    }
  }

  async removeBannedUser(userId: string): Promise<IAIConfig> {
    try {
      let settings = await AISettings.findById("ai-settings");

      if (!settings) {
        await this.getAISettings();
        settings = await AISettings.findById("ai-settings");
      }

      settings!.bannedUsers =
        settings!.bannedUsers?.filter((ban: IAIBan) => ban.userId !== userId) ||
        [];
      settings!.updatedAt = new Date();

      const updatedSettings = await settings!.save();
      return updatedSettings.toObject();
    } catch (error) {
      throw new Error(`Failed to remove banned user: ${error}`);
    }
  }

  async updateRateLimit(rateLimitData: {
    userId: string;
    requestsPerUser: number;
    threshold: number;
  }): Promise<IAIConfig> {
    try {
      let settings = await AISettings.findById("ai-settings");

      if (!settings) {
        await this.getAISettings();
        settings = await AISettings.findById("ai-settings");
      }

      settings!.rateLimits = settings!.rateLimits || [];
      const existingRateLimitIndex = settings!.rateLimits.findIndex(
        (limit: IRateLimitConfig) => limit.userId === rateLimitData.userId
      );

      if (existingRateLimitIndex >= 0) {
        settings!.rateLimits[existingRateLimitIndex] = rateLimitData;
      } else {
        settings!.rateLimits.push(rateLimitData);
      }

      settings!.updatedAt = new Date();
      const updatedSettings = await settings!.save();
      return updatedSettings.toObject();
    } catch (error) {
      throw new Error(`Failed to update rate limit: ${error}`);
    }
  }

  async removeRateLimit(userId: string): Promise<IAIConfig> {
    try {
      let settings = await AISettings.findById("ai-settings");

      if (!settings) {
        await this.getAISettings();
        settings = await AISettings.findById("ai-settings");
      }

      settings!.rateLimits =
        settings!.rateLimits?.filter(
          (limit: IRateLimitConfig) => limit.userId !== userId
        ) || [];
      settings!.updatedAt = new Date();

      const updatedSettings = await settings!.save();
      return updatedSettings.toObject();
    } catch (error) {
      throw new Error(`Failed to remove rate limit: ${error}`);
    }
  }

  async updateAllowedChannels(channelIds: string[]): Promise<IAIConfig> {
    try {
      const updatedSettings = await AISettings.findByIdAndUpdate(
        "ai-settings",
        {
          allowedChannelIds: channelIds,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      if (!updatedSettings) {
        const newSettings = new AISettings({
          _id: "ai-settings",
          allowedChannelIds: channelIds,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        const savedSettings = await newSettings.save();
        return savedSettings.toObject();
      }

      return updatedSettings.toObject();
    } catch (error) {
      throw new Error(`Failed to update allowed channels: ${error}`);
    }
  }

  async updateAllowedRoles(roleIds: string[]): Promise<IAIConfig> {
    try {
      const updatedSettings = await AISettings.findByIdAndUpdate(
        "ai-settings",
        {
          allowedRoleIds: roleIds,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      if (!updatedSettings) {
        const newSettings = new AISettings({
          _id: "ai-settings",
          allowedRoleIds: roleIds,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        const savedSettings = await newSettings.save();
        return savedSettings.toObject();
      }

      return updatedSettings.toObject();
    } catch (error) {
      throw new Error(`Failed to update allowed roles: ${error}`);
    }
  }
}

export const aiSettingsService = new AISettingsService();
