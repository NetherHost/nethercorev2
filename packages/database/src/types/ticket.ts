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
  guildId: string;
  access: "EVERYONE" | "CLIENTS_ONLY" | "CLOSED";
  ticketLimit: number;
  totalTickets?: number;
  autoClose: IAutoClose;
  claims: IClaims;
  stats: ITicketStats;
  ticketBanList?: IBannedUser[];
  createdAt?: Date;
  updatedAt?: Date;
}
