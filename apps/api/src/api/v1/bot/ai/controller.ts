import { Request, Response } from "express";
import { aiSettingsService } from "./service";
import { IAIConfig } from "@nethercore/database";

export const getAISettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const settings = await aiSettingsService.getAISettings();

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching AI settings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createAISettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const config: Partial<IAIConfig> = req.body;

    const settings = await aiSettingsService.createAISettings(config);

    res.status(201).json({
      success: true,
      data: settings,
      message: "AI settings created successfully",
    });
  } catch (error) {
    console.error("Error creating AI settings:", error);

    if (error instanceof Error && error.message.includes("already exist")) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateAISettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const config: Partial<IAIConfig> = req.body;

    const settings = await aiSettingsService.updateAISettings(config);

    res.json({
      success: true,
      data: settings,
      message: "AI settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating AI settings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteAISettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deleted = await aiSettingsService.deleteAISettings();

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "AI settings not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "AI settings deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting AI settings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addBannedUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, moderator, reason } = req.body;

    if (!userId || !moderator) {
      res.status(400).json({
        success: false,
        message: "User ID and moderator are required",
      });
      return;
    }

    const settings = await aiSettingsService.addBannedUser({
      userId,
      moderator,
      reason,
    });

    res.json({
      success: true,
      data: settings,
      message: "User banned from AI successfully",
    });
  } catch (error) {
    console.error("Error adding banned user:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removeBannedUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const settings = await aiSettingsService.removeBannedUser(userId);

    res.json({
      success: true,
      data: settings,
      message: "User unbanned from AI successfully",
    });
  } catch (error) {
    console.error("Error removing banned user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateRateLimit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, requestsPerUser, threshold } = req.body;

    if (!userId || requestsPerUser === undefined || threshold === undefined) {
      res.status(400).json({
        success: false,
        message: "User ID, requests per user, and threshold are required",
      });
      return;
    }

    const settings = await aiSettingsService.updateRateLimit({
      userId,
      requestsPerUser,
      threshold,
    });

    res.json({
      success: true,
      data: settings,
      message: "Rate limit updated successfully",
    });
  } catch (error) {
    console.error("Error updating rate limit:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removeRateLimit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const settings = await aiSettingsService.removeRateLimit(userId);

    res.json({
      success: true,
      data: settings,
      message: "Rate limit removed successfully",
    });
  } catch (error) {
    console.error("Error removing rate limit:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateAllowedChannels = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { channelIds } = req.body;

    if (!Array.isArray(channelIds)) {
      res.status(400).json({
        success: false,
        message: "Channel IDs array is required",
      });
      return;
    }

    const settings = await aiSettingsService.updateAllowedChannels(channelIds);

    res.json({
      success: true,
      data: settings,
      message: "Allowed channels updated successfully",
    });
  } catch (error) {
    console.error("Error updating allowed channels:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateAllowedRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { roleIds } = req.body;

    if (!Array.isArray(roleIds)) {
      res.status(400).json({
        success: false,
        message: "Role IDs array is required",
      });
      return;
    }

    const settings = await aiSettingsService.updateAllowedRoles(roleIds);

    res.json({
      success: true,
      data: settings,
      message: "Allowed roles updated successfully",
    });
  } catch (error) {
    console.error("Error updating allowed roles:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
