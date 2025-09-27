export interface IStaffMember {
  userId: string;
  addedBy: string;
  addedAt: Date;
  lastActive?: Date;
  isActive: boolean;
  notes?: string;
}

export interface IStaff {
  _id?: string;
  guildId: string;
  staffMembers: IStaffMember[];
  collectTicketMessages: boolean;
  collectTicketCloses: boolean;
  staffChannelId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
