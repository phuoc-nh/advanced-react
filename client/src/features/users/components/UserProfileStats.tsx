import Link from "@/features/shared/components/ui/Link";
import { UserForDetails } from "../types";

type UserProfileStatsProps = {
	user: UserForDetails;
};

export function UserProfileStats({ user }: UserProfileStatsProps) {
	const stats = [
		{
			label: "Followers",
			value: user.followersCount,
			to: `/users/$userId/followers`,
			params: {
				userId: user.id,
			},
		},
		{
			label: "Following",
			value: user.followingCount,
			to: `/users/$userId/following`,
			params: {
				userId: user.id,
			},
		},
	] as const;

	return (

		<div className="flex w-full justify-center gap-12 border-y-2 border-neutral-200 py-4 dark:border-neutral-800">
			{stats.map((stat) => (
				<Link
					key={stat.label}
					to={stat.to}
					params={stat.params}
					variant="ghost"
					className="text-center"
				>
					<div className="dark:text-primary-500 text-secondary-500 text-center text-2xl font-bold">
						{stat.value}
					</div>
					<div className="text-sm text-neutral-600 dark:text-neutral-400">
						{stat.label}
					</div>
				</Link>
			))}
		</div>
	);
}