import { Experience } from "@advanced-react/server/database/schema";

import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useExperienceMutations } from "../hooks/useExperienceMutations";
import { Button } from "@/features/shared/components/ui/Button";

type ExperienceAttendButtonProps = {
	experienceId: Experience["id"];
	isAttending: boolean;
};


export default function ExperienceAttendButton({ experienceId, isAttending }: ExperienceAttendButtonProps) {
	const { currentUser } = useCurrentUser();

	const { attendMutation } = useExperienceMutations()

	if (!currentUser) {
		return null;
	}



	return (
		<Button
			variant={isAttending ? "outline" : "default"}
			onClick={() => {
				if (isAttending) {
					// TODO: Implement unattend
				} else {
					attendMutation.mutate({ id: experienceId });
				}
			}}
			disabled={attendMutation.isPending}
		>
			{isAttending ? "Not Going" : "Going"}
		</Button>
	);
}

