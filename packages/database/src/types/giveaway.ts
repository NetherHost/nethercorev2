export interface IGiveawayBan {
  userId: string;
  moderator: string;
  reason?: string;
  bannedAt: Date;
}

export interface IGiveawaySettings {
  _id?: string;
  guildId: string;
  totalGiveaways: number;
  access: "ENABLED" | "DISABLED";
  defaultDuration: number; //ms
  defaultWinnerCount: number;
  autoReroll: boolean;
  requiredRoleIds?: string[];
  allowedRoleIds?: string[];
  bannedUsers?: IGiveawayBan[];
  createdAt?: Date;
  updatedAt?: Date;
}
