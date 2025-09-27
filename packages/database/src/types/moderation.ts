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
