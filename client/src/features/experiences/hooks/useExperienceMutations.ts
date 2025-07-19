import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useToast } from "@/features/shared/hooks/useToast";
import { trpc } from "@/router";
import { Experience, User } from "@advanced-react/server/database/schema";
import { useParams, useSearch } from "@tanstack/react-router";

type ExperienceMutationsOptions = {
	edit?: {
		onSuccess?: (id: Experience['id']) => void;
	};
	delete?: {
		onSuccess?: (id: Experience['id']) => void;
	},
	create?: {
		onSuccess?: (id: Experience['id']) => void;
	}
};

export function useExperienceMutations(options: ExperienceMutationsOptions = {}) {
	const utils = trpc.useUtils()
	const { toast } = useToast()
	const { userId: pathUserId } = useParams({ strict: false })
	const { q: pathQ } = useSearch({ strict: false })
	const { currentUser } = useCurrentUser()
	
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

	const createMutation = trpc.experiences.create.useMutation({
		onSuccess: async ({id}) => {
			await utils.experiences.byId.invalidate({ id })
			toast({
				title: "Experience created successfully",
				description: "Your experience has been created.",
				variant: "success",
			})

			options.create?.onSuccess?.(id)
		},
		onError: (error) => {
			toast({
				title: "Error creating experience",
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

	const attendMutation = trpc.experiences.attend.useMutation({
		onMutate: async ({ id }) => {
			function updateExperience<T extends {
				isAttending: boolean;
				attendeesCount: number;
				attendees?: User[]
			}>(oldData: T) {
				return {
					...oldData,
					isAttending: true,
					attendeesCount: oldData.attendeesCount + 1,
					...(oldData.attendees && {
						attendees: [currentUser, ...oldData.attendees],
					}),
				}
			}
			console.log("Optimistically updating experience with ID:", id)
			await Promise.all([
				// cancel ongoing or in flight queries
				// we don't want to suddenly receive a response from server and overwrite our optimistic update
				utils.experiences.byId.cancel({ id }),
				utils.experiences.feed.cancel(),
				...(pathUserId ? [utils.experiences.byUserId.cancel({ id: pathUserId })] : []),
				...(pathQ ? [utils.experiences.search.cancel({ q: pathQ })] : []),
			])
			console.log("feed cache:", utils.experiences.feed.getInfiniteData({}))
			const previousData = {
				byId: utils.experiences.byId.getData({ id }),
				feed: utils.experiences.feed.getInfiniteData({}), // Pass empty object like in the query
				byUserId: pathUserId ? utils.experiences.byUserId.getInfiniteData({ id: pathUserId }) : undefined,
				search: pathQ ? utils.experiences.search.getInfiniteData({ q: pathQ }) : undefined,
			}

			utils.experiences.byId.setData({ id }, (oldData) => {
				if (!oldData) return;

				return updateExperience(oldData)
			})

			utils.experiences.feed.setInfiniteData({}, (oldData) => { 
				if (!oldData) return;

				return {
					...oldData,
					pages: oldData.pages.map(page => ({
						...page,
						experiences: page.experiences.map(exp => 
							exp.id === id ? updateExperience(exp) : exp
						)
					}))
				}
			})

			if (pathUserId) {
				utils.experiences.byUserId.setInfiniteData({ id: pathUserId }, (oldData) => {
					if (!oldData) return;

					return {
						...oldData,
						pages: oldData.pages.map(page => ({
							...page,
							experiences: page.experiences.map(exp => 
								exp.id === id ? updateExperience(exp) : exp
							)
						}))
					}
				})
			}

			if (pathQ) {
				utils.experiences.search.setInfiniteData({ q: pathQ }, (oldData) => {
					if (!oldData) return;

					return {
						...oldData,
						pages: oldData.pages.map(page => ({
							...page,
							experiences: page.experiences.map(exp => 
								exp.id === id ? updateExperience(exp) : exp
							)
						}))
					}
				})
			}
			console.log("Previous data before attend mutation:", previousData)

			return {
				previousData,
			}
		},
		onError: (error, { id }, context) => { 
			// Rollback optimistic update
			console.error("Rollback context?.previousData:", context?.previousData)
			utils.experiences.byId.setData({ id }, context?.previousData?.byId)
			utils.experiences.feed.setInfiniteData({}, context?.previousData?.feed) // Pass empty object
			if (pathUserId) {
				utils.experiences.byUserId.setInfiniteData({ id: pathUserId }, context?.previousData?.byUserId)
			}
			if (pathQ) {
				utils.experiences.search.setInfiniteData({ q: pathQ }, context?.previousData?.search)
			}

			toast({
				title: "Error attending experience",
				description: error.message,
				variant: "destructive",
			})
		},
		onSuccess: async ({ success }) => {
			console.log("Attend mutation successful:", success)
		},
	})

	const unattendMutation = trpc.experiences.unattend.useMutation({
		onMutate: async ({ id }) => {
			function updateExperience<T extends {
				isAttending: boolean;
				attendeesCount: number;
				attendees?: User[]
			}>(oldData: T) {
				return {
					...oldData,
					isAttending: false,
					attendeesCount: oldData.attendeesCount - 1,
					...(oldData.attendees && {
						attendees: oldData.attendees.filter(user => user?.id !== currentUser?.id),
					}),
				}
			}

			await Promise.all([
				// cancel ongoing or in flight queries
				// we don't want to suddenly receive a response from server and overwrite our optimistic update
				utils.experiences.byId.cancel({ id }),
				utils.experiences.feed.cancel(),
				...(pathUserId ? [utils.experiences.byUserId.cancel({ id: pathUserId })] : []),
				...(pathQ ? [utils.experiences.search.cancel({ q: pathQ })] : []),
			])

			const previousData = {
				byId: utils.experiences.byId.getData({ id }),
				feed: utils.experiences.feed.getInfiniteData({}), // Pass empty object like in the query
				byUserId: pathUserId ? utils.experiences.byUserId.getInfiniteData({ id: pathUserId }) : undefined,
				search: pathQ ? utils.experiences.search.getInfiniteData({ q: pathQ }) : undefined,
			}

			utils.experiences.byId.setData({ id }, (oldData) => {
				if (!oldData) return;

				return updateExperience(oldData)
			})

			utils.experiences.feed.setInfiniteData({}, (oldData) => { 
				if (!oldData) return;

				return {
					...oldData,
					pages: oldData.pages.map(page => ({
						...page,
						experiences: page.experiences.map(exp => 
							exp.id === id ? updateExperience(exp) : exp
						)
					}))
				}
			})

			if (pathUserId) {
				utils.experiences.byUserId.setInfiniteData({ id: pathUserId }, (oldData) => {
					if (!oldData) return;

					return {
						...oldData,
						pages: oldData.pages.map(page => ({
							...page,
							experiences: page.experiences.map(exp => 
								exp.id === id ? updateExperience(exp) : exp
							)
						}))
					}
				})
			}

			if (pathQ) {
				utils.experiences.search.setInfiniteData({ q: pathQ }, (oldData) => {
					if (!oldData) return;

					return {
						...oldData,
						pages: oldData.pages.map(page => ({
							...page,
							experiences: page.experiences.map(exp => 
								exp.id === id ? updateExperience(exp) : exp
							)
						}))
					}
				})
			}

			return {
				previousData,
			}
		},
		onError: (error, { id }, context) => { 
			// Rollback optimistic update
			utils.experiences.byId.setData({ id }, context?.previousData?.byId)
			utils.experiences.feed.setInfiniteData({}, context?.previousData?.feed) // Pass empty object
			if (pathUserId) {
				utils.experiences.byUserId.setInfiniteData({ id: pathUserId }, context?.previousData?.byUserId)
			}
			if (pathQ) {
				utils.experiences.search.setInfiniteData({ q: pathQ }, context?.previousData?.search)
			}

			toast({
				title: "Error attending experience",
				description: error.message,
				variant: "destructive",
			})


		}
	})

	return {
		editMutation,
		deleteMutation,
		attendMutation,
		unattendMutation,
		createMutation
	}
}