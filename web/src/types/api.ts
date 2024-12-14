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
  avatarID: string;
  avatarURL: string;
  isActive: boolean;
  role: Role;
  createdAt: Date;
}

export interface UserOverview {
  id: number;
  name: string;
  username: string;
  avatarID: string;
  avatarURL: string;
}

export interface CommunityOverview {
  id: number;
  name: string;
  slug: string;
  thumbnailID: string;
  thumbnailURL: string;
}

export type VoteValue = 1 | 0 | -1;

export interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  communityID: number;
  community: CommunityOverview;
  authorID: number;
  author: UserOverview;
  numComments: number;
  votes: number;
  userVote: VoteValue;
  createdAt: Date;
}
