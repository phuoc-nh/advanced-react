import { User } from "@advanced-react/server/database/schema";

type UserWithFollowCounts = User & {
  followersCount: number;
  followingCount: number;
};

type UserWithHostedExperiences = User & {
  hostedExperiencesCount: number;
};

export type UserForList = User & UserWithUserContext;

export type UserWithUserContext = User & {
  isFollowing: boolean;
};

export type UserForDetails = UserWithHostedExperiences & UserWithFollowCounts & UserWithUserContext;

// A sense of Interface segmentation being used here
// Only define necessary properties for each type
// Do not wrap types in a single type declaration, this could lead to confusion and unnecessary types in components