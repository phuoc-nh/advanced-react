import { useToast } from "@/features/shared/hooks/useToast";
import { trpc } from "@/router";
import { Experience } from "@advanced-react/server/database/schema";

type ExperienceMutationsOptions = {
	edit?: {
		onSuccess?: (id: Experience['id']) => void;
	};
};

export function useExperienceMutations(options: ExperienceMutationsOptions = {}) {
	const utils = trpc.useUtils()
	const { toast } = useToast()
	
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

	return {
		editMutation,
	}
}