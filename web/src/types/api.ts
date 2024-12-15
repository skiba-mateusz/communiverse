export interface Role {
  id: number;
  name: string;
  level: number;
}

export interface BaseUser {
  id: number;
  name: string;
  username: string;
  avatarID: string;
  avatarURL: string;
}

export interface UserOverview extends BaseUser {}

export interface UserSummary extends BaseUser {
  bio: string;
  createdAt: string;
}

export interface UserDetails extends BaseUser {
  email: string;
  bio: string;
  isActive: boolean;
  role: Role;
  createdAt: string;
}

export interface BaseCommunity {
  id: number;
  name: string;
  slug: string;
  thumbnailID: string;
  thumbnailURL: string;
}

export interface CommunityOverview extends BaseCommunity {}

export interface CommunitySummary extends BaseCommunity {
  description: string;
  role: Role;
  numMembers: number;
  createdAt: string;
}

export interface CommunityDetails extends BaseCommunity {
  description: string;
  userID: number;
  user: UserSummary;
  role: Role;
  numMembers: number;
  numPosts: number;
  createdAt: string;
}

export type VoteValue = 1 | 0 | -1;

export interface BasePost {
  id: number;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  communityID: number;
  authorID: number;
  numComments: number;
  votes: number;
  userVote: VoteValue;
  createdAt: string;
}

export interface PostSummary extends BasePost {
  community: CommunityOverview;
  author: UserOverview;
}

export interface PostDetails extends BasePost {
  community: CommunitySummary;
  author: UserSummary;
}
