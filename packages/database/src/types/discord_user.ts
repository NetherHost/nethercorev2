export interface IDiscordUser {
  userId: string;
  isStaff: boolean;
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
    joinedAt: Date;
    leftAt: Date;
    lastActiveAt: Date;
  };
}
