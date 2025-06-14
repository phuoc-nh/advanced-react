import ExperienceList from '@/features/experiences/components/ExperienceList';
import { ErrorComponent } from '@/features/shared/components/ErrorComponent';
import InfiniteScroll from '@/features/shared/components/InfiniteScroll';
import Card from '@/features/shared/components/ui/Card';
import { UserAvatar } from '@/features/users/components/UserAvatar';
import { UserProfileButton } from '@/features/users/components/UserProfileButton';
import { UserProfileHostStats } from '@/features/users/components/UserProfileHostStats';
import { UserProfileStats } from '@/features/users/components/UserProfileStats';
import { isTRPCClientError, trpc } from '@/router';
import { createFileRoute, notFound } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/users/$userId/')({
	params: {
		parse: (params) => ({
			userId: z.coerce.number().parse(params.userId),
		})
	},
	component: UserPage,
	loader: async ({ params, context: { trpcQueryUtils } }) => {
		try {
			await trpcQueryUtils.users.byId.ensureData({
				id: params.userId,
			})
		} catch (error) {
			if (isTRPCClientError(error) && error.data?.code === 'NOT_FOUND') {
				throw notFound();
			}

			throw error;
		}
	},
})

function UserPage() {
	const { userId } = Route.useParams()
	const [user] = trpc.users.byId.useSuspenseQuery({
		id: userId,
	})

	const experiencesQuery = trpc.experiences.byUserId.useInfiniteQuery({
		id: user.id,
	}, {
		getNextPageParam: (lastPage) => lastPage.nextCursor,
	})

	if (experiencesQuery.error) {
		return <ErrorComponent></ErrorComponent>
	}

	return (
		<main className="space-y-4">
			<Card className="flex flex-col items-center gap-4 px-0">
				<UserAvatar user={user} showName={false} className="h-24 w-24" />
				<h1 className="text-3xl font-bold">{user.name}</h1>
				{user.bio && (
					<p className="text-neutral-600 dark:text-neutral-400">{user.bio}</p>
				)}
				<UserProfileStats user={user} />
				<UserProfileButton user={user} />
			</Card>

			<UserProfileHostStats user={user} />

			<h2 className="text-2xl font-bold">Experiences</h2>
			<InfiniteScroll onLoadMore={experiencesQuery.fetchNextPage}>
				<ExperienceList
					experiences={
						experiencesQuery.data?.pages.flatMap((page) => page.experiences) ??
						[]
					}
					isLoading={
						experiencesQuery.isLoading || experiencesQuery.isFetchingNextPage
					}
				/>
			</InfiniteScroll>
		</main>
	);
}
