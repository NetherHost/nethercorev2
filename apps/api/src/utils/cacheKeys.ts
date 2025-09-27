export const CacheKeys = {
  user: (userId: string) => `user:${userId}`,

  health: () => "health:status",

  botStats: () => "bot:stats",

  discordUser: (tokenHash: string) => `discord:user:${tokenHash}`,

  session: (sessionId: string) => `session:${sessionId}`,
} as const;

export const CacheTTL = {
  USER: 300, // 5 min
  HEALTH: 30, // 30 sec
  BOT_STATS: 10, // 10 sec
  DISCORD_USER: 300, // 5 min
  SESSION: 86400, // 24 h
} as const;
