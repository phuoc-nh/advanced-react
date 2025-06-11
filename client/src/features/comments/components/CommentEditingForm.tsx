import { Button } from '@/features/shared/components/ui/Button'
import Card from '@/features/shared/components/ui/Card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/features/shared/components/ui/Form'
import { TextArea } from '@/features/shared/components/ui/TextArea'
import { useToast } from '@/features/shared/hooks/useToast'
import { trpc } from '@/router'
import { Comment } from '@advanced-react/server/database/schema'
import { commentValidationSchema } from '@advanced-react/shared/schema/comment'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type CommentEditingFormProps = {
	comment: Comment
	setIsEditing: (isEditing: boolean) => void
}

type CommentEditingFormData = z.infer<typeof commentValidationSchema>


export default function CommentEditingForm({ comment, setIsEditing }: CommentEditingFormProps) {
	const form = useForm<CommentEditingFormData>({
		resolver: zodResolver(commentValidationSchema),
		defaultValues: {
			content: comment.content,
		}
	})

	const { toast } = useToast()
	const utils = trpc.useUtils()

	const editCommentMutation = trpc.comments.edit.useMutation({
		onSuccess: async ({ experienceId }) => {


			toast({
				title: 'Comment edited',
				description: 'Your comment has been updated successfully.',
				variant: 'success',
			})

			await utils.comments.byExperienceId.invalidate({
				experienceId
			})
			setIsEditing(false)
		},
		onError: (error) => {
			toast({
				title: 'Error editing comment',
				description: error.message,
				variant: 'destructive',
			})
		}
	})

	const handleSubmit = form.handleSubmit(async (data) => {
		editCommentMutation.mutate({
			id: comment.id,
			content: data.content
		})
	})


	return (
		<Form {...form}>
			<Card>
				<form onSubmit={handleSubmit} className="space-y-2">
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<TextArea {...field} rows={4} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex gap-4">
						<Button type="submit" disabled={editCommentMutation.isPending}>
							{editCommentMutation.isPending ? "Saving..." : "Save"}
						</Button>
						<Button
							variant="link"
							onClick={() => setIsEditing(false)}
							disabled={editCommentMutation.isPending}
						>
							Cancel
						</Button>
					</div>
				</form>
			</Card>
		</Form>
	)
}	
