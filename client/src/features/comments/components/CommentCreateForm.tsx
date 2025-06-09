import { Experience } from '@advanced-react/server/database/schema'
import React from 'react'
import { z } from 'zod'
import { commentValidationSchema } from '@advanced-react/shared/schema/comment'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/features/shared/components/ui/Form'
import { TextArea } from '@/features/shared/components/ui/TextArea'
import { Button } from '@/features/shared/components/ui/Button'
import { trpc } from '@/trpc'
import { useToast } from '@/features/shared/hooks/useToast'

type CommentCreateFormProps = {
	experienceId: Experience['id']
}

type CommentCreateFormData = z.infer<typeof commentValidationSchema>

export default function CommentCreateForm({ experienceId }: CommentCreateFormProps) {
	const { toast } = useToast()
	const utils = trpc.useUtils()
	const form = useForm<CommentCreateFormData>({
		resolver: zodResolver(commentValidationSchema),
		defaultValues: {
			content: '',
		}
	})

	const addCommentMutation = trpc.comments.add.useMutation({
		onError: (error) => {
			toast({
				title: 'Error adding comment',
				description: error.message,
				variant: 'destructive',
			})
		},
		onSuccess: async ({ experienceId }) => {
			await Promise.all([
				utils.comments.byExperienceId.invalidate({
					experienceId
				}),
				utils.experiences.feed.invalidate(),

			])

			form.reset();
			toast({
				title: 'Comment added',
				description: 'Your comment has been added successfully.',
				variant: 'success',
			})

		}
	})

	const handleSubmit = form.handleSubmit(async (data) => {
		addCommentMutation.mutate({
			experienceId,
			content: data.content
		})
	})

	return (
		<Form {...form}>
			<form action="" onSubmit={handleSubmit}>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<TextArea {...field} placeholder='Add a comment...' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={addCommentMutation.isPending} >Add comment</Button>
			</form>
		</Form>
	)

}
