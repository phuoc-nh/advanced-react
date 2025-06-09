import Card from '@/features/shared/components/ui/Card';
import React, { useState } from 'react'
import { CommentForList } from '../types';
import CommentEditingForm from './CommentEditingForm';
import { Button } from '@/features/shared/components/ui/Button';

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
			<CommentCardButtons setIsEditing={setIsEditing} />
		</Card>
	)
}

type CommentCardHeaderProps = Pick<CommentCardProps, 'comment'>

function CommentCardHeader({ comment }: CommentCardHeaderProps) {
	return (
		<div className='flex items-center gap-2'>
			<div>{comment.user.name}</div>
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
}

function CommentCardButtons({ setIsEditing }: CommentCardButtonsProps) {
	return (
		<div className='flex gap-4'>
			<Button variant={'link'} onClick={() => setIsEditing(true)}>Edit</Button>
			{/*  */}
		</div>
	)
}