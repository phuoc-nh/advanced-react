import Card from "@/features/shared/components/ui/Card";
import { MartiniIcon } from "lucide-react";
import { UserForDetails } from "../types";

type UserProfileHostStatsProps = {
	user: UserForDetails;
};

export function UserProfileHostStats({ user }: UserProfileHostStatsProps) {
	return (
		<Card className="space-y-2">
			<h3 className="text-center text-lg font-semibold">Host Stats</h3>
			<div className="flex flex-row items-center justify-center gap-2 text-neutral-600 dark:text-neutral-400">
				<MartiniIcon className="h-5 w-5" />
				{user.hostedExperiencesCount}
			</div>
		</Card>
	);
}