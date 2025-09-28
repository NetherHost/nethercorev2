import {
  AISettings,
  ModerationSettings,
  GiveawaySettings,
  TicketSettings,
  Staff,
} from "@nethercore/database";
import { createLogger, LogLevel } from "@nethercore/logger";

const logger = createLogger({
  prefix: "DB_INIT",
  brand: true,
  level: LogLevel.INFO,
  forceColor: true,
});

export class DatabaseInitService {
  async initializeDefaultDocuments(): Promise<void> {
    try {
      logger.info("Initializing default documents...");

      await this.initializeAISettings();
      await this.initializeModerationSettings();
      await this.initializeGiveawaySettings();
      await this.initializeTicketSettings();
      await this.initializeStaffSettings();

      logger.info("✅ All default documents initialized successfully");
    } catch (error) {
      logger.error("❌ Failed to initialize default documents:", error);
      throw error;
    }
  }

  private async initializeAISettings(): Promise<void> {
    try {
      const existingSettings = await AISettings.findById("ai-settings");
      if (!existingSettings) {
        const defaultAISettings = new AISettings({
          _id: "ai-settings",
          enabled: false,
          provider: "openai",
          apiKey: "",
          model: "gpt-5-mini",
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

        await defaultAISettings.save();
        logger.info("✅ AI Settings document created");
      } else {
        logger.info("✅ AI Settings document already exists");
      }
    } catch (error) {
      logger.error("❌ Failed to initialize AI Settings:", error);
      throw error;
    }
  }

  private async initializeModerationSettings(): Promise<void> {
    try {
      const existingSettings = await ModerationSettings.findById(
        "moderation-settings"
      );
      if (!existingSettings) {
        const defaultModerationSettings = new ModerationSettings({
          _id: "moderation-settings",
          enabled: false,
          autoModeration: false,
          logChannelId: "",
          muteRoleId: "",
          warnThreshold: 3,
          banThreshold: 5,
          actions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await defaultModerationSettings.save();
        logger.info("✅ Moderation Settings document created");
      } else {
        logger.info("✅ Moderation Settings document already exists");
      }
    } catch (error) {
      logger.error("❌ Failed to initialize Moderation Settings:", error);
      throw error;
    }
  }

  private async initializeGiveawaySettings(): Promise<void> {
    try {
      const existingSettings = await GiveawaySettings.findById(
        "giveaway-settings"
      );
      if (!existingSettings) {
        const defaultGiveawaySettings = new GiveawaySettings({
          _id: "giveaway-settings",
          enabled: false,
          logChannelId: "",
          defaultDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
          maxWinners: 1,
          requiredRoleIds: [],
          bannedUserIds: [],
          totalGiveaways: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await defaultGiveawaySettings.save();
        logger.info("✅ Giveaway Settings document created");
      } else {
        logger.info("✅ Giveaway Settings document already exists");
      }
    } catch (error) {
      logger.error("❌ Failed to initialize Giveaway Settings:", error);
      throw error;
    }
  }

  private async initializeTicketSettings(): Promise<void> {
    try {
      const existingSettings = await TicketSettings.findById("ticket-settings");
      if (!existingSettings) {
        const defaultTicketSettings = new TicketSettings({
          _id: "ticket-settings",
          enabled: false,
          categoryId: "",
          logChannelId: "",
          supportRoleIds: [],
          bannedUserIds: [],
          totalTickets: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await defaultTicketSettings.save();
        logger.info("✅ Ticket Settings document created");
      } else {
        logger.info("✅ Ticket Settings document already exists");
      }
    } catch (error) {
      logger.error("❌ Failed to initialize Ticket Settings:", error);
      throw error;
    }
  }

  private async initializeStaffSettings(): Promise<void> {
    try {
      const existingStaff = await Staff.findById("staff-settings");
      if (!existingStaff) {
        const defaultStaffSettings = new Staff({
          _id: "staff-settings",
          members: [],
          roles: [],
          permissions: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await defaultStaffSettings.save();
        logger.info("✅ Staff Settings document created");
      } else {
        logger.info("✅ Staff Settings document already exists");
      }
    } catch (error) {
      logger.error("❌ Failed to initialize Staff Settings:", error);
      throw error;
    }
  }
}

export const databaseInitService = new DatabaseInitService();
