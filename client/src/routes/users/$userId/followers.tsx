import * as React from 'react'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { z } from 'zod'
import { isTRPCClientError, trpc } from '@/router';
import InfiniteScroll from '@/features/shared/components/InfiniteScroll';
import { UserList } from '@/features/users/components/UserList';
import { UserFollowButton } from '@/features/users/components/UserFollowButton';

export const Route = createFileRoute('/users/$userId/followers')({
	params: {
		parse: (params) => ({
			userId: z.coerce.number().parse(params.userId),
		})
	},
	component: UserFollowersPage,
	loader: async ({ context: { trpcQueryUtils }, params }) => {
		try {
			await trpcQueryUtils.users.followers.prefetchInfinite({
				id: params.userId,
			});
		} catch (error) {
			if (isTRPCClientError(error) && error.data?.code === "NOT_FOUND") {
				throw notFound();
			}

			throw error;
		}
	},
})

function UserFollowersPage() {
	const { userId } = Route.useParams();

	const [{ pages }, followersQuery] =
		trpc.users.followers.useSuspenseInfiniteQuery(
			{ id: userId },
			{
				getNextPageParam: (lastPage: any) => lastPage.nextCursor,
			},
		);

	const totalFollowers = pages[0].followersCount;
	return <main className="space-y-4">
		<h1 className="text-2xl font-bold">Followers ({totalFollowers})</h1>

		<InfiniteScroll onLoadMore={followersQuery.fetchNextPage}>
			<UserList
				users={pages.flatMap((page) => page.items)}
				isLoading={followersQuery.isFetchingNextPage}
				rightComponent={(user) => (
					<UserFollowButton targetUserId={user.id} isFollowing={user.isFollowing} />
				)}
			/>
		</InfiniteScroll>
	</main>;
}
