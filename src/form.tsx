"use client";
import backgroundImage from "./assets/bg.jpg?url";
import { toast } from 'sonner';

import emailjs from "@emailjs/browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CircleCheckBigIcon, Loader2Icon } from "lucide-react";
import logger from "@/lib/logger"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "./components/ui/separator";
import { FileUploader } from "./components/ui/file-uploader";
import { useUploadFile } from "./hooks/use-upload-file";
import { UploadedFilesCard } from "./_components/uploaded-files-card";
import { type FunctionComponent, useState } from "react";
import { Textarea } from "./components/ui/textarea";

const englishProficiency = [
	{ label: "Yes, English was my first language", value: "yes_mother_tongue" },
	{ label: "Yes, I can speak it fluently", value: "yes_fluently" },
	{ label: "Not really", value: "not_really" },
	{ label: "No", value: "no" },
] as const;

const availability = [
	{ label: "Full-time", value: "full_time" },
	{ label: "Part-time", value: "part_time" },
] as const;

const role = [
	{ label: "Biochemical Engineering", value: "biochemical" },
	{ label: "Civil Engineering", value: "civil" },
	{ label: "Computer Engineering", value: "computer" },
	{ label: "Environmental Engineering", value: "environmental" },
	{ label: "Mechanical Engineering", value: "mechanical" },
	{ label: "Software Engineering", value: "software" },
	{ label: "Structural Engineering", value: "structural" },
	{ label: "Chemical Engineering", value: "chemical" },
	{ label: "Materials Engineering", value: "materials" },
	{ label: "Petroleum Engineering", value: "petroleum" },
] as const;

const nameSchema = z
	.string({
		required_error: "Please fill this in",
	})
	.min(2, {
		message: "Name must be at least 2 characters.",
	})
	.max(30, {
		message: "Name must not be longer than 30 characters.",
	});
const accountFormSchema = z.object({
	first_name: nameSchema,
	middle_name: nameSchema,
	last_name: nameSchema,
	email: z
		.string({ required_error: "Please enter your email address" })
		.email({ message: "Invalid email address" }),
	phone_number: z.string({
		required_error: "Please enter your phone number",
		message: "Please enter your phone number",
	}),
	availability: z.string({
		required_error: "Please select your availability.",
	}),
	english_proficiency: z.string({
		required_error: "Please select a language.",
	}),
	role: z.string({
		required_error: "Please select a role.",
	}),
	resume: z.array(z.instanceof(File), {
		required_error: "Please upload at least one document",
		message: "Please upload at least one document",
	}),
	personal_description: z.string({
		message: "Please fill this in",
		required_error: "Please fill this in",
	}),
	professional_experience: z.string({
		message: "Please fill this in",
		required_error: "Please fill this in",
	}),
	question: z.string({
		message: "Please fill this in",
		required_error: "Please fill this in",
	}),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
	// name: "Your name",
	// dob: new Date("2023-01-23"),
};

export const AccountForm: FunctionComponent<{
	onSubmit: (v: AccountFormValues) => void;
}> = ({ onSubmit: submissionCb }) => {
	const [popups, setPopups] = useState({
		english_proficiency: false,
		availability: false,
		role: false,
	});

	const form = useForm<AccountFormValues>({
		resolver: zodResolver(accountFormSchema),
		defaultValues,
	});

	const { onUpload, progresses, uploadedFiles, isUploading } = useUploadFile(
		"imageUploader",
		{ defaultUploadedFiles: [] },
	);

	const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

	const storeInfo = (v: AccountFormValues) => {
		// emailjs.send(
		// 	import.meta.env.VITE_SERVICE_ID,
		// 	import.meta.env.VITE_TEMPLATE_ID,
		// 	{ message: JSON.stringify(v) },
		// );

		logger.info(v)
	}

	const onSubmit = async (v: AccountFormValues) => {
		try {
			await storeInfo(v)
			await wait(3000);
			submissionCb(v);
		}
		catch (err) {
			console.warn(err)
			toast.warning('Sorry an error occurred');
		}
	};

	const isSubmitting = form.formState.isSubmitting;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="first_name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>First Name</FormLabel>
							<FormControl>
								<Input
									placeholder="First name"
									{...field}
									className="border-2 border-black"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="middle_name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Middle Name</FormLabel>
							<FormControl>
								<Input
									placeholder="Middle Name"
									{...field}
									className="border-2 border-black"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="last_name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last Name</FormLabel>
							<FormControl>
								<Input
									placeholder="Last name"
									{...field}
									className="border-2 border-black"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email Address</FormLabel>
							<FormControl>
								<Input
									type="email"
									placeholder="Email Address"
									{...field}
									className="border-2 border-black"
								/>
							</FormControl>
							<FormDescription>
								This is the email address we would use to reach out to you.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="phone_number"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone Number</FormLabel>
							<FormControl>
								<Input
									placeholder="Phone number"
									{...field}
									className="border-2 border-black"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="availability"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Availability</FormLabel>
							<Popover
								open={popups.availability}
								onOpenChange={(o) =>
									setPopups((p) => ({ ...p, availability: o }))
								}
							>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											role="combobox"
											className={cn(
												"justify-between border-2 border-black",
												!field.value && "text-muted-foreground",
											)}
										>
											{field.value
												? availability.find((a) => a.value === field.value)
														?.label
												: "Select an option"}
											<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0">
									<Command>
										<CommandList>
											<CommandGroup>
												{availability.map((a) => (
													<CommandItem
														value={a.label}
														key={a.value}
														onSelect={() => {
															form.setValue("availability", a.value);
															setPopups((p) => ({ ...p, availability: false }));
														}}
													>
														{a.label}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<FormDescription>
								Please select your availability schedule.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="english_proficiency"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Are you proficient in English?</FormLabel>
							<Popover
								open={popups.english_proficiency}
								onOpenChange={(o) =>
									setPopups((p) => ({ ...p, english_proficiency: o }))
								}
							>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											role="combobox"
											className={cn(
												"justify-between border-2 border-black",
												!field.value && "text-muted-foreground",
											)}
										>
											{field.value
												? englishProficiency.find(
														(ep) => ep.value === field.value,
													)?.label
												: "Select an option"}
											<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0">
									<Command>
										<CommandList>
											<CommandGroup>
												{englishProficiency.map((ep) => (
													<CommandItem
														value={ep.label}
														key={ep.value}
														onSelect={() => {
															form.setValue("english_proficiency", ep.value);
															setPopups((p) => ({
																...p,
																english_proficiency: false,
															}));
														}}
													>
														{ep.label}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<FormDescription>
								This will help us understand your proficiency in English.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="role"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Role</FormLabel>
							<Popover
								open={popups.role}
								onOpenChange={(o) => setPopups((p) => ({ ...p, role: o }))}
							>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											role="combobox"
											className={cn(
												"justify-between border-2 border-black",
												!field.value && "text-muted-foreground",
											)}
										>
											{field.value
												? role.find((r) => r.value === field.value)?.label
												: "Select an option"}
											<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0">
									<Command>
										<CommandList>
											<CommandGroup>
												{role.map((r) => (
													<CommandItem
														value={r.label}
														key={r.value}
														onSelect={() => {
															form.setValue("role", r.value);
															setPopups((p) => ({
																...p,
																role: false,
															}));
														}}
													>
														{r.label}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<FormDescription>
								This will help us understand your proficiency in English.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="resume"
					render={({ field }) => (
						<div className="space-y-6">
							<FormItem className="w-full">
								<FormLabel>Upload your Resume/CV </FormLabel>
								<FormControl>
									<FileUploader
										value={field.value}
										onValueChange={field.onChange}
										maxFileCount={2}
										maxSize={4 * 1024 * 1024}
										progresses={progresses}
										// pass the onUpload function here for direct upload
										// onUpload={uploadFiles}
										disabled={isUploading}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
							{uploadedFiles.length > 0 ? (
								<UploadedFilesCard uploadedFiles={uploadedFiles} />
							) : null}
						</div>
					)}
				/>
				<FormField
					control={form.control}
					name="personal_description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Describe yourself</FormLabel>
							<FormControl>
								<Textarea
									type="text"
									maxLength={500}
									placeholder="Describe yourself in no more than 500 words"
									className="border-2 border-black"
									rows={4}
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Give us a brief summary about self. Be sure to include:
								<ol className="ml-4 list-decimal">
									<li>Hobbies</li>
									<li>Recreational activities</li>
								</ol>
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="professional_experience"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Professional experience</FormLabel>
							<FormControl>
								<Textarea
									type="text"
									maxLength={500}
									placeholder="Describe your professional experience in no more than 500 words"
									className="border-2 border-black"
									rows={4}
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Mention:
								<ol className="ml-4 list-decimal">
									<li>Cerfications acquired</li>
									<li>Places worked at</li>
									<li>Internships taken</li>
								</ol>
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="question"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Why do you think you'll be a good fit for us?
							</FormLabel>
							<FormControl>
								<Textarea
									type="text"
									maxLength={500}
									placeholder="Describe why you think you're bes suited for us"
									className="border-2 border-black"
									rows={4}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="p-4 w-full flex gap-1 font-medium bg-white border-2 border-black text-black hover:text-white hover:bg-black transition-colors duration-300"
					style={{ boxShadow: "3px 3px 0 0 #000000" }}
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<>
							<Loader2Icon className="size-6 animate-spin" /> Submitting...
						</>
					) : (
						"Submit"
					)}
				</Button>
			</form>
		</Form>
	);
};

export default function FormPage() {
	const [isSubmitted, setIsSubmitted] = useState(false);

	const onSubmit = (data: any) => {
		setIsSubmitted(true);
	};

	return (
		<>
			<div className="flex flex-col grow relative">
				<div
					className="absolute inset-0 -z-10 bg-no-repeat bg-cover"
					style={{
						backgroundImage: `url('${backgroundImage}')`,
						backdropFilter: "blur(8px)",
					}}
				/>
				<div className="flex flex-col grow">
					{isSubmitted ? (
						<div className="flex flex-col grow items-center justify-center p-5 gap-6">
							<div className="bg-white shadow-md rounded-lg p-6 py-12 flex flex-col items-center justify-center gap-8">
								<CircleCheckBigIcon className="size-48" />
								<div className="space-y-2 max-w-xl">
									<h1 className="text-bold text-6xl text-center font-FrancoisOne">
										THANK YOU
									</h1>
									<p className="text-xl text-center">
										We will reach out to you soon. We typically respond within
										1-2 working days.
									</p>
								</div>
							</div>
						</div>
					) : (
						<div className="mt-8 lg:mt-16 p-5">
							<div
								className="mx-auto max-w-xl p-5 shadow-xl rounded-xl border-[3px] border-black bg-white"
								style={{ boxShadow: "4px 4px 0 0 #000000" }}
							>
								<div className="space-y-6">
									<div className="flex flex-col gap-2">
										<h3 className="text-xl font-medium">
											Job Application at Hanjo Engineering Inc.
										</h3>
										<p className="text-sm text-muted-foreground font-semibold">
											Application form to join our amazing team
										</p>
									</div>
									<Separator />
									<AccountForm onSubmit={onSubmit} />
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
