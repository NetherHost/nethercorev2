export enum ModerationAction {
  BAN = "ban",
  UNBAN = "unban",
  MUTE = "mute",
  UNMUTE = "unmute",
  WARN = "warn",
  NOTE = "note",
}

export interface IModerationAction {
  userId: string;
  moderator: string;
  action: ModerationAction;
  reason?: string;
  actionAt: Date;
}

export interface IModerationSettings {
  _id?: string;
  enabled: boolean;
  autoModeration: boolean;
  logChannelId?: string;
  muteRoleId?: string;
  warnThreshold: number;
  banThreshold: number;
  actions: IModerationAction[];
  createdAt?: Date;
  updatedAt?: Date;
}
