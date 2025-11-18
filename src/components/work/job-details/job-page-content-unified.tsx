/**
 * Job Page Content - Comprehensive Job Details
 *
 * Matches the invoice details page pattern with full collapsible sections
 * for all entities related to a job.
 *
 * Sections:
 * - Job Information (title, status, dates, priority)
 * - Customer (customer info with link)
 * - Property (service location with link)
 * - Estimates (linked estimates)
 * - Invoices (linked invoices)
 * - Payments (payment history)
 * - Equipment (equipment serviced on this job)
 * - Materials (materials used)
 * - Team (assigned team members)
 * - Time Tracking (time entries)
 * - Schedules (appointments for this job)
 * - Photos (categorized job photos)
 * - Documents (job documents)
 * - Notes (job notes)
 * - Activity Log (job history)
 * - Attachments (job attachments)
 */

"use client";

import {
	Building2,
	Calendar,
	Camera,
	CheckCircle2,
	Clock,
	DollarSign,
	FileText,
	Link2,
	Loader2,
	MapPin,
	Package,
	Plus,
	Receipt,
	UserPlus,
	Users,
	UserX,
	Wrench,
	X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { updateEntityTags } from "@/actions/entity-tags";
import { archiveJob, updateJob } from "@/actions/jobs";
import { DetailPageContentLayout } from "@/components/layout/detail-page-content-layout";
import { EntityTags } from "@/components/shared/tags/entity-tags";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	UnifiedAccordionContent,
	type UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";
import { CustomerSearchCombobox } from "@/components/work/job-creation/customer-search-combobox";
import { InlineCustomerForm } from "@/components/work/job-creation/inline-customer-form";
import { InlinePropertyForm } from "@/components/work/job-creation/inline-property-form";
import {
	CustomerInfoHoverCard,
	PropertyInfoHoverCard,
	TechnicianInfoHoverCard,
} from "./info-hover-cards";
import { JobEnrichmentInline } from "./job-enrichment-inline";
import {
	CSRJobInfo,
	ManagerJobMetrics,
	TechJobInfo,
} from "./role-based-headers";
import { JobCustomer } from "./sections/job-customer";
import { JobDocuments } from "./sections/job-documents";
import { JobEquipment } from "./sections/job-equipment";
import { JobEstimates } from "./sections/job-estimates";
import { JobHeader } from "./sections/job-header";
import { JobInvoices } from "./sections/job-invoices";
import { JobMaterials } from "./sections/job-materials";
import { JobPayments } from "./sections/job-payments";
import { JobPhotos } from "./sections/job-photos";
import { JobProperty } from "./sections/job-property";
import { JobSchedules } from "./sections/job-schedules";
import { JobTeam } from "./sections/job-team";
import { JobTimeTracking } from "./sections/job-time-tracking";
import { CompanyCreditBadge } from "./smart-badges/company-credit-badge";
import { LinkedDataAlerts } from "./smart-badges/linked-data-alerts";

export type JobData = {
	job: any;
	customer?: any;
	property?: any;
	assignedUser?: any;
	teamAssignments?: any[];
	timeEntries?: any[];
	invoices?: any[];
	estimates?: any[];
	payments?: any[];
	purchaseOrders?: any[];
	tasks?: any[];
	photos?: any[];
	documents?: any[];
	signatures?: any[];
	activities?: any[];
	communications?: any[];
	equipment?: any[];
	jobEquipment?: any[];
	jobMaterials?: any[];
	jobNotes?: any[];
	schedules?: any[];
	allCustomers?: any[];
	allProperties?: any[];
	companyPhones?: any[];
	enrichmentData?: any;
	userRole?:
		| "owner"
		| "admin"
		| "manager"
		| "dispatcher"
		| "technician"
		| "csr"
		| null;
};

export type JobPageContentProps = {
	entityData: JobData;
	metrics?: any;
};

function _formatCurrency(amount: number | null | undefined): string {
	if (amount === null || amount === undefined) {
		return "$0.00";
	}
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(amount);
}

export function JobPageContentUnified({
	entityData,
	metrics,
}: JobPageContentProps) {
	const router = useRouter();
	const [job, setJob] = useState(entityData.job);
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);
	const [isCustomerManagerOpen, setIsCustomerManagerOpen] = useState(false);
	const [selectedCustomerForDialog, setSelectedCustomerForDialog] = useState<
		any | null
	>(null);
	const [showCustomerCreateForm, setShowCustomerCreateForm] = useState(false);
	const [isUpdatingCustomer, setIsUpdatingCustomer] = useState(false);
	const [isRemoveCustomerDialogOpen, setIsRemoveCustomerDialogOpen] =
		useState(false);
	const [isPropertyManagerOpen, setIsPropertyManagerOpen] = useState(false);
	const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
		null,
	);
	const [showPropertyCreateForm, setShowPropertyCreateForm] = useState(false);
	const [isUpdatingProperty, setIsUpdatingProperty] = useState(false);
	const [isRemovePropertyDialogOpen, setIsRemovePropertyDialogOpen] =
		useState(false);

	const {
		customer,
		property,
		assignedUser,
		teamAssignments = [],
		timeEntries = [],
		invoices = [],
		estimates = [],
		payments = [],
		purchaseOrders = [],
		tasks = [],
		photos = [],
		documents = [],
		signatures = [],
		activities = [],
		communications = [],
		equipment = [],
		jobEquipment = [],
		jobMaterials = [],
		jobNotes = [],
		schedules = [],
		allCustomers = [],
		allProperties = [],
		companyPhones = [],
		enrichmentData = null,
		userRole = "technician",
	} = entityData;

	useEffect(() => {
		if (isCustomerManagerOpen) {
			const currentFromList =
				customer && Array.isArray(allCustomers)
					? allCustomers.find((c: any) => c.id === customer.id)
					: null;
			setSelectedCustomerForDialog(currentFromList || customer || null);
			setShowCustomerCreateForm(false);
		}
	}, [isCustomerManagerOpen, customer, allCustomers]);

	useEffect(() => {
		if (isPropertyManagerOpen) {
			setSelectedPropertyId(property?.id ?? null);
			setShowPropertyCreateForm(false);
		}
	}, [isPropertyManagerOpen, property?.id]);

	// Update job field
	const updateField = useCallback((field: string, value: any) => {
		setJob((prev: any) => ({ ...prev, [field]: value }));
	}, []);

	const handleArchiveJob = async () => {
		setIsArchiving(true);
		try {
			const result = await archiveJob(job.id);
			if (result.success) {
				toast.success("Job archived successfully");
				setIsArchiveDialogOpen(false);
				// Redirect to jobs list
				window.location.href = "/dashboard/work";
			} else {
				toast.error(result.error || "Failed to archive job");
			}
		} catch (_error) {
			toast.error("Failed to archive job");
		} finally {
			setIsArchiving(false);
		}
	};

	const statusBadgeVariant =
		job.status === "completed"
			? "default"
			: job.status === "in_progress"
				? "secondary"
				: job.status === "cancelled"
					? "destructive"
					: "outline";

	const headerBadges = [
		<Badge key="id" variant="outline">
			{job.job_number || `JOB-${job.id.slice(0, 8).toUpperCase()}`}
		</Badge>,
		<Badge key="status" variant={statusBadgeVariant}>
			{job.status || "scheduled"}
		</Badge>,
		job.priority && (
			<Badge className="capitalize" key="priority" variant="outline">
				{job.priority} Priority
			</Badge>
		),
	].filter(Boolean);

	const jobTags = Array.isArray(job?.metadata?.tags)
		? (job.metadata.tags as any[])
		: [];

	const filteredProperties = useMemo(() => {
		if (!(customer?.id && Array.isArray(allProperties))) {
			return [];
		}

		const matches = allProperties.filter(
			(prop: any) =>
				prop.customer_id === customer.id || prop.customerId === customer.id,
		);

		if (
			property?.id &&
			!matches.some((prop: any) => prop.id === property.id) &&
			Array.isArray(allProperties)
		) {
			const currentProp = allProperties.find(
				(prop: any) => prop.id === property.id,
			);
			if (currentProp) {
				return [currentProp, ...matches];
			}
		}

		return matches;
	}, [allProperties, customer?.id, property?.id]);

	const handleCustomerAssignment = useCallback(
		async (customerId: string) => {
			if (!customerId) {
				toast.error("Select a customer to continue");
				return;
			}

			if (customer?.id === customerId) {
				toast.info("This customer is already assigned to the job");
				return;
			}

			const propertyCustomerId = property?.customer_id ?? property?.customerId;

			setIsUpdatingCustomer(true);
			try {
				const formData = new FormData();
				formData.append("customerId", customerId);
				if (propertyCustomerId && propertyCustomerId !== customerId) {
					formData.append("propertyId", "");
				}

				const result = await updateJob(job.id, formData);
				if (result.success) {
					toast.success("Customer updated");
					setIsCustomerManagerOpen(false);
					setIsRemoveCustomerDialogOpen(false);
					// Server Action handles revalidation automatically
				} else {
					toast.error(result.error || "Failed to update customer");
				}
			} catch (_error) {
				toast.error("Failed to update customer");
			} finally {
				setIsUpdatingCustomer(false);
			}
		},
		[customer?.id, job.id, property?.customerId, property?.customer_id, router],
	);

	const handleRemoveCustomer = useCallback(async () => {
		setIsUpdatingCustomer(true);
		try {
			const formData = new FormData();
			formData.append("customerId", "");
			formData.append("propertyId", "");

			const result = await updateJob(job.id, formData);
			if (result.success) {
				toast.success("Customer removed from job");
				setIsRemoveCustomerDialogOpen(false);
				setIsCustomerManagerOpen(false);
				// Server Action handles revalidation automatically
			} else {
				toast.error(result.error || "Failed to remove customer");
			}
		} catch (_error) {
			toast.error("Failed to remove customer");
		} finally {
			setIsUpdatingCustomer(false);
		}
	}, [job.id, router]);

	const handlePropertyAssignment = useCallback(
		async (propertyId: string) => {
			if (!customer?.id) {
				toast.error("Assign a customer before selecting a property");
				return;
			}

			if (property?.id === propertyId) {
				toast.info("This property is already assigned to the job");
				return;
			}

			setIsUpdatingProperty(true);
			try {
				const formData = new FormData();
				formData.append("propertyId", propertyId);

				const result = await updateJob(job.id, formData);
				if (result.success) {
					toast.success("Property updated");
					setIsPropertyManagerOpen(false);
					setIsRemovePropertyDialogOpen(false);
					// Server Action handles revalidation automatically
				} else {
					toast.error(result.error || "Failed to update property");
				}
			} catch (_error) {
				toast.error("Failed to update property");
			} finally {
				setIsUpdatingProperty(false);
			}
		},
		[customer?.id, job.id, property?.id, router],
	);

	const handleRemoveProperty = useCallback(async () => {
		setIsUpdatingProperty(true);
		try {
			const formData = new FormData();
			formData.append("propertyId", "");

			const result = await updateJob(job.id, formData);
			if (result.success) {
				toast.success("Property removed from job");
				setIsRemovePropertyDialogOpen(false);
				// Server Action handles revalidation automatically
			} else {
				toast.error(result.error || "Failed to remove property");
			}
		} catch (_error) {
			toast.error("Failed to remove property");
		} finally {
			setIsUpdatingProperty(false);
		}
	}, [job.id, router]);

	const showCreatedDate = !job.scheduled_start && !!job.created_at;

	const assignedTechnicians = useMemo(() => {
		const technicians: { id: string; name: string }[] = [];
		const seen = new Set<string>();

		const registerTechnician = (
			idCandidate: string | null | undefined,
			nameCandidate: string | null | undefined,
		) => {
			if (!(idCandidate || nameCandidate)) {
				return;
			}
			const identifier =
				idCandidate ?? nameCandidate ?? `tech-${technicians.length}`;
			if (seen.has(identifier)) {
				return;
			}
			seen.add(identifier);
			technicians.push({
				id: identifier,
				name: nameCandidate || "Technician",
			});
		};

		if (assignedUser) {
			registerTechnician(
				assignedUser.id || assignedUser.user_id || assignedUser.email,
				assignedUser.name || assignedUser.email || assignedUser.phone,
			);
		}

		teamAssignments.forEach((assignment) => {
			const teamMember = assignment?.team_member;
			const nestedUser = Array.isArray(teamMember?.users)
				? teamMember?.users[0]
				: teamMember?.users || teamMember?.user || assignment?.user;

			registerTechnician(
				nestedUser?.id ||
					teamMember?.user_id ||
					assignment?.team_member_id ||
					assignment?.id,
				nestedUser?.name ||
					teamMember?.display_name ||
					nestedUser?.email ||
					assignment?.role,
			);
		});

		return technicians;
	}, [assignedUser, teamAssignments]);

	const technicianBadge = useMemo(() => {
		if (assignedTechnicians.length === 0) {
			return null;
		}

		const DISPLAY_LIMIT = 3;
		const visibleNames = assignedTechnicians
			.slice(0, DISPLAY_LIMIT)
			.map((tech) => tech.name || "Technician");
		const remaining = assignedTechnicians.length - visibleNames.length;
		const label =
			remaining > 0
				? `${visibleNames.join(", ")} +${remaining} more`
				: visibleNames.join(", ");

		return {
			label,
			tooltip: assignedTechnicians
				.map((tech) => tech.name || "Technician")
				.join(", "),
		};
	}, [assignedTechnicians]);

	const customHeader = (
		<div className="w-full px-2 sm:px-0">
			<div className="bg-muted/50 mx-auto max-w-7xl rounded-md shadow-sm">
				<div className="flex flex-col gap-4 p-4 sm:p-6">
					<div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
						<div className="flex flex-col gap-4">
							<div className="flex flex-wrap items-center gap-2">
								{headerBadges}
							</div>
							<div className="flex flex-col gap-2">
								<h1 className="text-2xl font-semibold sm:text-3xl">
									{job.title || `Job ${job.job_number || ""}`}
								</h1>
								<div className="flex flex-wrap items-center gap-2">
									<EntityTags
										entityId={job.id}
										entityType="job"
										onUpdateTags={(id, tags) =>
											updateEntityTags("job", id, tags)
										}
										tags={jobTags}
									/>
								</div>
								{showCreatedDate && (
									<p className="text-muted-foreground text-sm sm:text-base">
										{new Date(job.created_at as string).toLocaleDateString(
											"en-US",
											{
												year: "numeric",
												month: "long",
												day: "numeric",
											},
										)}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Customer, Property, and Team Quick Access */}
					<div className="flex flex-wrap items-center gap-2">
						{customer && <CustomerInfoHoverCard customer={customer} />}

						{property && <PropertyInfoHoverCard property={property} />}

						{(assignedUser || teamAssignments.length > 0) && (
							<TechnicianInfoHoverCard
								teamMembers={teamAssignments}
								technician={assignedUser}
							/>
						)}
					</div>

					{/* Quick Info Badges - Large Elegant Style - FIXED-0-BUG */}
					<div className="flex flex-wrap items-center gap-2">
						{/* Property Address Badge */}
						{property && (
							<div className="border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors">
								<MapPin className="size-4" />
								{property.city && property.state
									? `${property.city}, ${property.state}`
									: property.address || "Location"}
							</div>
						)}

						{/* Assigned Technicians */}
						{technicianBadge && (
							<div
								className="border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5 inline-flex max-w-full items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
								title={technicianBadge.tooltip}
							>
								<Users className="size-4 shrink-0" />
								<span className="truncate">{technicianBadge.label}</span>
							</div>
						)}

						{/* Service Type */}
						{(job.service_type || job.ai?.service_type) && (
							<div className="border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors">
								<Wrench className="size-4" />
								{job.service_type || job.ai?.service_type}
							</div>
						)}

						{/* Scheduled Date */}
						{job.scheduled_start && (
							<div className="border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors">
								<Calendar className="size-4" />
								{new Date(job.scheduled_start).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								})}
								{job.scheduled_end &&
									new Date(job.scheduled_start).toDateString() !==
										new Date(job.scheduled_end).toDateString() &&
									` - ${new Date(job.scheduled_end).toLocaleDateString(
										"en-US",
										{
											month: "short",
											day: "numeric",
										},
									)}`}
							</div>
						)}

						{/* Job Value */}
						{(job.financial?.total_amount ?? 0) > 0 && (
							<div className="border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors">
								<DollarSign className="size-4" />
								{new Intl.NumberFormat("en-US", {
									style: "currency",
									currency: "USD",
									minimumFractionDigits: 0,
								}).format(job.financial?.total_amount ?? 0)}
							</div>
						)}

						{/* Deposit Status */}
						{(job.financial?.deposit_amount ?? 0) > 0 && (
							<div
								className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
									job.financial?.deposit_paid_at
										? "border-green-200 bg-green-50 text-green-700 hover:border-green-300 hover:bg-green-100 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400 dark:hover:border-green-900/40 dark:hover:bg-green-900/30"
										: "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:border-amber-900/40 dark:hover:bg-amber-900/30"
								}`}
							>
								<DollarSign className="size-4" />
								Deposit{" "}
								{job.financial?.deposit_paid_at
									? "Paid"
									: `Due: ${new Intl.NumberFormat("en-US", {
											style: "currency",
											currency: "USD",
											minimumFractionDigits: 0,
										}).format(job.financial?.deposit_amount ?? 0)}`}
							</div>
						)}

						{/* Team Size */}
						{teamAssignments && teamAssignments.length > 1 && (
							<div className="border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors">
								<Users className="size-4" />
								{teamAssignments.length} Team Members
							</div>
						)}

						{/* Equipment Count */}
						{jobEquipment && jobEquipment.length > 0 && (
							<div className="border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors">
								<Wrench className="size-4" />
								{jobEquipment.length} Equipment
							</div>
						)}

						{/* Task Completion */}
						{tasks && tasks.length > 0 && (
							<div
								className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
									tasks.every((t: any) => t.status === "completed")
										? "border-green-200 bg-green-50 text-green-700 hover:border-green-300 hover:bg-green-100 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400 dark:hover:border-green-900/40 dark:hover:bg-green-900/30"
										: "border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5"
								}`}
							>
								<CheckCircle2 className="size-4" />
								{tasks.filter((t: any) => t.status === "completed").length}/
								{tasks.length} Tasks
							</div>
						)}

						{/* Time Tracked */}
						{timeEntries && timeEntries.length > 0 && (
							<div className="border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors">
								<Clock className="size-4" />
								{timeEntries
									.reduce(
										(sum: number, t: any) => sum + (t.total_hours || 0),
										0,
									)
									.toFixed(1)}
								h
								{job.timeTracking?.estimated_labor_hours &&
									` / ${job.timeTracking?.estimated_labor_hours}h`}
							</div>
						)}

						{/* Invoice Status */}
						{invoices && invoices.length > 0 && (
							<div
								className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
									invoices.some((inv: any) => inv.balance_amount > 0)
										? "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-900/40 dark:hover:bg-red-900/30"
										: "border-green-200 bg-green-50 text-green-700 hover:border-green-300 hover:bg-green-100 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400 dark:hover:border-green-900/40 dark:hover:bg-green-900/30"
								}`}
							>
								<FileText className="size-4" />
								{invoices.length} Invoice
								{invoices.length !== 1 ? "s" : ""}
								{invoices.some((inv: any) => inv.balance_amount > 0) &&
									" (Due)"}
							</div>
						)}

						{/* Photos Count */}
						{photos && photos.length > 0 && (
							<div className="border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors">
								<Camera className="size-4" />
								{photos.length} Photo{photos.length !== 1 ? "s" : ""}
							</div>
						)}
					</div>

					{/* Badges Section */}
					<div className="flex flex-col gap-3">
						{/* Role-Based Metrics */}
						<div className="flex flex-wrap items-center gap-3">
							{/* Owners and Admins see everything */}
							{(userRole === "owner" || userRole === "admin") && (
								<>
									<ManagerJobMetrics metrics={metrics || {}} />
									<CSRJobInfo
										appointmentStatus={metrics?.appointmentStatus}
										communications={communications}
										customer={customer}
										lastContact={metrics?.lastContact}
										nextAppointment={metrics?.nextAppointment}
										schedules={schedules}
									/>
									<TechJobInfo
										documents={documents}
										equipment={equipment}
										jobEquipment={jobEquipment}
										materials={jobMaterials}
										notes={jobNotes}
										photos={photos}
										property={property}
									/>
								</>
							)}

							{/* Managers see financial metrics */}
							{userRole === "manager" && (
								<ManagerJobMetrics metrics={metrics || {}} />
							)}

							{/* CSRs and Dispatchers see customer and scheduling info */}
							{(userRole === "csr" || userRole === "dispatcher") && (
								<CSRJobInfo
									appointmentStatus={metrics?.appointmentStatus}
									communications={communications}
									customer={customer}
									lastContact={metrics?.lastContact}
									nextAppointment={metrics?.nextAppointment}
									schedules={schedules}
								/>
							)}

							{/* Technicians see field work info */}
							{userRole === "technician" && (
								<TechJobInfo
									documents={documents}
									equipment={equipment}
									jobEquipment={jobEquipment}
									materials={jobMaterials}
									notes={jobNotes}
									photos={photos}
									property={property}
								/>
							)}
						</div>

						{/* Common Badges: Tags, Credits, Alerts */}
						<div className="flex flex-col gap-3">
							{/* Customer Tags */}
							{customer?.id && (
								<div className="flex flex-wrap items-center gap-2">
									<span className="text-muted-foreground text-xs font-medium">
										Customer:
									</span>
									<EntityTags
										entityId={customer.id}
										entityType="customer"
										onUpdateTags={(id, tags) =>
											updateEntityTags("customer", id, tags)
										}
										tags={customer.tags || []}
									/>
								</div>
							)}

							{/* Smart Badges Row */}
							<div className="flex flex-wrap items-center gap-3">
								{/* Company Credit */}
								{customer && (
									<CompanyCreditBadge
										customer={{
											credit_limit: customer.credit_limit,
											outstanding_balance: customer.outstanding_balance,
										}}
									/>
								)}

								{/* Smart Alerts */}
								<LinkedDataAlerts
									estimates={estimates}
									invoices={invoices}
									job={{
										id: job.id,
										deposit_amount: job.financial?.deposit_amount,
										deposit_paid_at: job.financial?.deposit_paid_at,
										scheduled_end: job.scheduled_end,
										status: job.status,
									}}
								/>
							</div>
						</div>
					</div>

					{/* Enrichment Data - Weather, Traffic as Badges */}
					<JobEnrichmentInline
						enrichmentData={enrichmentData}
						jobId={job.id}
						property={
							property
								? {
										address: property.address ?? undefined,
										city: property.city ?? undefined,
										state: property.state ?? undefined,
										zip_code: property.zip_code ?? undefined,
										lat: property.lat ?? undefined,
										lon: property.lon ?? undefined,
									}
								: undefined
						}
					/>
				</div>
			</div>
		</div>
	);

	const customSections = useMemo<UnifiedAccordionSection[]>(() => {
		const sections: UnifiedAccordionSection[] = [];

		// Job Information Section
		sections.push({
			id: "job-info",
			title: "Job Information",
			icon: <Wrench className="size-4" />,
			defaultOpen: true,
			content: (
				<UnifiedAccordionContent>
					<JobHeader job={job} onUpdate={updateField} />
				</UnifiedAccordionContent>
			),
		});

		// Customer Section
		sections.push({
			id: "customer",
			title: "Customer",
			icon: <Users className="size-4" />,
			count: customer ? 1 : 0,
			actions: (
				<div className="flex items-center gap-2">
					<Button
						disabled={isUpdatingCustomer}
						onClick={() => setIsCustomerManagerOpen(true)}
						size="sm"
						variant="outline"
					>
						<UserPlus className="size-3.5" />
						{customer ? "Change Customer" : "Add Customer"}
					</Button>
					{customer && (
						<Button
							disabled={isUpdatingCustomer}
							onClick={() => setIsRemoveCustomerDialogOpen(true)}
							size="sm"
							variant="outline"
						>
							<UserX className="size-3.5" />
							Remove
						</Button>
					)}
				</div>
			),
			content: (
				<UnifiedAccordionContent>
					{customer ? (
						<JobCustomer customer={customer} />
					) : (
						<div className="border-primary/40 bg-primary/5 text-muted-foreground rounded-md border border-dashed p-6 text-sm">
							No customer assigned. Use the actions above to link or create a
							customer for this job.
						</div>
					)}
				</UnifiedAccordionContent>
			),
		});

		// Property Section
		sections.push({
			id: "property",
			title: "Service Location",
			icon: <Building2 className="size-4" />,
			count: property ? 1 : 0,
			actions: (
				<div className="flex items-center gap-2">
					<Button
						disabled={!customer?.id || isUpdatingProperty}
						onClick={() => setIsPropertyManagerOpen(true)}
						size="sm"
						title={
							customer?.id
								? undefined
								: "Assign a customer before selecting a property"
						}
						variant="outline"
					>
						<Link2 className="size-3.5" />
						{property ? "Change Property" : "Add Property"}
					</Button>
					{property && (
						<Button
							disabled={isUpdatingProperty}
							onClick={() => setIsRemovePropertyDialogOpen(true)}
							size="sm"
							variant="outline"
						>
							<X className="size-3.5" />
							Remove
						</Button>
					)}
				</div>
			),
			content: (
				<UnifiedAccordionContent>
					{property ? (
						<JobProperty property={property} />
					) : (
						<div className="border-primary/40 bg-primary/5 text-muted-foreground rounded-md border border-dashed p-6 text-sm">
							{customer?.id
								? "No service location assigned. Use the actions above to link or create one."
								: "Assign a customer before adding a service location."}
						</div>
					)}
				</UnifiedAccordionContent>
			),
		});

		// Estimates Section
		if (estimates.length > 0) {
			sections.push({
				id: "estimates",
				title: "Estimates",
				icon: <FileText className="size-4" />,
				count: estimates.length,
				actions: (
					<Button
						onClick={() =>
							router.push(`/dashboard/work/estimates/new?jobId=${job.id}`)
						}
						size="sm"
						variant="outline"
					>
						<Plus className="mr-1.5 size-3.5" />
						New Estimate
					</Button>
				),
				content: (
					<UnifiedAccordionContent>
						<JobEstimates estimates={estimates} jobId={job.id} />
					</UnifiedAccordionContent>
				),
			});
		}

		// Invoices Section
		if (invoices.length > 0) {
			sections.push({
				id: "invoices",
				title: "Invoices",
				icon: <Receipt className="size-4" />,
				count: invoices.length,
				actions: (
					<Button
						onClick={() =>
							router.push(`/dashboard/work/invoices/new?jobId=${job.id}`)
						}
						size="sm"
						variant="outline"
					>
						<Plus className="mr-1.5 size-3.5" />
						New Invoice
					</Button>
				),
				content: (
					<UnifiedAccordionContent>
						<JobInvoices invoices={invoices} jobId={job.id} />
					</UnifiedAccordionContent>
				),
			});
		}

		// Payments Section
		if (payments.length > 0) {
			sections.push({
				id: "payments",
				title: "Payments",
				icon: <DollarSign className="size-4" />,
				count: payments.length,
				content: (
					<UnifiedAccordionContent>
						<JobPayments payments={payments} />
					</UnifiedAccordionContent>
				),
			});
		}

		// Equipment Section
		if (jobEquipment.length > 0 || equipment.length > 0) {
			sections.push({
				id: "equipment",
				title: "Equipment",
				icon: <Wrench className="size-4" />,
				count: jobEquipment.length || equipment.length,
				content: (
					<UnifiedAccordionContent>
						<JobEquipment
							equipment={jobEquipment.length > 0 ? jobEquipment : equipment}
						/>
					</UnifiedAccordionContent>
				),
			});
		}

		// Materials Section
		if (jobMaterials.length > 0) {
			sections.push({
				id: "materials",
				title: "Materials",
				icon: <Package className="size-4" />,
				count: jobMaterials.length,
				content: (
					<UnifiedAccordionContent>
						<JobMaterials materials={jobMaterials} />
					</UnifiedAccordionContent>
				),
			});
		}

		// Team Section
		if (teamAssignments.length > 0 || assignedUser) {
			sections.push({
				id: "team",
				title: "Team",
				icon: <Users className="size-4" />,
				count: teamAssignments.length,
				content: (
					<UnifiedAccordionContent>
						<JobTeam
							assignedUser={assignedUser}
							jobId={job.id}
							teamAssignments={teamAssignments}
						/>
					</UnifiedAccordionContent>
				),
			});
		}

		// Time Tracking Section
		if (timeEntries.length > 0) {
			sections.push({
				id: "time-tracking",
				title: "Time Tracking",
				icon: <Clock className="size-4" />,
				count: timeEntries.length,
				content: (
					<UnifiedAccordionContent>
						<JobTimeTracking timeEntries={timeEntries} />
					</UnifiedAccordionContent>
				),
			});
		}

		// Schedules Section
		if (schedules.length > 0) {
			sections.push({
				id: "schedules",
				title: "Appointments",
				icon: <Calendar className="size-4" />,
				count: schedules.length,
				content: (
					<UnifiedAccordionContent>
						<JobSchedules schedules={schedules} />
					</UnifiedAccordionContent>
				),
			});
		}

		// Photos Section
		if (photos.length > 0) {
			sections.push({
				id: "photos",
				title: "Photos",
				icon: <Camera className="size-4" />,
				count: photos.length,
				content: (
					<UnifiedAccordionContent>
						<JobPhotos photos={photos} />
					</UnifiedAccordionContent>
				),
			});
		}

		// Documents Section
		if (documents.length > 0) {
			sections.push({
				id: "documents",
				title: "Documents",
				icon: <FileText className="size-4" />,
				count: documents.length,
				content: (
					<UnifiedAccordionContent>
						<JobDocuments documents={documents} />
					</UnifiedAccordionContent>
				),
			});
		}

		return sections;
	}, [
		job,
		customer,
		property,
		estimates,
		invoices,
		payments,
		equipment,
		jobEquipment,
		jobMaterials,
		teamAssignments,
		assignedUser,
		timeEntries,
		schedules,
		photos,
		documents,
		updateField,
		isUpdatingCustomer,
		isUpdatingProperty,
		router.push,
	]);

	const relatedItems = useMemo(() => {
		const items: any[] = [];

		if (customer) {
			items.push({
				id: `customer-${customer.id}`,
				type: "customer",
				title:
					customer.display_name ||
					`${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
					"Unknown Customer",
				subtitle: customer.email || customer.phone || undefined,
				href: `/dashboard/customers/${customer.id}`,
			});
		}

		if (property) {
			items.push({
				id: `property-${property.id}`,
				type: "property",
				title: property.name || property.address || "Service Location",
				subtitle: property.property_type || undefined,
				href: `/dashboard/work/properties/${property.id}`,
			});
		}

		return items;
	}, [customer, property]);

	return (
		<>
			<DetailPageContentLayout
				activities={activities}
				attachments={documents}
				customHeader={customHeader}
				customSections={customSections}
				defaultOpenSection="job-info"
				notes={jobNotes}
				relatedItems={relatedItems}
				showStandardSections={{
					activities: true,
					notes: true,
					attachments: true,
					relatedItems: true,
				}}
				storageKey="job-details"
			/>

			{/* Customer Manager */}
			<Dialog
				onOpenChange={setIsCustomerManagerOpen}
				open={isCustomerManagerOpen}
			>
				<DialogContent className="max-w-2xl space-y-4">
					<DialogHeader>
						<DialogTitle>
							{customer ? "Change Customer" : "Add Customer"}
						</DialogTitle>
						<DialogDescription>
							Link an existing customer or create a new one for this job.
						</DialogDescription>
					</DialogHeader>
					{showCustomerCreateForm ? (
						<InlineCustomerForm
							className="mt-2"
							onCancel={() => setShowCustomerCreateForm(false)}
							onSuccess={async (newCustomer) => {
								await handleCustomerAssignment(newCustomer.id);
								setShowCustomerCreateForm(false);
							}}
						/>
					) : (
						<div className="space-y-4">
							<CustomerSearchCombobox
								customers={allCustomers || []}
								onCreateNew={() => setShowCustomerCreateForm(true)}
								onSelectCustomer={(selected) =>
									setSelectedCustomerForDialog(selected)
								}
								recentCustomerIds={[]}
								selectedCustomer={selectedCustomerForDialog}
							/>
							{property &&
								selectedCustomerForDialog?.id &&
								(property.customer_id ?? property.customerId) !==
									selectedCustomerForDialog.id && (
									<div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
										Changing the customer will clear the currently assigned
										property.
									</div>
								)}
							<div className="flex items-center justify-end gap-2">
								<Button
									onClick={() => setShowCustomerCreateForm(true)}
									size="sm"
									variant="outline"
								>
									<Plus className="mr-1.5 size-3.5" />
									Create Customer
								</Button>
								<Button
									disabled={
										isUpdatingCustomer ||
										!selectedCustomerForDialog ||
										selectedCustomerForDialog.id === customer?.id
									}
									onClick={() =>
										selectedCustomerForDialog &&
										handleCustomerAssignment(selectedCustomerForDialog.id)
									}
									size="sm"
								>
									{isUpdatingCustomer ? (
										<>
											<Loader2 className="mr-1.5 size-3.5 animate-spin" />
											Saving...
										</>
									) : (
										"Assign Customer"
									)}
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Property Manager */}
			<Dialog
				onOpenChange={setIsPropertyManagerOpen}
				open={isPropertyManagerOpen}
			>
				<DialogContent className="max-w-xl space-y-4">
					<DialogHeader>
						<DialogTitle>
							{property ? "Change Property" : "Add Property"}
						</DialogTitle>
						<DialogDescription>
							{customer?.id
								? "Select or create a service location for this job."
								: "Assign a customer before adding a service location."}
						</DialogDescription>
					</DialogHeader>
					{customer?.id ? (
						showPropertyCreateForm ? (
							<InlinePropertyForm
								className="mt-2"
								customerId={customer.id}
								customerName={
									customer.display_name ||
									`${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
									"Customer"
								}
								onCancel={() => setShowPropertyCreateForm(false)}
								onSuccess={async (newProperty) => {
									await handlePropertyAssignment(newProperty.id);
									setShowPropertyCreateForm(false);
								}}
							/>
						) : (
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="property-select">Select Property</Label>
									<Select
										onValueChange={(value) =>
											setSelectedPropertyId(value || null)
										}
										value={selectedPropertyId ?? undefined}
									>
										<SelectTrigger id="property-select">
											<SelectValue placeholder="Choose a service location" />
										</SelectTrigger>
										<SelectContent>
											{filteredProperties.length === 0 ? (
												<SelectItem disabled value="">
													No properties available for this customer
												</SelectItem>
											) : (
												filteredProperties.map((prop: any) => (
													<SelectItem key={prop.id} value={prop.id}>
														{prop.name || prop.address || "Unnamed Property"}
													</SelectItem>
												))
											)}
										</SelectContent>
									</Select>
								</div>
								<div className="flex items-center justify-end gap-2">
									<Button
										onClick={() => setShowPropertyCreateForm(true)}
										size="sm"
										variant="outline"
									>
										<Plus className="mr-1.5 size-3.5" />
										Create Property
									</Button>
									<Button
										disabled={
											isUpdatingProperty ||
											!selectedPropertyId ||
											selectedPropertyId === property?.id
										}
										onClick={() =>
											selectedPropertyId &&
											handlePropertyAssignment(selectedPropertyId)
										}
										size="sm"
									>
										{isUpdatingProperty ? (
											<>
												<Loader2 className="mr-1.5 size-3.5 animate-spin" />
												Saving...
											</>
										) : (
											"Assign Property"
										)}
									</Button>
								</div>
							</div>
						)
					) : (
						<div className="border-primary/40 bg-primary/5 text-muted-foreground rounded-md border border-dashed p-6 text-sm">
							Assign a customer before selecting a service location.
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Remove Customer */}
			<AlertDialog
				onOpenChange={setIsRemoveCustomerDialogOpen}
				open={isRemoveCustomerDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remove customer from job?</AlertDialogTitle>
						<AlertDialogDescription>
							This will clear the customer and any linked property from this
							job. You can reassign them later.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isUpdatingCustomer}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							disabled={isUpdatingCustomer}
							onClick={handleRemoveCustomer}
						>
							{isUpdatingCustomer ? (
								<>
									<Loader2 className="mr-1.5 size-3.5 animate-spin" />
									Removing...
								</>
							) : (
								"Remove"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Remove Property */}
			<AlertDialog
				onOpenChange={setIsRemovePropertyDialogOpen}
				open={isRemovePropertyDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remove service location?</AlertDialogTitle>
						<AlertDialogDescription>
							This will detach the property from the job. You can link it again
							later.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isUpdatingProperty}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							disabled={isUpdatingProperty}
							onClick={handleRemoveProperty}
						>
							{isUpdatingProperty ? (
								<>
									<Loader2 className="mr-1.5 size-3.5 animate-spin" />
									Removing...
								</>
							) : (
								"Remove"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Archive Dialog */}
			<Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Archive Job?</DialogTitle>
						<DialogDescription>
							This will archive job #{job.job_number}. You can restore it from
							the archive within 90 days.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							disabled={isArchiving}
							onClick={() => setIsArchiveDialogOpen(false)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={isArchiving}
							onClick={handleArchiveJob}
							variant="destructive"
						>
							{isArchiving ? "Archiving..." : "Archive Job"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
