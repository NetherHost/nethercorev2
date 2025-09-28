import { Request, Response, NextFunction } from "express";
import { IAIConfig, AIProvider, GeneralModels, ReasoningModels, CanaryModels } from "@nethercore/database";

export const validateAIConfig = (req: Request, res: Response, next: NextFunction): void => {
  const config: Partial<IAIConfig> = req.body;

  if (config.enabled !== undefined && typeof config.enabled !== "boolean") {
    res.status(400).json({
      success: false,
      message: "enabled must be a boolean",
    });
    return;
  }

  if (config.provider && !Object.values(AIProvider).includes(config.provider)) {
    res.status(400).json({
      success: false,
      message: "Invalid provider",
    });
    return;
  }

  if (config.model) {
    const validModels = [
      ...Object.values(GeneralModels),
      ...Object.values(ReasoningModels),
      ...Object.values(CanaryModels),
    ];
    
    if (!validModels.includes(config.model)) {
      res.status(400).json({
        success: false,
        message: "Invalid model",
      });
      return;
    }
  }

  if (config.maxTokens !== undefined) {
    if (typeof config.maxTokens !== "number" || config.maxTokens < 1) {
      res.status(400).json({
        success: false,
        message: "maxTokens must be a number greater than 0",
      });
      return;
    }
  }

  if (config.temperature !== undefined) {
    if (typeof config.temperature !== "number" || config.temperature < 0 || config.temperature > 2) {
      res.status(400).json({
        success: false,
        message: "temperature must be a number between 0 and 2",
      });
      return;
    }
  }

  if (config.topP !== undefined) {
    if (typeof config.topP !== "number" || config.topP < 0 || config.topP > 1) {
      res.status(400).json({
        success: false,
        message: "topP must be a number between 0 and 1",
      });
      return;
    }
  }

  if (config.presencePenalty !== undefined) {
    if (typeof config.presencePenalty !== "number" || config.presencePenalty < -2 || config.presencePenalty > 2) {
      res.status(400).json({
        success: false,
        message: "presencePenalty must be a number between -2 and 2",
      });
      return;
    }
  }

  if (config.frequencyPenalty !== undefined) {
    if (typeof config.frequencyPenalty !== "number" || config.frequencyPenalty < -2 || config.frequencyPenalty > 2) {
      res.status(400).json({
        success: false,
        message: "frequencyPenalty must be a number between -2 and 2",
      });
      return;
    }
  }

  if (config.maxResponseLength !== undefined) {
    if (typeof config.maxResponseLength !== "number" || config.maxResponseLength < 1) {
      res.status(400).json({
        success: false,
        message: "maxResponseLength must be a number greater than 0",
      });
      return;
    }
  }

  if (config.allowedChannelIds && !Array.isArray(config.allowedChannelIds)) {
    res.status(400).json({
      success: false,
      message: "allowedChannelIds must be an array",
    });
    return;
  }

  if (config.allowedRoleIds && !Array.isArray(config.allowedRoleIds)) {
    res.status(400).json({
      success: false,
      message: "allowedRoleIds must be an array",
    });
    return;
  }

  next();
};

export const validateBannedUser = (req: Request, res: Response, next: NextFunction): void => {
  const { userId, moderator, reason } = req.body;

  if (!userId || typeof userId !== "string") {
    res.status(400).json({
      success: false,
      message: "userId is required and must be a string",
    });
    return;
  }

  if (!moderator || typeof moderator !== "string") {
    res.status(400).json({
      success: false,
      message: "moderator is required and must be a string",
    });
    return;
  }

  if (reason !== undefined && typeof reason !== "string") {
    res.status(400).json({
      success: false,
      message: "reason must be a string",
    });
    return;
  }

  next();
};

export const validateRateLimit = (req: Request, res: Response, next: NextFunction): void => {
  const { userId, requestsPerUser, threshold } = req.body;

  if (!userId || typeof userId !== "string") {
    res.status(400).json({
      success: false,
      message: "userId is required and must be a string",
    });
    return;
  }

  if (typeof requestsPerUser !== "number" || requestsPerUser < 1) {
    res.status(400).json({
      success: false,
      message: "requestsPerUser must be a number greater than 0",
    });
    return;
  }

  if (typeof threshold !== "number" || threshold < 1) {
    res.status(400).json({
      success: false,
      message: "threshold must be a number greater than 0",
    });
    return;
  }

  next();
};

export const validateChannelIds = (req: Request, res: Response, next: NextFunction): void => {
  const { channelIds } = req.body;

  if (!Array.isArray(channelIds)) {
    res.status(400).json({
      success: false,
      message: "channelIds must be an array",
    });
    return;
  }

  if (!channelIds.every(id => typeof id === "string")) {
    res.status(400).json({
      success: false,
      message: "All channel IDs must be strings",
    });
    return;
  }

  next();
};

export const validateRoleIds = (req: Request, res: Response, next: NextFunction): void => {
  const { roleIds } = req.body;

  if (!Array.isArray(roleIds)) {
    res.status(400).json({
      success: false,
      message: "roleIds must be an array",
    });
    return;
  }

  if (!roleIds.every(id => typeof id === "string")) {
    res.status(400).json({
      success: false,
      message: "All role IDs must be strings",
    });
    return;
  }

  next();
};

export const validateGuildId = (req: Request, res: Response, next: NextFunction): void => {
  const { guildId } = req.params;

  if (!guildId || typeof guildId !== "string") {
    res.status(400).json({
      success: false,
      message: "Valid guild ID is required",
    });
    return;
  }

  next();
};

export const validateUserId = (req: Request, res: Response, next: NextFunction): void => {
  const { userId } = req.params;

  if (!userId || typeof userId !== "string") {
    res.status(400).json({
      success: false,
      message: "Valid user ID is required",
    });
    return;
  }

  next();
};
