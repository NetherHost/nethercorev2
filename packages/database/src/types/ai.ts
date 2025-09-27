export enum AIProvider {
  OPENAI = "openai",
  // ANTHROPIC = "anthropic",
}

export enum GeneralModels {
  GPT_5 = "gpt-5", // smart model
  GPT_5_MINI = "gpt-5-mini", // this will be default model
  GPT_5_NANO = "gpt-5-nano", // fastest model
  GPT_4_1 = "gpt-4.1", // cheaper but less smart as gpt5
  GPT_4_1_MINI = "gpt-4.1-mini", // smaller version of 4.1
  GPT_4_1_NANO = "gpt-4.1-nano", // fastest version of gpt4.1
}

// experimental preview models with more recent knowledge
export enum CanaryModels {
  GPT_5_MINI_CANARY = "gpt-5-mini-2025-08-07",
  GPT_5_NANO_CANARY = "gpt-5-nano-2025-08-07",
  GPT_4_1_NANO_CANARY = "gpt-4.1-nano-2025-04-14",
  GPT_4_1_MINI_CANARY = "gpt-4.1-mini-2025-04-14",
  GPT_4_1_CANARY = "gpt-4.1-2025-04-14",
}

// signifncantly more expensive but provide more reliable results
export enum ReasoningModels {
  O3 = "o3", // smartest reasoning model
  O4_MINI = "o4-mini", // smaller, faster
  O1_PRO = "o1-pro", // maximum compute model, for very complex tasks
  O1 = "o1",
  O3_MINI = "o3-mini",
  O4_MINI_DEEP_RESEARCH = "o4-mini-deep-research",
}

export interface IAIBan {
  userId: string;
  moderator: string;
  reason?: string;
  bannedAt: Date;
}

export interface IRateLimitConfig {
  userId: string;
  requestsPerUser: number; // max number of requests allowed per user within the threshold period
  threshold: number; // time window for rate limiting in sec
}

export interface IAIConfig {
  _id?: string;
  enabled: boolean; // enabled or disabled
  provider: AIProvider; // openai, unless we add support for other providers later
  apiKey: string; // api key for the provider
  model: GeneralModels | ReasoningModels | CanaryModels; // model to use for the ai
  maxTokens: number; // max tokens the ai can use in its response
  temperature: number; // temperature is how random the ai is
  topP?: number; // top p is the probability of the ai selecting the next token
  presencePenalty?: number;
  frequencyPenalty?: number; // frequency penalty is how much the ai is penalized for using the same token too often
  systemPrompt?: string; // system prompt is the prompt that the ai will use to generate its response
  maxResponseLength?: number; // max response length is the maximum length of the ai response
  allowedChannelIds: string[]; // allowed channel ids is the ids of the channels that the ai is allowed to use
  allowedRoleIds: string[];
  rateLimits?: IRateLimitConfig[];
  bannedUsers?: IAIBan[];
  createdAt?: Date;
  updatedAt?: Date;
}
