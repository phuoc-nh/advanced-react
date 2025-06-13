import { LinkIcon } from "lucide-react";

import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Button } from "@/features/shared/components/ui/Button";
import Card from "@/features/shared/components/ui/Card";
import Link from "@/features/shared/components/ui/Link";
import { router } from "@/router";

import { ExperienceForDetails } from "../types";
import ExperienceAttendButton from "./ExperienceAttendButton";
import { ExperienceDeleteDialog } from "./ExperienceDeleteDialog";


type ExperienceDetailsProps = {
	experience: ExperienceForDetails;
};

export function ExperienceDetails({ experience }: ExperienceDetailsProps) {
	return (
		<Card className="p-0">
			<ExperienceDetailsMedia experience={experience} />
			<div className="space-y-4 p-4">
				<ExperienceDetailsHeader experience={experience} />
				<ExperienceDetailsContent experience={experience} />
				<ExperienceDetailsMeta experience={experience} />
				<ExperienceCardActionButtons experience={experience} />
			</div>
		</Card>
	);
}

type ExperienceDetailsMediaProps = Pick<ExperienceDetailsProps, "experience">;

function ExperienceDetailsMedia({ experience }: ExperienceDetailsMediaProps) {
	if (!experience.imageUrl) {
		return null;
	}

	return (
		<div className="aspect-video w-full overflow-hidden rounded-lg">
			<img
				src={experience.imageUrl}
				alt={experience.title}
				className="h-full w-full object-cover"
			/>
		</div>
	);
}

type ExperienceDetailsHeaderProps = Pick<ExperienceDetailsProps, "experience">;

function ExperienceDetailsHeader({ experience }: ExperienceDetailsHeaderProps) {
	return <h1 className="text-2xl font-bold">{experience.title}</h1>;
}

type ExperienceDetailsContentProps = Pick<ExperienceDetailsProps, "experience">;

function ExperienceDetailsContent({
	experience,
}: ExperienceDetailsContentProps) {
	return (
		<p className="text-lg text-neutral-600 dark:text-neutral-400">
			{experience.content}
		</p>
	);
}

type ExperienceDetailsMetaProps = Pick<ExperienceDetailsProps, "experience">;

function ExperienceDetailsMeta({ experience }: ExperienceDetailsMetaProps) {
	return (
		<div className="flex items-center gap-2">
			<div className="flex items-center gap-2">
				<time className="text-neutral-600 dark:text-neutral-400">
					{new Date(experience.scheduledAt).toLocaleString()}
				</time>
			</div>

			{experience.url && (
				<div className="flex items-center gap-2">
					<LinkIcon
						size={16}
						className="text-secondary-500 dark:text-primary-500"
					/>
					<a
						href={experience.url}
						target="_blank"
						className="text-secondary-500 dark:text-primary-500 hover:underline"
					>
						Event Details
					</a>
				</div>
			)}
		</div>
	);
}

type ExperienceCardActionButtonsProps = Pick<ExperienceDetailsProps, "experience">;

function ExperienceCardActionButtons({
	experience,
}: ExperienceCardActionButtonsProps) {
	const { currentUser } = useCurrentUser();

	const isPostOwner = currentUser?.id === experience.userId;

	if (isPostOwner) {
		return <ExperienceCardOwnerButtons experience={experience} />;
	}

	if (currentUser) {
		return <ExperienceAttendButton experienceId={experience.id} isAttending={experience.isAttending} />
	}

	return null;
}

type ExperienceCardOwnerButtonsProps = Pick<ExperienceDetailsProps, "experience">;

function ExperienceCardOwnerButtons({
	experience,
}: ExperienceCardOwnerButtonsProps) {
	return (
		<div className="flex gap-4">
			<Button asChild variant="link">
				<Link
					to="/experiences/$experienceId/edit"
					params={{ experienceId: experience.id }}
				>
					Edit
				</Link>
			</Button>
			<ExperienceDeleteDialog
				experience={experience}
				onSuccess={() => {
					router.navigate({ to: '/' });
				}}
			/>
		</div>
	);
}