import { Experience, User } from "@advanced-react/server/database/schema";

type ExperienceWithUser = Experience & {
	user: User
}

type ExperienceWithCommentCount = Experience & {
	commentsCount: number
}

export type ExperienceForDetails = ExperienceWithUser
	& ExperienceWithUserContext
	& ExperienceWithCommentCount;

export type ExperienceWithUserContext = Experience & {
	isAttending: boolean;
}

export type ExperienceForList = ExperienceWithUser
	& ExperienceWithCommentCount
	& ExperienceWithUserContext;