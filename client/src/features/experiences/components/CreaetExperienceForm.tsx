import { Button } from "@/features/shared/components/ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/features/shared/components/ui/Form";
import Input from "@/features/shared/components/ui/Input";
import { TextArea } from "@/features/shared/components/ui/TextArea";
import { Experience } from "@advanced-react/server/database/schema";
import { experienceValidationSchema } from "@advanced-react/shared/schema/experience";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useExperienceMutations } from "../hooks/useExperienceMutations";
import FileInput from "@/features/shared/components/ui/FileInput";
import { DateTimePicker } from "@/features/shared/components/ui/DateTimePicker";

type CreateExperienceFormData = z.infer<typeof experienceValidationSchema>;

type CreateExperienceFormProps = {
	onSuccess?: (id: Experience['id']) => void;
	onCancel?: (id: Experience['id']) => void;
}


export function CreateExperienceForm({
	onSuccess,
	onCancel,
}: CreateExperienceFormProps) {
	const form = useForm<CreateExperienceFormData>({
		resolver: zodResolver(experienceValidationSchema),
		defaultValues: {
			title: "",
			content: "",
			url: "",
			scheduledAt: "",
			location: undefined,
		},
	});

	const { createMutation } = useExperienceMutations({
		create: {
			onSuccess,
		},
	});

	const handleSubmit = form.handleSubmit((data) => {
		const formData = new FormData();
		console.log("Submitting data:", data);
		for (const [key, value] of Object.entries(data)) {
			if (value !== undefined && value !== null) {
				if (key === "location") {
					formData.append(key, JSON.stringify(value));
				} else {
					formData.append(key, value as string | Blob);
				}
			}
		}

		createMutation.mutate(formData);
	});

	// Add this line to log validation errors on every render
	console.log(form.formState.errors);
	console.log(form.getValues('scheduledAt'));

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit} className="space-y-4">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Content</FormLabel>
							<FormControl>
								<TextArea {...field} rows={4} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="scheduledAt"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Scheduled At</FormLabel>
							<FormControl>
								<DateTimePicker {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Location</FormLabel>
							<FormControl>
								<Input
									{...field}
									value={field.value ? field.value.displayName : ""}
									onChange={(e) => {
										const displayName = e.target.value;
										// Optionally, preserve lat/lon if needed, or reset
										field.onChange(displayName
											? { displayName, lat: 0, lon: 0 }
											: undefined
										);
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="url"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Link</FormLabel>
							<FormControl>
								<Input {...field} value={field.value ?? ""} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="image"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Photo</FormLabel>
							<FormControl>
								<FileInput accept="image/*" onChange={(event) => {
									field.onChange(event.target.files?.[0]);
								}} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex gap-2">
					<Button type="submit" disabled={createMutation.isPending}>
						{createMutation.isPending ? "Saving..." : "Save"}
					</Button>
				</div>
			</form>
		</Form>
	);
}