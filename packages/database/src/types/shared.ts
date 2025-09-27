export interface IBannedUser {
  userId: string;
  moderatorId: string;
  reason?: string;
  bannedAt: Date;
}
