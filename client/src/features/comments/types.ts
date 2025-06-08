import { Comment, User } from "@advanced-react/server/database/schema"

export type CommentWithUser = Comment & {
	user: User
}

export type CommentForList = CommentWithUser