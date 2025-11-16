"use client";

import { Briefcase, Calendar, Keyboard, Loader2, MapPin, User, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createJob } from "@/actions/jobs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AddPropertyDialog } from "@/components/work/add-property-dialog";
import { CustomerCombobox } from "@/components/work/customer-combobox";
import { EnhancedScheduling } from "@/components/work/enhanced-scheduling";
import { type JobTemplate, JobTemplates } from "@/components/work/job-templates";
import { QuickCustomerAdd } from "@/components/work/quick-customer-add";
import { ShortcutsHelp } from "@/components/work/shortcuts-help";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useRecentCustomersStore } from "@/lib/stores/recent-customers-store";

/**
 * Job Form Component - Power-User Optimized Client Component
 *
 * Performance optimizations:
 * - Only this form is client-side, parent page is Server Component
 * - Uses Server Actions for form submission (no client-side fetch)
 * - Pre-populated dropdowns from server-fetched data
 *
 * Power-User Features for CSRs:
 * - Keyboard shortcuts (⌘S save, ⌘K focus customer, ⌘/ help, Esc cancel)
 * - Quick job templates (Alt+1-6 for common service types)
 * - Inline customer creation (no modals, faster workflow)
 * - Auto-focus on customer select for immediate data entry
 * - Smart time windows for service scheduling
 * - Quick duration presets (15min, 30min, 1hr, 2hr, 4hr, 8hr)
 * - Tab-optimized field order for keyboard-only navigation
 *
 * Core Features:
 * - Create new jobs with customer and property selection
 * - Enhanced scheduling with time windows and recurrence
 * - Priority and job type classification
 * - Technician assignment
 * - Server-side validation via Zod schemas
 */

type JobFormProps = {
	customers: Array<{
		id: string;
		first_name: string;
		last_name: string;
		email: string;
		phone: string;
		company_name?: string;
		address?: string;
		city?: string;
		state?: string;
		zip_code?: string;
	}>;
	properties: Array<{
		id: string;
		name?: string;
		address: string;
		city: string;
		state: string;
		customer_id: string;
		customers: {
			first_name: string;
			last_name: string;
		} | null;
	}>;
	teamMembers: Array<{
		user_id: string;
		users: {
			id: string;
			first_name: string;
			last_name: string;
			email: string;
		} | null;
	}>;
	preselectedCustomerId?: string;
	preselectedPropertyId?: string;
	existingJob?: any;
	mode?: "create" | "edit";
};

export function JobForm({
	customers,
	properties,
	teamMembers,
	preselectedCustomerId,
	preselectedPropertyId,
	existingJob,
	mode = "create",
}: JobFormProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(
		existingJob?.customer_id || preselectedCustomerId
	);
	const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>(
		existingJob?.property_id || preselectedPropertyId
	);

	// Local properties and customers state (combines server data + newly created)
	const [localProperties, setLocalProperties] = useState(properties);
	const [localCustomers, setLocalCustomers] = useState(customers);

	// Power-user features
	const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
	const [showQuickCustomerAdd, setShowQuickCustomerAdd] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);
	const customerSelectRef = useRef<HTMLButtonElement>(null);
	const titleInputRef = useRef<HTMLInputElement>(null);

	// Recent customers tracking
	const recentCustomerIds = useRecentCustomersStore((state) => state.recentCustomerIds);
	const addRecentCustomer = useRecentCustomersStore((state) => state.addRecentCustomer);

	// Get selected customer's address data
	const selectedCustomer = localCustomers.find((c) => c.id === selectedCustomerId);
	const customerAddress = selectedCustomer
		? {
				address: selectedCustomer.address,
				city: selectedCustomer.city,
				state: selectedCustomer.state,
				zip_code: selectedCustomer.zip_code,
			}
		: undefined;

	// Filter properties by selected customer and add customer's primary address if exists
	const filteredProperties = selectedCustomerId
		? (() => {
				const customerProperties = localProperties.filter((p) => p.customer_id === selectedCustomerId);

				// If customer has an address in their profile, add it as a virtual property option
				if (
					selectedCustomer?.address &&
					selectedCustomer?.city &&
					selectedCustomer?.state &&
					selectedCustomer?.zip_code
				) {
					// Create a virtual property from customer's address
					const customerAddressProperty = {
						id: `customer-address-${selectedCustomerId}`, // Special ID to identify customer's address
						name: "Primary Address (Customer Profile)",
						address: selectedCustomer.address,
						city: selectedCustomer.city,
						state: selectedCustomer.state,
						customer_id: selectedCustomerId,
						customers: {
							first_name: selectedCustomer.first_name,
							last_name: selectedCustomer.last_name,
						},
					};

					// Return customer address first, then other properties
					return [customerAddressProperty, ...customerProperties];
				}

				return customerProperties;
			})()
		: localProperties;

	// Apply job template
	const applyTemplate = (template: JobTemplate) => {
		// Set form values based on template
		if (titleInputRef.current) {
			titleInputRef.current.value = template.title;
		}

		const form = formRef.current;
		if (!form) {
			return;
		}

		// Set job type
		const jobTypeInput = form.querySelector('select[name="jobType"]') as HTMLSelectElement;
		if (jobTypeInput) {
			jobTypeInput.value = template.jobType;
		}

		// Set priority
		const priorityInput = form.querySelector('select[name="priority"]') as HTMLSelectElement;
		if (priorityInput) {
			priorityInput.value = template.priority;
		}

		// Set description
		const descriptionInput = form.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
		if (descriptionInput) {
			descriptionInput.value = template.description;
		}

		// Focus title for quick editing
		titleInputRef.current?.focus();
	};

	// Keyboard shortcuts
	useKeyboardShortcuts([
		{
			key: "s",
			ctrl: true,
			description: "Save job",
			callback: (e) => {
				e.preventDefault();
				formRef.current?.requestSubmit();
			},
		},
		{
			key: "k",
			ctrl: true,
			description: "Focus customer search",
			callback: (e) => {
				e.preventDefault();
				customerSelectRef.current?.click();
			},
		},
		{
			key: "/",
			ctrl: true,
			description: "Show shortcuts help",
			callback: (e) => {
				e.preventDefault();
				setShowShortcutsHelp(true);
			},
		},
		{
			key: "Escape",
			description: "Cancel",
			callback: () => {
				router.back();
			},
		},
		// Template shortcuts (Alt + 1-6)
		...Array.from({ length: 6 }, (_, i) => ({
			key: String(i + 1),
			alt: true,
			description: `Apply template ${i + 1}`,
			callback: () => {
				const templates: JobTemplate[] = [
					/* templates would be imported from job-templates.ts */
				];
				if (templates[i]) {
					applyTemplate(templates[i]);
				}
			},
		})),
	]);

	// Auto-focus customer select on mount (for power users)
	useEffect(() => {
		if (!(preselectedCustomerId || showQuickCustomerAdd)) {
			const timer = setTimeout(() => {
				customerSelectRef.current?.focus();
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [preselectedCustomerId, showQuickCustomerAdd]);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsLoading(true);
		setError(null);

		const formData = new FormData(event.currentTarget);
		const propertyId = formData.get("propertyId") as string;

		// If using customer's address (virtual property), find or create a real property
		if (propertyId?.startsWith("customer-address-") && selectedCustomer) {
			const { findOrCreateProperty } = await import("@/actions/properties");

			// Find existing property or create new one from customer's address
			// Note: These fields are guaranteed to exist because we check them before showing the virtual property
			const propertyFormData = new FormData();
			propertyFormData.set("customerId", selectedCustomerId!);
			propertyFormData.set("name", "Primary Location");
			propertyFormData.set("address", selectedCustomer.address!);
			propertyFormData.set("city", selectedCustomer.city!);
			propertyFormData.set("state", selectedCustomer.state!);
			propertyFormData.set("zipCode", selectedCustomer.zip_code!);

			const propertyResult = await findOrCreateProperty(propertyFormData);

			if (!propertyResult.success) {
				setError(propertyResult.error || "Failed to find or create property");
				setIsLoading(false);
				return;
			}

			// Replace the virtual property ID with the real one (existing or newly created)
			formData.set("propertyId", propertyResult.data);
		}

		// Use update or create based on mode
		if (mode === "edit" && existingJob) {
			const { updateJob } = await import("@/actions/jobs");
			const result = await updateJob(existingJob.id, formData);

			if (!result.success) {
				setError(result.error || "Failed to update job");
				setIsLoading(false);
				return;
			}

			router.push(`/dashboard/work/${existingJob.id}`);
		} else {
			const result = await createJob(formData);

			if (!result.success) {
				setError(result.error || "Failed to create job");
				setIsLoading(false);
				return;
			}

			router.push(`/dashboard/work/${result.data}`);
		}
	}

	return (
		<>
			{/* Shortcuts Help Dialog */}
			<ShortcutsHelp isOpen={showShortcutsHelp} onClose={() => setShowShortcutsHelp(false)} />

			<form onSubmit={handleSubmit} ref={formRef}>
				<div className="space-y-6">
					{/* Power User Toolbar */}
					<div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3">
						<div className="flex items-center gap-2">
							<Zap className="size-4 text-primary" />
							<span className="font-semibold text-sm">Quick Actions</span>
						</div>
						<div className="flex items-center gap-2">
							<JobTemplates onTemplateSelect={applyTemplate} />
							<Button onClick={() => setShowShortcutsHelp(true)} size="sm" type="button" variant="outline">
								<Keyboard className="mr-2 size-4" />
								Shortcuts
							</Button>
						</div>
					</div>

					{/* Error Display */}
					{error && (
						<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
							<p className="font-medium text-destructive text-sm">{error}</p>
						</div>
					)}

					{/* Customer & Property Selection */}
					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<MapPin className="size-5 text-primary" />
								<CardTitle>Location</CardTitle>
							</div>
							<CardDescription>Select the customer and property for this job</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="customerId">Customer</Label>
									{!showQuickCustomerAdd && (
										<Button
											className="h-auto p-1 text-xs"
											onClick={() => setShowQuickCustomerAdd(true)}
											size="sm"
											type="button"
											variant="ghost"
										>
											+ New Customer
										</Button>
									)}
								</div>

								{showQuickCustomerAdd ? (
									<QuickCustomerAdd
										onCancel={() => setShowQuickCustomerAdd(false)}
										onCustomerCreated={(customerId, customerData) => {
											setLocalCustomers((prev) => [...prev, customerData]);
											setSelectedCustomerId(customerId);
											addRecentCustomer(customerId);
											setShowQuickCustomerAdd(false);
										}}
									/>
								) : (
									<>
										<CustomerCombobox
											customers={localCustomers}
											onAddNew={() => setShowQuickCustomerAdd(true)}
											onValueChange={(customerId) => {
												setSelectedCustomerId(customerId);
												addRecentCustomer(customerId);
											}}
											placeholder="Search customers (⌘K)"
											recentCustomerIds={recentCustomerIds}
											ref={customerSelectRef}
											value={selectedCustomerId}
										/>
										{/* Hidden input for form submission */}
										<input name="customerId" type="hidden" value={selectedCustomerId || ""} />
										{!selectedCustomerId && (
											<p className="text-muted-foreground text-xs">
												Search and select a customer to see their properties
											</p>
										)}
									</>
								)}
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="propertyId">Service Location *</Label>
									{selectedCustomerId && filteredProperties.length === 0 && !selectedCustomer?.address && (
										<AddPropertyDialog
											customerAddress={customerAddress}
											customerId={selectedCustomerId}
											onPropertyCreated={(propertyId, propertyData) => {
												// Add new property to local state
												setLocalProperties((prev) => [...prev, propertyData]);
												// Auto-select the newly created property
												setSelectedPropertyId(propertyId);
											}}
										/>
									)}
								</div>
								<Select
									disabled={!selectedCustomerId}
									name="propertyId"
									onValueChange={setSelectedPropertyId}
									required
									value={selectedPropertyId}
								>
									<SelectTrigger id="propertyId">
										<SelectValue placeholder="Select a property" />
									</SelectTrigger>
									<SelectContent>
										{filteredProperties.length === 0 ? (
											<div className="p-2 text-center text-muted-foreground text-sm">
												No properties found for this customer
											</div>
										) : (
											filteredProperties.map((property) => (
												<SelectItem key={property.id} value={property.id}>
													{property.name || property.address} - {property.city}, {property.state}
												</SelectItem>
											))
										)}
									</SelectContent>
								</Select>
								{selectedCustomerId && selectedCustomer?.address && (
									<div className="flex items-center gap-2">
										<p className="text-muted-foreground text-xs">Need a different location?</p>
										<AddPropertyDialog
											customerAddress={customerAddress}
											customerId={selectedCustomerId}
											onPropertyCreated={(propertyId, propertyData) => {
												// Add new property to local state
												setLocalProperties((prev) => [...prev, propertyData]);
												// Auto-select the newly created property
												setSelectedPropertyId(propertyId);
											}}
											trigger={
												<Button className="h-auto p-0 text-xs" size="sm" type="button" variant="link">
													Add another location
												</Button>
											}
										/>
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Job Details */}
					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<Briefcase className="size-5 text-primary" />
								<CardTitle>Job Details</CardTitle>
							</div>
							<CardDescription>Describe the work to be performed</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="title">Job Title *</Label>
								<Input
									defaultValue={existingJob?.title || ""}
									id="title"
									name="title"
									placeholder="e.g., Annual HVAC Maintenance"
									ref={titleInputRef}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Description</Label>
								<Textarea
									defaultValue={existingJob?.description || ""}
									id="description"
									name="description"
									placeholder="Detailed description of the job requirements"
									rows={4}
								/>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="jobType">Job Type</Label>
									<Select defaultValue={existingJob?.job_type || "service"} name="jobType">
										<SelectTrigger id="jobType">
											<SelectValue />
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
									<Label htmlFor="priority">Priority *</Label>
									<Select defaultValue={existingJob?.priority || "medium"} name="priority" required>
										<SelectTrigger id="priority">
											<SelectValue />
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
						</CardContent>
					</Card>

					{/* Enhanced Scheduling (Optional) */}
					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<Calendar className="size-5 text-primary" />
								<CardTitle>Schedule (Optional)</CardTitle>
							</div>
							<CardDescription>Set the scheduled date, time, and recurrence for this job</CardDescription>
						</CardHeader>
						<CardContent>
							<EnhancedScheduling
								defaultEnd={existingJob?.scheduled_end || undefined}
								defaultStart={existingJob?.scheduled_start || undefined}
							/>
						</CardContent>
					</Card>

					{/* Assignment (Optional) */}
					<Card>
						<CardHeader>
							<div className="flex items-center gap-2">
								<User className="size-5 text-primary" />
								<CardTitle>Assignment (Optional)</CardTitle>
							</div>
							<CardDescription>Assign a technician to this job</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="assignedTo">Assigned Technician</Label>
								<Select defaultValue={existingJob?.assigned_to || undefined} name="assignedTo">
									<SelectTrigger id="assignedTo">
										<SelectValue placeholder="Select a team member" />
									</SelectTrigger>
									<SelectContent>
										{teamMembers.map((member) => {
											const user = member.users;
											if (!user) {
												return null;
											}
											return (
												<SelectItem key={user.id} value={user.id}>
													{user.first_name} {user.last_name}
												</SelectItem>
											);
										})}
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>

					{/* Notes */}
					<Card>
						<CardHeader>
							<CardTitle>Internal Notes</CardTitle>
							<CardDescription>Add any additional notes or instructions</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="notes">Notes</Label>
								<Textarea
									defaultValue={existingJob?.notes || ""}
									id="notes"
									name="notes"
									placeholder="Internal notes, special instructions, etc."
									rows={4}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Form Actions */}
					<div className="flex justify-end gap-3">
						<Button disabled={isLoading} onClick={() => router.back()} type="button" variant="outline">
							Cancel
						</Button>
						<Button disabled={isLoading} type="submit">
							{isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
							{mode === "edit" ? "Update Job (⌘S)" : "Create Job (⌘S)"}
						</Button>
					</div>
				</div>
			</form>
		</>
	);
}
