import { Comment, Experience, User } from "@advanced-react/server/database/schema"

export type CommentWithUser = Comment & {
	user: User
}

export type CommentWithExperience = Comment & {
	experience: Experience
}

export type CommentForList = CommentWithUser & CommentWithExperience