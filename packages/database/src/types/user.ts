export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser {
  id: string;
  discord_id: string;
  discord_username: string;
  discord_avatar: string;
  discord_access_token: string;
  discord_refresh_token: string;
  discord_token_expires_at: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface IUserInput {
  discord_id: string;
  discord_username: string;
  discord_avatar: string;
  discord_access_token: string;
  discord_refresh_token: string;
  discord_token_expires_at: string;
  role?: UserRole;
}

export interface IUserUpdate {
  discord_username?: string;
  discord_avatar?: string;
  discord_access_token?: string;
  discord_refresh_token?: string;
  discord_token_expires_at?: string;
  role?: UserRole;
}
