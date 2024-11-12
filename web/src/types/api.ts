export interface Role {
  id: number;
  name: string;
  level: number;
}

export interface CurrentUser {
  id: number;
  name: string;
  username: string;
  email: string;
  bio: string;
  isActive: boolean;
  role: Role;
  createdAt: Date;
}
