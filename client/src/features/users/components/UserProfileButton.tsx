import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { UserForDetails } from "../types";
import { UserEditDialog } from "./UserEditDialog";
import { UserFollowButton } from "./UserFollowButton";

type UserProfileButtonProps = {
	user: UserForDetails;
};

export function UserProfileButton({ user }: UserProfileButtonProps) {
	const { currentUser } = useCurrentUser();
	const isCurrentUser = currentUser?.id === user.id;

	return isCurrentUser ? (
		<UserEditDialog user={user} />
	) : (
		<UserFollowButton targetUserId={user.id} isFollowing={user.isFollowing} />
	);
}