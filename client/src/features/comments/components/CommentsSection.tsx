import { trpc } from '@/trpc'
import { Experience } from '@advanced-react/server/database/schema'
import React from 'react'
import CommentList from './CommentList'
import CommentCreateForm from './CommentCreateForm'

type CommentsSectionProps = {
	experienceId: Experience['id']
	commentsCount: number
}

export default function CommentsSection({ experienceId, commentsCount }: CommentsSectionProps) {
	const commentsQuery = trpc.comments.byExperienceId.useQuery({
		experienceId,
	}, {
		enabled: commentsCount > 0,
	})

	if (commentsQuery.error) {
		return <div>Error loading comments</div>
	}

	return (
		<div className='space-y-4'>
			<h3 className='font-semibold'>
				Comments ({commentsCount})
			</h3>

			<CommentCreateForm experienceId={experienceId} />
			<CommentList
				comments={commentsQuery.data ?? []}
				isLoading={commentsQuery.isLoading}
			/>
		</div>
	)
}
