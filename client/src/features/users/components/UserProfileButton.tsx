import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { UserForDetails } from "../types";
import { UserEditDialog } from "./UserEditDialog";

type UserProfileButtonProps = {
	user: UserForDetails;
};

export function UserProfileButton({ user }: UserProfileButtonProps) {
	const { currentUser } = useCurrentUser();
	const isCurrentUser = currentUser?.id === user.id;

	if (isCurrentUser) {
		return <UserEditDialog user={user} />;
	}

	return null;
}