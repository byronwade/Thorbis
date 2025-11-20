"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// Invite mode schema - minimal fields
const inviteSchema = z.object({
	email: z.string().email("Invalid email address"),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	role: z.enum(
		["admin", "manager", "member", "technician", "dispatcher", "csr"],
		{
			message: "Role is required",
		},
	),
	jobTitle: z.string().optional(),
	phone: z.string().optional(),
});

// Direct creation mode schema - all employee management fields
const directCreationSchema = z.object({
	// Basic Info
	email: z.string().email("Invalid email address"),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	phone: z.string().optional(),
	role: z.enum(
		["admin", "manager", "member", "technician", "dispatcher", "csr"],
		{
			message: "Role is required",
		},
	),
	departmentId: z.string().optional(),
	jobTitle: z.string().optional(),

	// Emergency Contact
	emergencyContactName: z.string().optional(),
	emergencyContactPhone: z.string().optional(),
	emergencyContactRelationship: z.string().optional(),

	// Employment Details
	employeeId: z.string().optional(),
	hireDate: z.string().optional(),
	employmentType: z
		.enum(["full_time", "part_time", "contract", "temporary"])
		.optional(),
	workSchedule: z.string().optional(),
	workLocation: z.string().optional(),

	// Compensation
	payType: z.enum(["hourly", "salary", "commission", "hybrid"]).optional(),
	hourlyRate: z.coerce.number().optional(),
	annualSalary: z.coerce.number().optional(),
	commissionRate: z.coerce.number().optional(),
	overtimeEligible: z.boolean().optional(),

	// Address
	streetAddress: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	postalCode: z.string().optional(),
	country: z.string().default("US"),

	// Skills & Certifications
	skills: z.string().optional(), // Comma-separated
	certifications: z.string().optional(), // JSON string
	licenses: z.string().optional(), // Comma-separated

	// Work Preferences
	serviceAreas: z.string().optional(), // Comma-separated
	maxWeeklyHours: z.coerce.number().optional(),
	preferredJobTypes: z.string().optional(), // Comma-separated

	// Performance
	performanceNotes: z.string().optional(),
	lastReviewDate: z.string().optional(),
	nextReviewDate: z.string().optional(),

	// General Notes
	notes: z.string().optional(),

	// Password
	tempPassword: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.optional(),
	sendWelcomeEmail: z.boolean().default(true),
});

type InviteFormValues = z.infer<typeof inviteSchema>;
type DirectCreationFormValues = z.infer<typeof directCreationSchema>;

export function AddTeamMemberForm() {
	const router = useRouter();
	const [mode, setMode] = useState<"invite" | "direct">("invite");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Invite form
	const inviteForm = useForm<InviteFormValues>({
		resolver: zodResolver(inviteSchema),
		defaultValues: {
			email: "",
			firstName: "",
			lastName: "",
			role: "member",
			jobTitle: "",
			phone: "",
		},
	});

	// Direct creation form
	const directForm = useForm<DirectCreationFormValues>({
		resolver: zodResolver(directCreationSchema),
		defaultValues: {
			email: "",
			firstName: "",
			lastName: "",
			phone: "",
			role: "member",
			departmentId: "",
			jobTitle: "",
			emergencyContactName: "",
			emergencyContactPhone: "",
			emergencyContactRelationship: "",
			employeeId: "",
			hireDate: new Date().toISOString().split("T")[0],
			employmentType: "full_time",
			workSchedule: "",
			workLocation: "",
			payType: "hourly",
			hourlyRate: undefined,
			annualSalary: undefined,
			commissionRate: undefined,
			overtimeEligible: true,
			streetAddress: "",
			city: "",
			state: "",
			postalCode: "",
			country: "US",
			skills: "",
			certifications: "",
			licenses: "",
			serviceAreas: "",
			maxWeeklyHours: 40,
			preferredJobTypes: "",
			performanceNotes: "",
			lastReviewDate: "",
			nextReviewDate: "",
			notes: "",
			tempPassword: "",
			sendWelcomeEmail: true,
		},
	});

	async function onInviteSubmit(data: InviteFormValues) {
		setIsSubmitting(true);
		try {
			const formData = new FormData();
			formData.append("email", data.email);
			formData.append("firstName", data.firstName);
			formData.append("lastName", data.lastName);
			formData.append("role", data.role);
			if (data.jobTitle) formData.append("jobTitle", data.jobTitle);
			if (data.phone) formData.append("phone", data.phone);

			const { sendSingleTeamInvitation } = await import(
				"@/actions/team-invitations"
			);
			const result = await sendSingleTeamInvitation(formData);

			if (result.success) {
				toast.success("Invitation sent successfully");
				router.push("/dashboard/work/team");
				router.refresh();
			} else {
				toast.error(result.error || "Failed to send invitation");
			}
		} catch (error) {
			toast.error("Failed to send invitation");
		} finally {
			setIsSubmitting(false);
		}
	}

	async function onDirectSubmit(data: DirectCreationFormValues) {
		setIsSubmitting(true);
		try {
			const formData = new FormData();

			// Basic Info
			formData.append("email", data.email);
			formData.append("firstName", data.firstName);
			formData.append("lastName", data.lastName);
			formData.append("role", data.role);
			if (data.phone) formData.append("phone", data.phone);
			if (data.departmentId)
				formData.append("department_id", data.departmentId);
			if (data.jobTitle) formData.append("job_title", data.jobTitle);

			// Emergency Contact
			if (data.emergencyContactName)
				formData.append("emergency_contact_name", data.emergencyContactName);
			if (data.emergencyContactPhone)
				formData.append("emergency_contact_phone", data.emergencyContactPhone);
			if (data.emergencyContactRelationship)
				formData.append(
					"emergency_contact_relationship",
					data.emergencyContactRelationship,
				);

			// Employment Details
			if (data.employeeId) formData.append("employee_id", data.employeeId);
			if (data.hireDate) formData.append("hire_date", data.hireDate);
			if (data.employmentType)
				formData.append("employment_type", data.employmentType);
			if (data.workSchedule)
				formData.append("work_schedule", data.workSchedule);
			if (data.workLocation)
				formData.append("work_location", data.workLocation);

			// Compensation
			if (data.payType) formData.append("pay_type", data.payType);
			if (data.hourlyRate)
				formData.append("hourly_rate", data.hourlyRate.toString());
			if (data.annualSalary)
				formData.append("annual_salary", data.annualSalary.toString());
			if (data.commissionRate)
				formData.append("commission_rate", data.commissionRate.toString());
			formData.append(
				"overtime_eligible",
				data.overtimeEligible ? "true" : "false",
			);

			// Address
			if (data.streetAddress)
				formData.append("street_address", data.streetAddress);
			if (data.city) formData.append("city", data.city);
			if (data.state) formData.append("state", data.state);
			if (data.postalCode) formData.append("postal_code", data.postalCode);
			if (data.country) formData.append("country", data.country);

			// Skills & Certifications
			if (data.skills) formData.append("skills", data.skills);
			if (data.certifications)
				formData.append("certifications", data.certifications);
			if (data.licenses) formData.append("licenses", data.licenses);

			// Work Preferences
			if (data.serviceAreas)
				formData.append("service_areas", data.serviceAreas);
			if (data.maxWeeklyHours)
				formData.append("max_weekly_hours", data.maxWeeklyHours.toString());
			if (data.preferredJobTypes)
				formData.append("preferred_job_types", data.preferredJobTypes);

			// Performance
			if (data.performanceNotes)
				formData.append("performance_notes", data.performanceNotes);
			if (data.lastReviewDate)
				formData.append("last_review_date", data.lastReviewDate);
			if (data.nextReviewDate)
				formData.append("next_review_date", data.nextReviewDate);

			// Notes
			if (data.notes) formData.append("notes", data.notes);

			// Password
			if (data.tempPassword)
				formData.append("temp_password", data.tempPassword);
			formData.append(
				"send_welcome_email",
				data.sendWelcomeEmail ? "true" : "false",
			);

			const { createTeamMemberDirect } = await import("@/actions/team");
			const result = await createTeamMemberDirect(formData);

			if (result.success) {
				toast.success("Team member created successfully");
				router.push("/dashboard/work/team");
				router.refresh();
			} else {
				toast.error(result.error || "Failed to create team member");
			}
		} catch (error) {
			toast.error("Failed to create team member");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="mx-auto max-w-4xl py-8">
			<Card>
				<CardHeader>
					<CardTitle>Add Team Member</CardTitle>
					<CardDescription>
						Choose how you want to add a new team member to your company
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs
						value={mode}
						onValueChange={(v) => setMode(v as "invite" | "direct")}
					>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="invite" className="flex items-center gap-2">
								<Mail className="h-4 w-4" />
								Send Invite Link
							</TabsTrigger>
							<TabsTrigger value="direct" className="flex items-center gap-2">
								<UserPlus className="h-4 w-4" />
								Create Profile Directly
							</TabsTrigger>
						</TabsList>

						{/* INVITE MODE */}
						<TabsContent value="invite" className="space-y-6 pt-6">
							<div className="rounded-lg border bg-muted/50 p-4">
								<p className="text-sm">
									<strong>Invite Mode:</strong> Send an email invitation with a
									magic link. The team member will complete their profile and
									set their own password.
								</p>
							</div>

							<Form {...inviteForm}>
								<form
									onSubmit={inviteForm.handleSubmit(onInviteSubmit)}
									className="space-y-6"
								>
									<div className="grid gap-4 md:grid-cols-2">
										<FormField
											control={inviteForm.control}
											name="firstName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>First Name</FormLabel>
													<FormControl>
														<Input placeholder="John" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={inviteForm.control}
											name="lastName"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Last Name</FormLabel>
													<FormControl>
														<Input placeholder="Doe" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={inviteForm.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														type="email"
														placeholder="john.doe@example.com"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													They will receive an invitation email at this address
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="grid gap-4 md:grid-cols-2">
										<FormField
											control={inviteForm.control}
											name="role"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Role</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select role" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="admin">Admin</SelectItem>
															<SelectItem value="manager">Manager</SelectItem>
															<SelectItem value="member">Member</SelectItem>
															<SelectItem value="technician">
																Technician
															</SelectItem>
															<SelectItem value="dispatcher">
																Dispatcher
															</SelectItem>
															<SelectItem value="csr">CSR</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={inviteForm.control}
											name="jobTitle"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Job Title (Optional)</FormLabel>
													<FormControl>
														<Input placeholder="HVAC Technician" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={inviteForm.control}
										name="phone"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Phone (Optional)</FormLabel>
												<FormControl>
													<Input
														type="tel"
														placeholder="+1 (555) 123-4567"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="flex gap-4">
										<Button type="submit" disabled={isSubmitting}>
											{isSubmitting && (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											)}
											Send Invitation
										</Button>
										<Button
											type="button"
											variant="outline"
											onClick={() => router.push("/dashboard/work/team")}
											disabled={isSubmitting}
										>
											Cancel
										</Button>
									</div>
								</form>
							</Form>
						</TabsContent>

						{/* DIRECT CREATION MODE */}
						<TabsContent value="direct" className="space-y-6 pt-6">
							<div className="rounded-lg border bg-muted/50 p-4">
								<p className="text-sm">
									<strong>Direct Creation:</strong> Create a complete team
									member profile immediately. You'll set a temporary password
									and they can change it later.
								</p>
							</div>

							<Form {...directForm}>
								<form
									onSubmit={directForm.handleSubmit(onDirectSubmit)}
									className="space-y-8"
								>
									{/* Basic Information */}
									<div className="space-y-4">
										<h3 className="text-lg font-medium">Basic Information</h3>
										<div className="grid gap-4 md:grid-cols-2">
											<FormField
												control={directForm.control}
												name="firstName"
												render={({ field }) => (
													<FormItem>
														<FormLabel>First Name *</FormLabel>
														<FormControl>
															<Input placeholder="John" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={directForm.control}
												name="lastName"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Last Name *</FormLabel>
														<FormControl>
															<Input placeholder="Doe" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<div className="grid gap-4 md:grid-cols-2">
											<FormField
												control={directForm.control}
												name="email"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Email *</FormLabel>
														<FormControl>
															<Input
																type="email"
																placeholder="john.doe@example.com"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={directForm.control}
												name="phone"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Phone</FormLabel>
														<FormControl>
															<Input
																type="tel"
																placeholder="+1 (555) 123-4567"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<div className="grid gap-4 md:grid-cols-3">
											<FormField
												control={directForm.control}
												name="role"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Role *</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select role" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="admin">Admin</SelectItem>
																<SelectItem value="manager">Manager</SelectItem>
																<SelectItem value="member">Member</SelectItem>
																<SelectItem value="technician">
																	Technician
																</SelectItem>
																<SelectItem value="dispatcher">
																	Dispatcher
																</SelectItem>
																<SelectItem value="csr">CSR</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={directForm.control}
												name="departmentId"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Department</FormLabel>
														<FormControl>
															<Input placeholder="Department ID" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={directForm.control}
												name="jobTitle"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Job Title</FormLabel>
														<FormControl>
															<Input placeholder="HVAC Technician" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>

									{/* Emergency Contact */}
									<div className="space-y-4">
										<h3 className="text-lg font-medium">Emergency Contact</h3>
										<div className="grid gap-4 md:grid-cols-3">
											<FormField
												control={directForm.control}
												name="emergencyContactName"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Name</FormLabel>
														<FormControl>
															<Input placeholder="Jane Doe" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={directForm.control}
												name="emergencyContactPhone"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Phone</FormLabel>
														<FormControl>
															<Input
																type="tel"
																placeholder="+1 (555) 987-6543"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={directForm.control}
												name="emergencyContactRelationship"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Relationship</FormLabel>
														<FormControl>
															<Input placeholder="Spouse" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>

									{/* Employment Details */}
									<div className="space-y-4">
										<h3 className="text-lg font-medium">Employment Details</h3>
										<div className="grid gap-4 md:grid-cols-4">
											<FormField
												control={directForm.control}
												name="employeeId"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Employee ID</FormLabel>
														<FormControl>
															<Input placeholder="EMP-001" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={directForm.control}
												name="hireDate"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Hire Date</FormLabel>
														<FormControl>
															<Input type="date" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={directForm.control}
												name="employmentType"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Employment Type</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select type" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="full_time">
																	Full Time
																</SelectItem>
																<SelectItem value="part_time">
																	Part Time
																</SelectItem>
																<SelectItem value="contract">
																	Contract
																</SelectItem>
																<SelectItem value="temporary">
																	Temporary
																</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={directForm.control}
												name="workLocation"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Work Location</FormLabel>
														<FormControl>
															<Input
																placeholder="Office/Remote/Field"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>

									{/* Compensation */}
									<div className="space-y-4">
										<h3 className="text-lg font-medium">Compensation</h3>
										<div className="grid gap-4 md:grid-cols-4">
											<FormField
												control={directForm.control}
												name="payType"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Pay Type</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select type" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="hourly">Hourly</SelectItem>
																<SelectItem value="salary">Salary</SelectItem>
																<SelectItem value="commission">
																	Commission
																</SelectItem>
																<SelectItem value="hybrid">Hybrid</SelectItem>
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={directForm.control}
												name="hourlyRate"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Hourly Rate ($)</FormLabel>
														<FormControl>
															<Input
																type="number"
																step="0.01"
																placeholder="25.00"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={directForm.control}
												name="annualSalary"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Annual Salary ($)</FormLabel>
														<FormControl>
															<Input
																type="number"
																step="1000"
																placeholder="50000"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={directForm.control}
												name="commissionRate"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Commission Rate (%)</FormLabel>
														<FormControl>
															<Input
																type="number"
																step="0.01"
																placeholder="5.00"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>

									{/* Address */}
									<div className="space-y-4">
										<h3 className="text-lg font-medium">Address</h3>
										<FormField
											control={directForm.control}
											name="streetAddress"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Street Address</FormLabel>
													<FormControl>
														<Input placeholder="123 Main St" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="grid gap-4 md:grid-cols-4">
											<FormField
												control={directForm.control}
												name="city"
												render={({ field }) => (
													<FormItem>
														<FormLabel>City</FormLabel>
														<FormControl>
															<Input placeholder="San Francisco" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={directForm.control}
												name="state"
												render={({ field }) => (
													<FormItem>
														<FormLabel>State</FormLabel>
														<FormControl>
															<Input placeholder="CA" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={directForm.control}
												name="postalCode"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Postal Code</FormLabel>
														<FormControl>
															<Input placeholder="94105" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={directForm.control}
												name="country"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Country</FormLabel>
														<FormControl>
															<Input placeholder="US" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>

									{/* Skills & Work Preferences */}
									<div className="space-y-4">
										<h3 className="text-lg font-medium">
											Skills & Work Preferences
										</h3>
										<FormField
											control={directForm.control}
											name="skills"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Skills (comma-separated)</FormLabel>
													<FormControl>
														<Input
															placeholder="HVAC, Electrical, Plumbing"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={directForm.control}
											name="licenses"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Licenses (comma-separated)</FormLabel>
													<FormControl>
														<Input
															placeholder="EPA 608, Electrical License"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="grid gap-4 md:grid-cols-2">
											<FormField
												control={directForm.control}
												name="serviceAreas"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Service Areas</FormLabel>
														<FormControl>
															<Input
																placeholder="Downtown, North Side"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={directForm.control}
												name="maxWeeklyHours"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Max Weekly Hours</FormLabel>
														<FormControl>
															<Input
																type="number"
																placeholder="40"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>

									{/* Notes */}
									<div className="space-y-4">
										<h3 className="text-lg font-medium">Notes & Performance</h3>
										<FormField
											control={directForm.control}
											name="notes"
											render={({ field }) => (
												<FormItem>
													<FormLabel>General Notes</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Additional notes about this team member..."
															className="min-h-[100px]"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Temporary Password */}
									<div className="space-y-4">
										<h3 className="text-lg font-medium">Account Setup</h3>
										<FormField
											control={directForm.control}
											name="tempPassword"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Temporary Password</FormLabel>
													<FormControl>
														<Input
															type="password"
															placeholder="Min. 8 characters"
															{...field}
														/>
													</FormControl>
													<FormDescription>
														They will be prompted to change this password on
														first login
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="flex gap-4">
										<Button type="submit" disabled={isSubmitting}>
											{isSubmitting && (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											)}
											Create Team Member
										</Button>
										<Button
											type="button"
											variant="outline"
											onClick={() => router.push("/dashboard/work/team")}
											disabled={isSubmitting}
										>
											Cancel
										</Button>
									</div>
								</form>
							</Form>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
