import { IBannedUser } from "./shared";

export interface IAutoClose {
  enabled: boolean;
  interval?: number; //ms
}

export interface IClaims {
  enabled: boolean;
  autoClaimOnMessage: boolean;
  onlyOneClaimer: boolean;
}

export interface ITicketStats {
  totalTicketsResolved: number;
  averageResponseTime: number; //ms
  responseTimeLastUpdated?: Date;
  totalTicketsWithResponse: number;
}

export interface ITicketSettings {
  _id?: string;
  enabled: boolean;
  categoryId?: string;
  logChannelId?: string;
  supportRoleIds?: string[];
  bannedUserIds?: string[];
  totalTickets?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
