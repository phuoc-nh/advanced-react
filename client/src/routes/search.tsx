import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { experienceFiltersSchema } from '@advanced-react/shared/schema/experience'
import { trpc } from '@/router'
import InfiniteScroll from '@/features/shared/components/InfiniteScroll'
import ExperienceList from '@/features/experiences/components/ExperienceList'
import { ExperienceFilter } from '@/features/experiences/components/ExperienceFilter'

export const Route = createFileRoute('/search')({
	component: SearchPage,
	validateSearch: experienceFiltersSchema
})

function SearchPage() {
	const search = Route.useSearch()
	const navigate = useNavigate({ from: Route.fullPath })

	const experienceQuery = trpc.experiences.search.useInfiniteQuery(search, {
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		enabled: !!search.q
	})

	return <main>
		<ExperienceFilter onFiltersChange={(filters) => navigate({ search: filters })} initialFilters={search} />
		<InfiniteScroll
			hasNextPage={experienceQuery.hasNextPage}
			onLoadMore={experienceQuery.fetchNextPage}
		>
			<ExperienceList
				experiences={experienceQuery.data?.pages.flatMap((page) => page.experiences) ?? []}
				isLoading={experienceQuery.isLoading || experienceQuery.isFetchingNextPage}
				noExperiencesMessage={search.q ? `No experiences found for "${search.q}".` : 'Search to find experiences.'}
			/>
		</InfiniteScroll>
	</main>
}
