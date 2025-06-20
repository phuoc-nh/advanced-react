import Card from '@/features/shared/components/ui/Card';
import React, { useState } from 'react'
import { CommentForList } from '../types';
import CommentEditingForm from './CommentEditingForm';
import { Button } from '@/features/shared/components/ui/Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/features/shared/components/ui/Dialog';
import { trpc } from '@/router';
import { useToast } from '@/features/shared/hooks/useToast';
import { UserAvatar } from '@/features/users/components/UserAvatar';
import Link from '@/features/shared/components/ui/Link';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

type CommentCardProps = {
	comment: CommentForList;
}


export default function CommentCard({ comment }: CommentCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	if (isEditing) {
		return (
			<CommentEditingForm comment={comment} setIsEditing={setIsEditing} />
		);
	}

	return (
		<Card className='space-y-4'>
			<CommentCardHeader comment={comment} />
			<CommentCardContent comment={comment} />
			<CommentCardButtons setIsEditing={setIsEditing} comment={comment} />
		</Card>
	)
}

type CommentCardHeaderProps = Pick<CommentCardProps, 'comment'>

function CommentCardHeader({ comment }: CommentCardHeaderProps) {
	return (
		<div className='flex items-center gap-2'>
			<Link to='/users/$userId' params={{ userId: comment.user.id }} >
				<UserAvatar user={comment.user} />
			</Link>
			{/* <div>{comment.user.name}</div> */}
			<time className='text-sm text-neutral-500'>
				. {new Date(comment.createdAt).toLocaleDateString()}
			</time>
		</div>
	)
}

type CommentCardContentProps = Pick<CommentCardProps, 'comment'>
function CommentCardContent({ comment }: CommentCardContentProps) {
	return (
		<p>{comment.content}</p>
	)
}

type CommentCardButtonsProps = {
	setIsEditing: (isEditing: boolean) => void;

} & Pick<CommentCardProps, 'comment'>;

function CommentCardButtons({ setIsEditing, comment }: CommentCardButtonsProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const utils = trpc.useUtils();
	const { toast } = useToast();
	const { currentUser } = useCurrentUser();

	const deleteMutation = trpc.comments.delete.useMutation({
		onSuccess: async () => {
			await Promise.all([
				utils.comments.byExperienceId.invalidate({
					experienceId: comment.experienceId,
				}),
				utils.experiences.feed.invalidate(),
			])
			setIsDeleting(false);
			toast({
				title: 'Comment deleted',
				description: 'Your comment has been deleted successfully.',
				variant: 'success',
			})
		},
		onError: (error) => {
			toast({
				title: 'Error deleting comment',
				description: error.message,
				variant: 'destructive',
			})
		}
	})

	const isOwner = currentUser?.id === comment.user.id;
	const isExperienceOwner = currentUser?.id === comment.experience.userId;

	if (!isOwner && !isExperienceOwner) {
		return null;
	}

	return (
		<div className='flex gap-4'>
			{isOwner && (
				<Button variant={'link'} onClick={() => setIsEditing(true)}>Edit</Button>
			)}
			{(isOwner || isExperienceOwner) && <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
				<DialogTrigger asChild>
					<Button variant="destructive-link">Delete</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Comment</DialogTitle>
					</DialogHeader>
					<p className="text-neutral-600 dark:text-neutral-400">
						Are you sure you want to delete this comment? This action cannot be
						undone.
					</p>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsDeleting(false)}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								deleteMutation.mutate({ id: comment.id });
							}}
							disabled={deleteMutation.isPending}
						>
							{deleteMutation.isPending ? "Deleting..." : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>}
		</div>

	)
}