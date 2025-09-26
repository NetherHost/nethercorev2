export interface ITicketBan {
  userId: string;
  moderatorId: string;
  reason?: string;
  bannedAt: Date;
}

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
  ticketBanList?: ITicketBan[];
  createdAt?: Date;
  updatedAt?: Date;
}
