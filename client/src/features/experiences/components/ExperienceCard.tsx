import Card from '@/features/shared/components/ui/Card'
import React from 'react'
import { ExperienceForList } from '../types'
import { LinkIcon, MessageSquare } from 'lucide-react'
import Link from '@/features/shared/components/ui/Link'
import { Button } from '@/features/shared/components/ui/Button'

type ExperienceCardProps = {
	experience: ExperienceForList
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
	return (
		<Card className='overflow-hidden p-0'>
			<ExperienceCardMedia experience={experience} />

			<div className='p-4 w-full space-y-2'>
				<ExperienceCardHeader experience={experience} />
				<ExperienceCardFooter experience={experience} />
				<ExperienceCardMeta experience={experience} />
				<ExperienceCardUserMetricButton experience={experience} />
				{/* <CommentsSection experienceId={experience.id} commentsCount={experience.commentsCount} /> */}
			</div>

		</Card>
	)
}

type ExperienceCardMediaProps = Pick<ExperienceCardProps, 'experience'>

function ExperienceCardMedia({ experience }: ExperienceCardMediaProps) {
	if (!experience.imageUrl) {
		return null
	}

	return (
		<div className='aspect-video w-full'>
			<img src={experience.imageUrl} alt={experience.title} />
		</div>
	)
}


type ExperienceCardHeaderProps = Pick<ExperienceCardProps, 'experience'>

function ExperienceCardHeader({ experience }: ExperienceCardHeaderProps) {

	return (
		<div>
			<div>{experience.user.name}</div>
			<Link
				to="/experiences/$experienceId"
				params={{ experienceId: experience.id }}
			>
				<h2 className=' text-xl font-bold'>
					{experience.title}
				</h2>
			</Link>
		</div>
	)
}

type ExperienceCardFooterProps = Pick<ExperienceCardProps, 'experience'>

function ExperienceCardFooter({ experience }: ExperienceCardFooterProps) {
	return (
		<p>
			{experience.content}
		</p>
	)
}
type ExperienceCardMetaProps = Pick<ExperienceCardProps, 'experience'>

function ExperienceCardMeta({ experience }: ExperienceCardMetaProps) {
	return (
		<div className='flex items-center gap-4 text-neutral-500 dark:text-neutral-400'>
			<time >{new Date(experience.scheduledAt).toLocaleDateString()} </time>
			{experience.url && (
				<div className='flex items-center gap-2'>
					<LinkIcon size={16} className='text-secondary-500 dark:text-primary-500'></LinkIcon>
					<a href={experience.url} target='_blank' rel='noopener noreferrer' className='text-secondary-500 dark:text-primary-500 hover:underline'>
						Event details
					</a>

				</div>
			)}
		</div>
	)
}

type ExperienceCardUserMetricButtonProps = Pick<ExperienceCardProps, 'experience'>

function ExperienceCardUserMetricButton({ experience }: ExperienceCardUserMetricButtonProps) {
	return (
		// <div>
		// 	<MessageSquare className='h-5 w-5'></MessageSquare>
		// 	<span>{experience.commentsCount}</span>
		// </div>
		<div className="flex items-center gap-2">
			<Button variant="link" asChild>
				<Link
					to="/experiences/$experienceId"
					params={{ experienceId: experience.id }}
					variant="ghost"
				>
					<MessageSquare className="h-5 w-5" />
					<span>{experience.commentsCount}</span>
				</Link>
			</Button>
		</div>
	)
}