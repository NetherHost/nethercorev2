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
  members: IStaffMember[];
  roles: string[];
  permissions: Record<string, boolean>;
  createdAt?: Date;
  updatedAt?: Date;
}
