import { Experience, User } from "@advanced-react/server/database/schema";

type ExperienceWithUser = Experience & {
	user: User
}

type ExperienceWithCommentCount = Experience & {
	commentsCount: number
}

type ExperienceWithAttendeesCount = Experience & {
	attendeesCount: number
}

type ExperienceWithAttendees = Experience & {
	attendees: User[]
}

export type ExperienceForDetails = ExperienceWithUser
	& ExperienceWithUserContext
	& ExperienceWithCommentCount
	& ExperienceWithAttendees
	& ExperienceWithAttendeesCount

export type ExperienceWithUserContext = Experience & {
	isAttending: boolean;
}

export type ExperienceForList = ExperienceWithUser
	& ExperienceWithCommentCount
	& ExperienceWithUserContext
	& ExperienceWithAttendeesCount;