export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser {
  discordId: string;
  discordUsername: string;
  discordAvatar: string;
  discordAccessToken: string;
  discordRefreshToken: string;
  discordTokenExpiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;
}
