"use client";

/**
 * Job Create Form
 *
 * Form for creating new jobs/work orders.
 * Supports pre-filled data from various sources (schedule, clone, etc.)
 */

import { format } from "date-fns";
import {
	AlertCircle,
	Briefcase,
	Calendar,
	FileText,
	Loader2,
	MapPin,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { createJob } from "@/actions/jobs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Customer = {
	id: string;
	first_name: string | null;
	last_name: string | null;
	display_name: string | null;
	email: string | null;
	phone: string | null;
};

type Property = {
	id: string;
	customer_id: string | null;
	address: string | null;
	city: string | null;
	state: string | null;
	zip_code: string | null;
};

type TeamMember = {
	id: string;
	userId: string | null;
	name: string;
	jobTitle: string | null;
};

type DefaultValues = {
	customerId?: string;
	propertyId?: string;
	assignedTo?: string;
	scheduledStart?: string;
	title?: string;
	description?: string;
	priority?: string;
	jobType?: string;
	notes?: string;
};

type JobCreateFormProps = {
	customers: Customer[];
	properties: Property[];
	teamMembers: TeamMember[];
	defaultValues?: DefaultValues;
};

export function JobCreateForm({
	customers,
	properties,
	teamMembers,
	defaultValues,
}: JobCreateFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	// Form state
	const [selectedCustomerId, setSelectedCustomerId] = useState(
		defaultValues?.customerId || "",
	);
	const [selectedPropertyId, setSelectedPropertyId] = useState(
		defaultValues?.propertyId || "",
	);
	const [assignedTo, setAssignedTo] = useState(defaultValues?.assignedTo || "");
	const [title, setTitle] = useState(defaultValues?.title || "");
	const [description, setDescription] = useState(
		defaultValues?.description || "",
	);
	const [priority, setPriority] = useState(defaultValues?.priority || "medium");
	const [jobType, setJobType] = useState(defaultValues?.jobType || "");
	const [scheduledStart, setScheduledStart] = useState(
		defaultValues?.scheduledStart
			? format(new Date(defaultValues.scheduledStart), "yyyy-MM-dd'T'HH:mm")
			: "",
	);
	const [scheduledEnd, setScheduledEnd] = useState("");
	const [notes, setNotes] = useState(defaultValues?.notes || "");

	// Filter properties by selected customer
	const filteredProperties = useMemo(() => {
		if (!selectedCustomerId) {
			return properties;
		}
		return properties.filter((p) => p.customer_id === selectedCustomerId);
	}, [properties, selectedCustomerId]);

	// Get customer name for display
	const getCustomerName = (customer: Customer) => {
		if (customer.display_name) return customer.display_name;
		if (customer.first_name || customer.last_name) {
			return `${customer.first_name || ""} ${customer.last_name || ""}`.trim();
		}
		return customer.email || "Unknown";
	};

	// Get property address for display
	const getPropertyAddress = (property: Property) => {
		const parts = [property.address, property.city, property.state].filter(
			Boolean,
		);
		return parts.join(", ") || "Unknown address";
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);

		if (!selectedPropertyId) {
			setError("Please select a property for this job");
			return;
		}

		if (!title.trim()) {
			setError("Please enter a job title");
			return;
		}

		startTransition(async () => {
			const formData = new FormData();
			formData.set("propertyId", selectedPropertyId);
			if (selectedCustomerId) formData.set("customerId", selectedCustomerId);
			formData.set("title", title);
			if (description) formData.set("description", description);
			formData.set("priority", priority);
			if (jobType) formData.set("jobType", jobType);
			if (scheduledStart) formData.set("scheduledStart", scheduledStart);
			if (scheduledEnd) formData.set("scheduledEnd", scheduledEnd);
			if (assignedTo) formData.set("assignedTo", assignedTo);
			if (notes) formData.set("notes", notes);

			const result = await createJob(formData);

			if (!result.success) {
				setError(result.error || "Failed to create job");
				return;
			}

			// Navigate to the new job
			if (result.data) {
				router.push(`/dashboard/work/${result.data}`);
			} else {
				router.push("/dashboard/work");
			}
		});
	};

	// Handle customer change - also update property if needed
	const handleCustomerChange = (customerId: string) => {
		setSelectedCustomerId(customerId);

		// If current property doesn't belong to new customer, clear it
		if (selectedPropertyId) {
			const currentProperty = properties.find(
				(p) => p.id === selectedPropertyId,
			);
			if (currentProperty && currentProperty.customer_id !== customerId) {
				setSelectedPropertyId("");
			}
		}

		// Auto-select first property for new customer
		const customerProperties = properties.filter(
			(p) => p.customer_id === customerId,
		);
		if (customerProperties.length === 1) {
			setSelectedPropertyId(customerProperties[0].id);
		}
	};

	return (
		<div className="container max-w-3xl py-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Briefcase className="h-5 w-5" />
						Create New Job
					</CardTitle>
					<CardDescription>
						Fill in the details below to create a new work order
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						{error && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						{/* Customer & Property Selection */}
						<div className="space-y-4">
							<h3 className="flex items-center gap-2 text-sm font-medium">
								<User className="h-4 w-4" />
								Customer & Location
							</h3>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="customer">Customer</Label>
									<Select
										value={selectedCustomerId}
										onValueChange={handleCustomerChange}
									>
										<SelectTrigger id="customer">
											<SelectValue placeholder="Select customer" />
										</SelectTrigger>
										<SelectContent>
											{customers.map((customer) => (
												<SelectItem key={customer.id} value={customer.id}>
													{getCustomerName(customer)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="property">
										Property <span className="text-destructive">*</span>
									</Label>
									<Select
										value={selectedPropertyId}
										onValueChange={setSelectedPropertyId}
									>
										<SelectTrigger
											id="property"
											className={cn(
												!selectedPropertyId && "text-muted-foreground",
											)}
										>
											<SelectValue placeholder="Select property" />
										</SelectTrigger>
										<SelectContent>
											{filteredProperties.map((property) => (
												<SelectItem key={property.id} value={property.id}>
													<div className="flex items-center gap-2">
														<MapPin className="h-3 w-3 text-muted-foreground" />
														{getPropertyAddress(property)}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>

						{/* Job Details */}
						<div className="space-y-4">
							<h3 className="flex items-center gap-2 text-sm font-medium">
								<FileText className="h-4 w-4" />
								Job Details
							</h3>

							<div className="space-y-2">
								<Label htmlFor="title">
									Title <span className="text-destructive">*</span>
								</Label>
								<Input
									id="title"
									placeholder="e.g., HVAC Maintenance, Plumbing Repair"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Description</Label>
								<Textarea
									id="description"
									placeholder="Describe the work to be done..."
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									rows={3}
								/>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="jobType">Job Type</Label>
									<Select value={jobType} onValueChange={setJobType}>
										<SelectTrigger id="jobType">
											<SelectValue placeholder="Select type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="service">Service</SelectItem>
											<SelectItem value="installation">Installation</SelectItem>
											<SelectItem value="repair">Repair</SelectItem>
											<SelectItem value="maintenance">Maintenance</SelectItem>
											<SelectItem value="inspection">Inspection</SelectItem>
											<SelectItem value="consultation">Consultation</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="priority">Priority</Label>
									<Select value={priority} onValueChange={setPriority}>
										<SelectTrigger id="priority">
											<SelectValue placeholder="Select priority" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="low">Low</SelectItem>
											<SelectItem value="medium">Medium</SelectItem>
											<SelectItem value="high">High</SelectItem>
											<SelectItem value="urgent">Urgent</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>

						{/* Schedule */}
						<div className="space-y-4">
							<h3 className="flex items-center gap-2 text-sm font-medium">
								<Calendar className="h-4 w-4" />
								Schedule
							</h3>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="scheduledStart">Start Date & Time</Label>
									<Input
										id="scheduledStart"
										type="datetime-local"
										value={scheduledStart}
										onChange={(e) => setScheduledStart(e.target.value)}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="scheduledEnd">End Date & Time</Label>
									<Input
										id="scheduledEnd"
										type="datetime-local"
										value={scheduledEnd}
										onChange={(e) => setScheduledEnd(e.target.value)}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="assignedTo">Assign To</Label>
								<Select value={assignedTo} onValueChange={setAssignedTo}>
									<SelectTrigger id="assignedTo">
										<SelectValue placeholder="Select team member" />
									</SelectTrigger>
									<SelectContent>
										{teamMembers.map((member) => (
											<SelectItem key={member.id} value={member.id}>
												{member.name}
												{member.jobTitle && (
													<span className="text-muted-foreground">
														{" "}
														- {member.jobTitle}
													</span>
												)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Notes */}
						<div className="space-y-2">
							<Label htmlFor="notes">Internal Notes</Label>
							<Textarea
								id="notes"
								placeholder="Add any internal notes..."
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								rows={2}
							/>
						</div>

						{/* Actions */}
						<div className="flex items-center justify-end gap-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => router.back()}
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating...
									</>
								) : (
									"Create Job"
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
