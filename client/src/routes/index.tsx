import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import InfiniteScroll from '@/features/shared/components/InfiniteScroll'
import ExperienceList from '@/features/experiences/components/ExperienceList'
import { trpc } from '@/router'

export const Route = createFileRoute('/')({
	component: Index,
})

function Index() {
	// const experienceQuery = trpc.experiences.feed.useQuery({})
	const experienceQuery = trpc.experiences.feed.useInfiniteQuery(
		{},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	)


	return (
		// <ExperienceList
		//   experiences={experienceQuery.data?.experiences ?? []}
		//   isLoading={experienceQuery.isLoading}
		// />
		<InfiniteScroll
			hasNextPage={experienceQuery.hasNextPage}
			onLoadMore={experienceQuery.fetchNextPage}
		>
			<ExperienceList
				experiences={experienceQuery.data?.pages.flatMap((page) => page.experiences) ?? []}
				isLoading={experienceQuery.isLoading}
				noExperiencesMessage="No experiences found."
			/>
		</InfiniteScroll>

	)
}