import * as React from 'react'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { z } from 'zod'
import { isTRPCClientError, trpc } from '@/router'
import InfiniteScroll from '@/features/shared/components/InfiniteScroll'
import { UserList } from '@/features/users/components/UserList'
import { UserFollowButton } from '@/features/users/components/UserFollowButton'

export const Route = createFileRoute('/experiences/$experienceId/attendees')({
	params: {
		parse: (params) => ({
			experienceId: z.coerce.number().parse(params.experienceId),
		}),
	},
	component: ExperienceAttendeesPage,
	loader: async ({ params, context: { trpcQueryUtils } }) => {
		try {
			await Promise.all([
				trpcQueryUtils.experiences.byId.ensureData({
					id: params.experienceId,
				}),
				trpcQueryUtils.users.experienceAttendees.prefetchInfinite({
					experienceId: params.experienceId,
				}),
			]);
		} catch (error) {
			if (isTRPCClientError(error) && error.data?.code === 'NOT_FOUND') {
				throw notFound();
			}

			throw error;
		}
	},
})

function ExperienceAttendeesPage() {
	const { experienceId } = Route.useParams();

	const [experience] = trpc.experiences.byId.useSuspenseQuery({
		id: experienceId,
	});

	const [{ pages }, attendeesQuery] =
		trpc.users.experienceAttendees.useSuspenseInfiniteQuery(
			{ experienceId },
			{
				getNextPageParam: (lastPage: any) => lastPage.nextCursor,
			},
		);

	const totalAttendees = pages[0].attendeesCount;


	return <main className="space-y-4">
		<h1 className="text-2xl font-bold">Attendees for "{experience.title}"</h1>
		<div className="space-y-2">
			<h2 className="font-medium">Attendees ({totalAttendees})</h2>
			<InfiniteScroll onLoadMore={attendeesQuery.fetchNextPage}>
				<UserList
					users={pages.flatMap((page) => page.attendees)}
					isLoading={attendeesQuery.isFetchingNextPage}
					// this is called Open/Close principle
					// Open to extension, close to modification
					// Right component is flexible to be changed without modifying the UserList component
					rightComponent={(user) => (
						<UserFollowButton targetUserId={user.id} isFollowing={user.isFollowing} />
					)}
				/>
			</InfiniteScroll>
		</div>
	</main>
}
