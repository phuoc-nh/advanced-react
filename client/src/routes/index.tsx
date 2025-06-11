import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import InfiniteScroll from '@/features/shared/components/InfiniteScroll'
import ExperienceList from '@/features/experiences/components/ExperienceList'
import { trpc } from '@/router'

export const Route = createFileRoute('/')({
	component: Index,
	loader: async ({ context: { trpcQueryUtils } }) => {
		await trpcQueryUtils.experiences.feed.prefetchInfinite({})
	},
})

// usually fetch happens after component mounts
// We can use loader to prefetch data before component mounts
//  this happens when user clicks on the link to this route

function Index() {
	// const experienceQuery = trpc.experiences.feed.useQuery({})
	const [{ pages }, experienceQuery] = trpc.experiences.feed.useSuspenseInfiniteQuery( // tell react that this query is already called from route loader
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
				experiences={pages.flatMap((page) => page.experiences) ?? []}
				isLoading={experienceQuery.isFetchingNextPage}
				noExperiencesMessage="No experiences found."
			/>
		</InfiniteScroll>

	)
}