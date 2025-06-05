import { Experience, User } from "@advanced-react/server/database/schema";

type ExperienceWithUser = Experience & {
	user: User
}

type ExperienceWithCommentCount = Experience & {
	commentsCount: number
}

export type ExperienceForList = ExperienceWithUser & ExperienceWithCommentCount