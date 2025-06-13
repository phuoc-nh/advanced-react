import { useToast } from "@/features/shared/hooks/useToast";
import { trpc } from "@/router";
import { Experience } from "@advanced-react/server/database/schema";
import { useParams, useSearch } from "@tanstack/react-router";

type ExperienceMutationsOptions = {
	edit?: {
		onSuccess?: (id: Experience['id']) => void;
	};
	delete?: {
		onSuccess?: (id: Experience['id']) => void;
	}
};

export function useExperienceMutations(options: ExperienceMutationsOptions = {}) {
	const utils = trpc.useUtils()
	const { toast } = useToast()
	const { userId: pathUserId } = useParams({ strict: false })
	const { q: pathQ } = useSearch({ strict: false })
	
	const editMutation = trpc.experiences.edit.useMutation({
		onSuccess: async ({id}) => {
			await utils.experiences.byId.invalidate({ id })
			toast({
				title: "Experience edited successfully",
				description: "Your experience has been updated.",
				variant: "success",
			})

			options.edit?.onSuccess?.(id)
		},
		onError: (error) => {
			toast({
				title: "Error editing experience",
				description: error.message,
				variant: "destructive",
			})
		}
	})

	const deleteMutation = trpc.experiences.delete.useMutation({
		onSuccess: async (id) => {
			await Promise.all([
				utils.experiences.feed.invalidate(),
				...(pathUserId ? [utils.experiences.byUserId.invalidate({ id: pathUserId })] : []),
				...(pathQ ? [utils.experiences.search.invalidate({ q: pathQ })] : []),
			])

			toast({
				title: "Experience deleted successfully",
				description: "Your experience has been removed.",
				variant: "success",
			})

			options.delete?.onSuccess?.(id)
		},
		onError: (error) => {
			toast({
				title: "Error deleting experience",
				description: error.message,
				variant: "destructive",
			})
		}
	})

	return {
		editMutation,
		deleteMutation,
	}
}