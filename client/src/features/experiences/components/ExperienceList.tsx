import Spinner from '@/features/shared/components/ui/Spinner'
import { Experience } from '@advanced-react/server/database/schema'
import React from 'react'
import ExperienceCard from './ExperienceCard'
import { ExperienceForList } from '../type'

type ExperienceListProps = {
	experiences: ExperienceForList[]
	isLoading?: boolean
	noExperiencesMessage?: string
}

export default function ExperienceList({ experiences, isLoading, noExperiencesMessage = 'No experiences found.' }: ExperienceListProps) {
	return (
		<div className='space-y-4'>
			{experiences.map((experience) => (
				<ExperienceCard key={experience.id} experience={experience} />
			))}
			{isLoading && (
				<div className='flex justify-center'>
					<Spinner></Spinner>
				</div>
			)}

			{!isLoading && experiences.length === 0 && (
				<p className='text-center text-neutral-500'>
					{noExperiencesMessage}
				</p>
			)}


		</div>
	)
}
