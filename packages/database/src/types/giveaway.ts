import { IBannedUser } from "./shared";

export interface IGiveawaySettings {
  _id?: string;
  enabled: boolean;
  logChannelId?: string;
  defaultDuration: number; //ms
  maxWinners: number;
  requiredRoleIds?: string[];
  bannedUserIds?: string[];
  totalGiveaways: number;
  createdAt?: Date;
  updatedAt?: Date;
}
