/**
 * Job Page Content - Comprehensive Single Page View
 * All details visible with collapsible sections - like ServiceTitan/HouseCall Pro
 */

"use client";

import {
	Activity,
	AlertCircle,
	Building2,
	Calendar,
	Camera,
	CheckCircle,
	ChevronRight,
	DollarSign,
	Download,
	ExternalLink,
	FileText,
	Globe,
	Link2,
	Mail,
	MapPin,
	MessageSquare,
	Package,
	Phone,
	Plus,
	Receipt,
	Save,
	ShieldCheck,
	Sparkles,
	StickyNote,
	Tag,
	Upload,
	User,
	Users,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	useTransition,
} from "react";
import { updateEntityTags } from "@/actions/entity-tags";
import {
	archiveJob,
	assignCustomerToJob,
	removeCustomerFromJob,
	updateJob,
} from "@/actions/jobs";
import { findOrCreateProperty } from "@/actions/properties";
import {
	assignTeamMemberToJob,
	removeTeamMemberFromJob,
} from "@/actions/team-assignments";
import { EmailDialog } from "@/components/communication/email-dialog";
import { SMSDialog } from "@/components/communication/sms-dialog";
import { DetailPageContentLayout } from "@/components/layout/detail-page-content-layout";
import {
	type DetailPageHeaderConfig,
	DetailPageSurface,
} from "@/components/layout/detail-page-shell";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
	StandardFormField,
	StandardFormRow,
} from "@/components/ui/standard-form-field";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
	UnifiedAccordionContent,
	type UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";
import { useSectionShortcuts } from "@/hooks/use-section-shortcuts";
import { useToast } from "@/hooks/use-toast";
import { useUIStore } from "@/lib/stores";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { JobStatus } from "@/lib/validations/job-status-transitions";
import {
	getCustomerProperties,
	searchCustomersForJob,
} from "@/queries/customers-search";
import { AIJobAssistantHeader } from "./ai-job-assistant-header";
import { InlinePhotoUploader } from "./InlinePhotoUploader";
import { JobActivityTimeline } from "./job-activity-timeline";
import { JobAppointmentsExpandable } from "./job-appointments-expandable";
import { JobCustomerPropertyManager } from "./job-customer-property-manager";
import { JobEstimatesTable } from "./job-estimates-table";
import { JobInvoicesTable } from "./job-invoices-table";
import { JobNotesTable } from "./job-notes-table";
import { JobPaymentsTable } from "./job-payments-table";
import { JobPurchaseOrdersTable } from "./job-purchase-orders-table";
import { JobQuickActions } from "./job-quick-actions";
import { JobStatisticsSheet } from "./job-statistics-sheet";
import { JobStatusSelector } from "./job-status-selector";
import { JobTasksTable } from "./job-tasks-table";
import { JobTeamMemberSelector } from "./job-team-member-selector";
import { JobTeamMembersTable } from "./job-team-members-table";
import { TravelTime } from "./travel-time";
import { PropertyLocationVisual } from "./widgets/property-location-visual";

type JobPageContentProps = {
	entityData?: any;
	jobData?: any; // Keep for backward compatibility
	metrics: any;
};

export function JobPageContent({
	entityData,
	jobData: legacyJobData,
	metrics,
}: JobPageContentProps) {
	// Support both entityData (from DetailPageLayout) and jobData (legacy)
	const jobData = entityData || legacyJobData;
	const jobRecord = jobData?.job ?? jobData ?? null;
	const job = jobRecord as any;

	// Early return if no job data
	if (!job) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-center">
					<h2 className="text-xl font-semibold">Job Not Found</h2>
					<p className="text-muted-foreground">
						This job may have been deleted or you don't have access to it.
					</p>
				</div>
			</div>
		);
	}

	const router = useRouter();
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();

	// Guard against infinite refresh loops
	const lastRefreshTimeRef = useRef<number>(0);
	const REFRESH_COOLDOWN_MS = 1000; // Minimum 1 second between refreshes

	const safeRefresh = useCallback(() => {
		const now = Date.now();
		if (now - lastRefreshTimeRef.current < REFRESH_COOLDOWN_MS) {
			console.warn("⚠️ Refresh called too frequently, skipping to prevent loop");
			return;
		}
		lastRefreshTimeRef.current = now;
		startTransition(() => {
			router.refresh();
		});
	}, [router]);

	const [localJob, setLocalJob] = useState(() => {
		if (!jobData?.job) {
			return { priority: "medium" };
		}
		return {
			...jobData.job,
			priority: jobData.job.priority || "medium", // Ensure default priority
		};
	});
	const [hasChanges, setHasChanges] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [showUploader, setShowUploader] = useState(false);
	const [isDraggingOver, setIsDraggingOver] = useState(false);
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);
	const [isStatisticsOpen, setIsStatisticsOpen] = useState(false);
	const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
	const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
	const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false);
	const [isLoadTemplateDialogOpen, setIsLoadTemplateDialogOpen] =
		useState(false);
	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [newTaskDescription, setNewTaskDescription] = useState("");
	const [newNoteContent, setNewNoteContent] = useState("");
	const [isCreatingTask, setIsCreatingTask] = useState(false);
	const [isCreatingNote, setIsCreatingNote] = useState(false);

	// Link existing dialogs
	const [isLinkEstimateOpen, setIsLinkEstimateOpen] = useState(false);
	const [isLinkInvoiceOpen, setIsLinkInvoiceOpen] = useState(false);
	const [isLinkPaymentOpen, setIsLinkPaymentOpen] = useState(false);
	const [isLinkEquipmentOpen, setIsLinkEquipmentOpen] = useState(false);
	const [estimateSearchQuery, setEstimateSearchQuery] = useState("");
	const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
	const [paymentSearchQuery, setPaymentSearchQuery] = useState("");
	const [equipmentSearchQuery, setEquipmentSearchQuery] = useState("");
	const [isLinking, setIsLinking] = useState(false);
	const [availableEstimates, setAvailableEstimates] = useState<
		Array<{
			id: string;
			estimate_number: string;
			total_amount: number;
			status: string;
			created_at: string;
			customer?: { id: string; name: string } | null;
		}>
	>([]);
	const [availableInvoices, setAvailableInvoices] = useState<
		Array<{
			id: string;
			invoice_number: string;
			total_amount: number;
			status: string;
			created_at: string;
			customer?: { id: string; name: string } | null;
		}>
	>([]);
	const [availablePayments, setAvailablePayments] = useState<
		Array<{
			id: string;
			amount: number;
			payment_method: string;
			reference_number?: string;
			created_at: string;
			customer?: { id: string; name: string } | null;
		}>
	>([]);
	const [availableEquipment, setAvailableEquipment] = useState<
		Array<{
			id: string;
			name: string;
			category?: string;
			serial_number?: string;
			created_at: string;
		}>
	>([]);

	const {
		customer: initialCustomer,
		property: initialProperty,
		assignedUser,
		teamAssignments = [],
		availableTeamMembers = [],
		timeEntries = [],
		invoices: initialInvoices = [],
		estimates: initialEstimates = [],
		payments: initialPayments = [],
		purchaseOrders = [],
		tasks: initialTasks = [],
		photos = [],
		documents = [],
		signatures = [],
		activities = [],
		communications = [],
		equipment = [],
		jobEquipment: initialJobEquipment = [],
		jobMaterials = [],
		jobNotes: initialJobNotes = [],
		schedules = [],
		allCustomers = [],
		allProperties = [],
		companyPhones = [],
	} = jobData || {};

	// Optimistic state for data arrays
	const [estimates, setEstimates] = useState(initialEstimates);
	const [invoices, setInvoices] = useState(initialInvoices);
	const [payments, setPayments] = useState(initialPayments);
	const [jobEquipment, setJobEquipment] = useState(initialJobEquipment);
	const [tasks, setTasks] = useState(initialTasks);
	const [jobNotes, setJobNotes] = useState(initialJobNotes);

	// Sync state with props when data changes (e.g., after page navigation or refresh)
	// Use refs to track previous values and only update if actually changed
	const prevEstimatesRef = useRef(initialEstimates);
	const prevInvoicesRef = useRef(initialInvoices);
	const prevPaymentsRef = useRef(initialPayments);
	const prevJobEquipmentRef = useRef(initialJobEquipment);
	const prevTasksRef = useRef(initialTasks);
	const prevJobNotesRef = useRef(initialJobNotes);

	useEffect(() => {
		// Only update if arrays actually changed (compare lengths and IDs to avoid infinite loops)
		const estimatesChanged =
			initialEstimates.length !== prevEstimatesRef.current.length ||
			initialEstimates.some(
				(e, i) => e?.id !== prevEstimatesRef.current[i]?.id,
			);
		const invoicesChanged =
			initialInvoices.length !== prevInvoicesRef.current.length ||
			initialInvoices.some(
				(inv, i) => inv?.id !== prevInvoicesRef.current[i]?.id,
			);
		const paymentsChanged =
			initialPayments.length !== prevPaymentsRef.current.length ||
			initialPayments.some((p, i) => p?.id !== prevPaymentsRef.current[i]?.id);
		const equipmentChanged =
			initialJobEquipment.length !== prevJobEquipmentRef.current.length ||
			initialJobEquipment.some(
				(eq, i) => eq?.id !== prevJobEquipmentRef.current[i]?.id,
			);
		const tasksChanged =
			initialTasks.length !== prevTasksRef.current.length ||
			initialTasks.some((t, i) => t?.id !== prevTasksRef.current[i]?.id);
		const notesChanged =
			initialJobNotes.length !== prevJobNotesRef.current.length ||
			initialJobNotes.some((n, i) => n?.id !== prevJobNotesRef.current[i]?.id);

		if (estimatesChanged) {
			setEstimates(initialEstimates);
			prevEstimatesRef.current = initialEstimates;
		}
		if (invoicesChanged) {
			setInvoices(initialInvoices);
			prevInvoicesRef.current = initialInvoices;
		}
		if (paymentsChanged) {
			setPayments(initialPayments);
			prevPaymentsRef.current = initialPayments;
		}
		if (equipmentChanged) {
			setJobEquipment(initialJobEquipment);
			prevJobEquipmentRef.current = initialJobEquipment;
		}
		if (tasksChanged) {
			setTasks(initialTasks);
			prevTasksRef.current = initialTasks;
		}
		if (notesChanged) {
			setJobNotes(initialJobNotes);
			prevJobNotesRef.current = initialJobNotes;
		}
	}, [
		initialEstimates,
		initialInvoices,
		initialPayments,
		initialJobEquipment,
		initialTasks,
		initialJobNotes,
	]);

	// Extract job tags from junction table (now included in RPC response)
	// EntityTags expects {label, color} format
	const jobTags = useMemo(() => {
		if (!entityData?.job_tags) return [];
		return entityData.job_tags.map((jt: any) => ({
			label: jt.name || jt.label,
			color: jt.color,
		}));
	}, [entityData?.job_tags]);

	// Fetch available estimates when link dialog opens
	useEffect(() => {
		if (!isLinkEstimateOpen || !job?.company_id) return;

		const fetchEstimates = async () => {
			const supabase = createClient();
			const { data, error } = await supabase
				.from("estimates")
				.select(
					`
					id,
					estimate_number,
					total_amount,
					status,
					created_at,
					customer:customers(id, name)
				`,
				)
				.eq("company_id", job.company_id)
				.or(`job_id.is.null,job_id.neq.${job.id}`)
				.order("created_at", { ascending: false })
				.limit(50);

			if (!error && data) {
				setAvailableEstimates(data as any);
			}
		};

		fetchEstimates();
	}, [isLinkEstimateOpen, job?.company_id, job?.id]);

	// Fetch available invoices when link dialog opens
	useEffect(() => {
		if (!isLinkInvoiceOpen || !job?.company_id) return;

		const fetchInvoices = async () => {
			const supabase = createClient();
			const { data, error } = await supabase
				.from("invoices")
				.select(
					`
					id,
					invoice_number,
					total_amount,
					status,
					created_at,
					customer:customers(id, name)
				`,
				)
				.eq("company_id", job.company_id)
				.or(`job_id.is.null,job_id.neq.${job.id}`)
				.order("created_at", { ascending: false })
				.limit(50);

			if (!error && data) {
				setAvailableInvoices(data as any);
			}
		};

		fetchInvoices();
	}, [isLinkInvoiceOpen, job?.company_id, job?.id]);

	// Fetch available payments when link dialog opens
	useEffect(() => {
		if (!isLinkPaymentOpen || !job?.company_id) return;

		const fetchPayments = async () => {
			const supabase = createClient();
			const { data, error } = await supabase
				.from("payments")
				.select(
					`
					id,
					amount,
					payment_method,
					reference_number,
					created_at,
					customer:customers(id, name)
				`,
				)
				.eq("company_id", job.company_id)
				.or(`job_id.is.null,job_id.neq.${job.id}`)
				.order("created_at", { ascending: false })
				.limit(50);

			if (!error && data) {
				setAvailablePayments(data as any);
			}
		};

		fetchPayments();
	}, [isLinkPaymentOpen, job?.company_id, job?.id]);

	// Fetch available equipment when link dialog opens
	useEffect(() => {
		if (!isLinkEquipmentOpen || !job?.company_id) return;

		const fetchEquipment = async () => {
			const supabase = createClient();
			const { data, error } = await supabase
				.from("equipment")
				.select("id, name, category, serial_number, created_at")
				.eq("company_id", job.company_id)
				.order("created_at", { ascending: false })
				.limit(50);

			if (!error && data) {
				setAvailableEquipment(data as any);
			}
		};

		fetchEquipment();
	}, [isLinkEquipmentOpen, job?.company_id]);

	// Keyboard shortcuts: Ctrl+1 through Ctrl+9 to scroll and expand accordion sections
	const sectionShortcuts = useMemo(
		() => ({
			"1": () => {
				const element = document.querySelector('[data-section-id="customer"]');
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "start" });
					const trigger = element.querySelector("[data-accordion-trigger]");
					if (trigger && trigger.getAttribute("data-state") === "closed") {
						(trigger as HTMLElement).click();
					}
				}
			},
			"2": () => {
				const element = document.querySelector('[data-section-id="team"]');
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "start" });
					const trigger = element.querySelector("[data-accordion-trigger]");
					if (trigger && trigger.getAttribute("data-state") === "closed") {
						(trigger as HTMLElement).click();
					}
				}
			},
			"3": () => {
				const element = document.querySelector(
					'[data-section-id="appointments"]',
				);
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "start" });
					const trigger = element.querySelector("[data-accordion-trigger]");
					if (trigger && trigger.getAttribute("data-state") === "closed") {
						(trigger as HTMLElement).click();
					}
				}
			},
			"4": () => {
				const element = document.querySelector('[data-section-id="estimates"]');
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "start" });
					const trigger = element.querySelector("[data-accordion-trigger]");
					if (trigger && trigger.getAttribute("data-state") === "closed") {
						(trigger as HTMLElement).click();
					}
				}
			},
			"5": () => {
				const element = document.querySelector('[data-section-id="invoices"]');
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "start" });
					const trigger = element.querySelector("[data-accordion-trigger]");
					if (trigger && trigger.getAttribute("data-state") === "closed") {
						(trigger as HTMLElement).click();
					}
				}
			},
			"6": () => {
				const element = document.querySelector('[data-section-id="payments"]');
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "start" });
					const trigger = element.querySelector("[data-accordion-trigger]");
					if (trigger && trigger.getAttribute("data-state") === "closed") {
						(trigger as HTMLElement).click();
					}
				}
			},
			"7": () => {
				const element = document.querySelector(
					'[data-section-id="purchase-orders"]',
				);
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "start" });
					const trigger = element.querySelector("[data-accordion-trigger]");
					if (trigger && trigger.getAttribute("data-state") === "closed") {
						(trigger as HTMLElement).click();
					}
				}
			},
			"8": () => {
				const element = document.querySelector('[data-section-id="tasks"]');
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "start" });
					const trigger = element.querySelector("[data-accordion-trigger]");
					if (trigger && trigger.getAttribute("data-state") === "closed") {
						(trigger as HTMLElement).click();
					}
				}
			},
			"9": () => {
				const element = document.querySelector('[data-section-id="notes"]');
				if (element) {
					element.scrollIntoView({ behavior: "smooth", block: "start" });
					const trigger = element.querySelector("[data-accordion-trigger]");
					if (trigger && trigger.getAttribute("data-state") === "closed") {
						(trigger as HTMLElement).click();
					}
				}
			},
		}),
		[],
	);

	useSectionShortcuts(sectionShortcuts);

	// Local state for optimistic updates
	const [customer, setCustomer] = useState(initialCustomer);
	const [property, setProperty] = useState(initialProperty);

	const hasMapsApiKey = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
	const canShowInteractiveMap =
		Boolean(property?.lat && property?.lon) || hasMapsApiKey;

	const [customerSearchQuery, _setCustomerSearchQuery] = useState("");
	const [propertySearchQuery, _setPropertySearchQuery] = useState("");
	const [_propertyDropdownMode, setPropertyDropdownMode] = useState<
		"search" | "add"
	>("search");
	const [_isUpdatingCustomer, _setIsUpdatingCustomer] = useState(false);
	const [_isUpdatingProperty, setIsUpdatingProperty] = useState(false);
	const [isCreatePropertyDialogOpen, setIsCreatePropertyDialogOpen] =
		useState(false);
	const [isCreatingProperty, setIsCreatingProperty] = useState(false);
	const [newProperty, setNewProperty] = useState({
		name: "",
		address: "",
		address2: "",
		city: "",
		state: "",
		zipCode: "",
	});

	// Communication dialog states
	const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
	const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false);
	const [isRemoveCustomerDialogOpen, setIsRemoveCustomerDialogOpen] =
		useState(false);

	// File input ref for direct upload
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	// Get call management from UI store
	const setIncomingCall = useUIStore((state) => state.setIncomingCall);

	// Filter properties by customer for property dialog
	const availableProperties = customer?.id
		? allProperties.filter((p: any) => p.customer_id === customer.id)
		: [];

	// Handle field changes
	const handleFieldChange = (field: string, value: any) => {
		setLocalJob({ ...localJob, [field]: value });
		setHasChanges(true);
	};

	// Handle customer change
	const _handleCustomerChange = async (newCustomerId: string | null) => {
		if (newCustomerId === customer?.id) {
			return;
		}

		// Store original values for rollback
		const originalCustomer = customer;
		const originalProperty = property;

		// Optimistic update - update UI immediately
		const newCustomer = newCustomerId
			? allCustomers.find((c: any) => c.id === newCustomerId)
			: null;
		setCustomer(newCustomer);

		// Check if property needs to be cleared
		let shouldClearProperty = false;
		if (!newCustomerId) {
			// Customer removed - clear property
			shouldClearProperty = true;
		} else if (property?.id) {
			// Customer changed - clear property if it doesn't belong to new customer
			const propertyBelongsToCustomer = allProperties.some(
				(p: any) => p.id === property.id && p.customer_id === newCustomerId,
			);
			if (!propertyBelongsToCustomer) {
				shouldClearProperty = true;
			}
		}

		if (shouldClearProperty) {
			setProperty(null);
		}

		// Show loading toast
		toast.loading("Updating customer...", { id: "customer-update" });

		try {
			const formData = new FormData();
			formData.append("customerId", newCustomerId || "");

			if (shouldClearProperty) {
				formData.append("propertyId", "");
			}

			const result = await updateJob(job.id, formData);
			if (result.success) {
				toast.success("Customer updated successfully", {
					id: "customer-update",
				});
				// Server Action handles revalidation automatically
			} else {
				// Rollback on error
				setCustomer(originalCustomer);
				setProperty(originalProperty);
				toast.error(result.error || "Failed to update customer", {
					id: "customer-update",
				});
			}
		} catch (_error) {
			// Rollback on error
			setCustomer(originalCustomer);
			setProperty(originalProperty);
			toast.error("Failed to update customer", { id: "customer-update" });
		}
	};

	// Handle property change
	const _handlePropertyChange = async (newPropertyId: string | null) => {
		if (newPropertyId === property?.id) {
			return;
		}

		// Store original for rollback
		const originalProperty = property;

		// Optimistic update - update UI immediately
		const newProperty = newPropertyId
			? allProperties.find((p: any) => p.id === newPropertyId)
			: null;
		setProperty(newProperty);

		// Show loading toast
		toast.loading("Updating property...", { id: "property-update" });

		try {
			const formData = new FormData();
			formData.append("propertyId", newPropertyId || "");

			const result = await updateJob(job.id, formData);
			if (result.success) {
				toast.success("Property updated successfully", {
					id: "property-update",
				});
				// Server Action handles revalidation automatically
			} else {
				// Rollback on error
				setProperty(originalProperty);
				toast.error(result.error || "Failed to update property", {
					id: "property-update",
				});
			}
		} catch (_error) {
			// Rollback on error
			setProperty(originalProperty);
			toast.error("Failed to update property", { id: "property-update" });
		}
	};

	// Handle remove customer
	const _handleRemoveCustomer = async () => {
		// Store original for rollback
		const originalCustomer = customer;
		const originalProperty = property;

		// Optimistic update - clear immediately
		setCustomer(null);
		setProperty(null);

		// Show loading toast
		toast.loading("Removing customer...", { id: "customer-remove" });

		try {
			const formData = new FormData();
			formData.append("customerId", "");
			formData.append("propertyId", ""); // Also remove property since properties are linked to customers

			const result = await updateJob(job.id, formData);
			if (result.success) {
				toast.success("Customer and property removed successfully", {
					id: "customer-remove",
				});
				// Server Action handles revalidation automatically
			} else {
				// Rollback on error
				setCustomer(originalCustomer);
				setProperty(originalProperty);
				toast.error(result.error || "Failed to remove customer", {
					id: "customer-remove",
				});
			}
		} catch (_error) {
			// Rollback on error
			setCustomer(originalCustomer);
			setProperty(originalProperty);
			toast.error("Failed to remove customer", { id: "customer-remove" });
		}
	};

	// Handle create new property from Google Places
	const _handlePlaceSelect = async (place: {
		address: string;
		address2?: string;
		city: string;
		state: string;
		zipCode: string;
		country: string;
		lat: number;
		lon: number;
		formattedAddress: string;
	}) => {
		if (!customer?.id) {
			toast.error("Please select a customer first");
			return;
		}

		// Store original property for rollback
		const originalProperty = property;

		// Create optimistic property object
		const optimisticProperty = {
			id: `temp-${Date.now()}`,
			customer_id: customer.id,
			company_id: customer.company_id,
			name: place.formattedAddress,
			address: place.address,
			address2: place.address2,
			city: place.city,
			state: place.state,
			zip_code: place.zipCode,
			country: place.country,
			lat: place.lat,
			lon: place.lon,
		};

		// Optimistically update UI immediately - feels instant!
		setProperty(optimisticProperty as any);
		setPropertyDropdownMode("search");
		setIsUpdatingProperty(false);

		// Show success immediately
		toast.success("Property added!", { duration: 2000 });

		// Create property in background (fast because no blocking geocoding)
		try {
			const formData = new FormData();
			formData.append("customerId", customer.id);
			formData.append("name", place.formattedAddress);
			formData.append("address", place.address);
			formData.append("address2", place.address2 || "");
			formData.append("city", place.city);
			formData.append("state", place.state);
			formData.append("zipCode", place.zipCode);
			formData.append("country", place.country);
			// Pass coordinates from Google Places - no need to geocode again!
			formData.append("lat", place.lat.toString());
			formData.append("lon", place.lon.toString());

			const result = await findOrCreateProperty(formData);
			if (result.success && result.data) {
				// Update job with new property
				const jobFormData = new FormData();
				jobFormData.append("propertyId", result.data);

				const updateResult = await updateJob(job.id, jobFormData);
				if (updateResult.success) {
					// Server Action handles revalidation automatically
				} else {
					// Rollback on error
					setProperty(originalProperty);
					toast.error(updateResult.error || "Failed to assign property to job");
				}
			} else {
				// Rollback on error
				setProperty(originalProperty);
				toast.error(result.error ?? "Failed to create property");
			}
		} catch (_error) {
			// Rollback on error
			setProperty(originalProperty);
			toast.error("Failed to create property");
		}
	};

	// Handle create new property (from dialog)
	const handleCreateProperty = async () => {
		if (!customer?.id) {
			toast.error("Please select a customer first");
			return;
		}

		setIsCreatingProperty(true);
		try {
			const formData = new FormData();
			formData.append("customerId", customer.id);
			formData.append("name", newProperty.name);
			formData.append("address", newProperty.address);
			formData.append("address2", newProperty.address2);
			formData.append("city", newProperty.city);
			formData.append("state", newProperty.state);
			formData.append("zipCode", newProperty.zipCode);

			const result = await findOrCreateProperty(formData);
			if (result.success && result.data) {
				// Update job with new property
				const jobFormData = new FormData();
				jobFormData.append("propertyId", result.data);

				const updateResult = await updateJob(job.id, jobFormData);
				if (updateResult.success) {
					toast.success("Property created and assigned successfully");
					setIsCreatePropertyDialogOpen(false);
					setNewProperty({
						name: "",
						address: "",
						address2: "",
						city: "",
						state: "",
						zipCode: "",
					});
					// Server Action handles revalidation automatically
				} else {
					toast.error(updateResult.error || "Failed to assign property to job");
				}
			} else {
				toast.error(result.error ?? "Failed to create property");
			}
		} catch (_error) {
			toast.error("Failed to create property");
		} finally {
			setIsCreatingProperty(false);
		}
	};

	const handleAssignTeamMember = async (teamMemberId: string, role: string) => {
		try {
			const result = await assignTeamMemberToJob({
				jobId: job.id,
				teamMemberId,
				role,
			});

			if (result.success) {
				toast.success("Team member assigned");
				// Use safe refresh to prevent infinite loops
				safeRefresh();
			} else {
				console.error("Assignment failed:", result.error, result);
				toast.error(result.error || "Failed to assign team member");
			}
		} catch (error) {
			console.error("Failed to assign team member:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Failed to assign team member";
			toast.error(errorMessage);
		}
	};

	const handleRemoveTeamMember = async (
		teamMemberId: string,
	): Promise<{ success: boolean; error?: string }> => {
		try {
			const result = await removeTeamMemberFromJob({
				jobId: job.id,
				teamMemberId,
			});

			if (result.success) {
				toast.success("Team member removed");
				safeRefresh();
				return { success: true };
			} else {
				const errorMessage = result.error || "Failed to remove team member";
				toast.error(errorMessage);
				return { success: false, error: errorMessage };
			}
		} catch (error) {
			console.error("Failed to remove team member:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Failed to remove team member";
			toast.error(errorMessage);
			return { success: false, error: errorMessage };
		}
	};

	// Filter customers based on search
	const _filteredCustomers = allCustomers.filter((c: any) => {
		if (!customerSearchQuery) {
			return true;
		}
		const query = customerSearchQuery.toLowerCase();
		const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
		const phone = c.phone?.toLowerCase() || "";
		const email = c.email?.toLowerCase() || "";
		const company = c.company_name?.toLowerCase() || "";
		return (
			fullName.includes(query) ||
			phone.includes(query) ||
			email.includes(query) ||
			company.includes(query)
		);
	});

	// Filter properties based on search
	const _filteredProperties = availableProperties.filter((p: any) => {
		if (!propertySearchQuery) {
			return true;
		}
		const query = propertySearchQuery.toLowerCase();
		const name = p.name?.toLowerCase() || "";
		const address = p.address?.toLowerCase() || "";
		const city = p.city?.toLowerCase() || "";
		return (
			name.includes(query) || address.includes(query) || city.includes(query)
		);
	});

	// Save changes
	const handleSave = async () => {
		// Snapshot current state for rollback
		const previousState = { ...localJob };

		setIsSaving(true);
		try {
			const formData = new FormData();
			if (localJob.title !== jobData.job.title) {
				formData.append("title", localJob.title);
			}
			if (localJob.description !== jobData.job.description) {
				formData.append("description", localJob.description || "");
			}
			if (localJob.status !== jobData.job.status) {
				formData.append("status", localJob.status);
			}
			if (localJob.priority !== jobData.job.priority) {
				formData.append("priority", localJob.priority || "medium");
			}
			if (localJob.job_type !== jobData.job.job_type) {
				formData.append("jobType", localJob.job_type || "");
			}
			if (localJob.notes !== jobData.job.notes) {
				formData.append("notes", localJob.notes || "");
			}

			const result = await updateJob(jobData.job.id, formData);
			if (result.success) {
				toast.success("Changes saved successfully");
				setHasChanges(false);
				// Update local state immediately with the saved values
				const updatedJob = { ...localJob };
				if (formData.has("title")) {
					updatedJob.title = formData.get("title") as string;
				}
				if (formData.has("description")) {
					updatedJob.description = formData.get("description") as string;
				}
				if (formData.has("status")) {
					updatedJob.status = formData.get("status") as string;
				}
				if (formData.has("priority")) {
					updatedJob.priority = formData.get("priority") as string;
				}
				if (formData.has("jobType")) {
					updatedJob.job_type = formData.get("jobType") as string;
				}
				if (formData.has("notes")) {
					updatedJob.notes = formData.get("notes") as string;
				}
				setLocalJob(updatedJob);
				// Force router refresh to get latest data from server
				// Server Action handles revalidation automatically
			} else {
				// ROLLBACK: Restore previous state on save failure
				setLocalJob(previousState);
				setHasChanges(false);
				toast.error(
					result.error || "Failed to save changes - changes reverted",
				);
			}
		} catch (_error) {
			// ROLLBACK: Restore previous state on exception
			setLocalJob(previousState);
			setHasChanges(false);
			toast.error("Failed to save changes - changes reverted");
		} finally {
			setIsSaving(false);
		}
	};

	// Handle job costing updates
	const handleUpdateCosting = async (costingData: any) => {
		const formData = new FormData();

		// Add all costing fields
		if (costingData.labor_hours_estimated !== undefined) {
			formData.append(
				"labor_hours_estimated",
				costingData.labor_hours_estimated.toString(),
			);
		}
		if (costingData.labor_hours_actual !== undefined) {
			formData.append(
				"labor_hours_actual",
				costingData.labor_hours_actual.toString(),
			);
		}
		if (costingData.labor_rate !== undefined) {
			formData.append("labor_rate", costingData.labor_rate.toString());
		}
		if (costingData.labor_burden_percent !== undefined) {
			formData.append(
				"labor_burden_percent",
				costingData.labor_burden_percent.toString(),
			);
		}
		if (costingData.labor_cost_total !== undefined) {
			formData.append(
				"labor_cost_total",
				costingData.labor_cost_total.toString(),
			);
		}
		if (costingData.materials_cost_actual !== undefined) {
			formData.append(
				"materials_cost_actual",
				costingData.materials_cost_actual.toString(),
			);
		}
		if (costingData.materials_markup_percent !== undefined) {
			formData.append(
				"materials_markup_percent",
				costingData.materials_markup_percent.toString(),
			);
		}
		if (costingData.materials_revenue !== undefined) {
			formData.append(
				"materials_revenue",
				costingData.materials_revenue.toString(),
			);
		}
		if (costingData.equipment_cost !== undefined) {
			formData.append("equipment_cost", costingData.equipment_cost.toString());
		}
		if (costingData.subcontractor_cost !== undefined) {
			formData.append(
				"subcontractor_cost",
				costingData.subcontractor_cost.toString(),
			);
		}
		if (costingData.overhead_allocation !== undefined) {
			formData.append(
				"overhead_allocation",
				costingData.overhead_allocation.toString(),
			);
		}
		if (costingData.total_cost_actual !== undefined) {
			formData.append(
				"total_cost_actual",
				costingData.total_cost_actual.toString(),
			);
		}
		if (costingData.total_revenue !== undefined) {
			formData.append("total_revenue", costingData.total_revenue.toString());
		}
		if (costingData.profit_margin_actual !== undefined) {
			formData.append(
				"profit_margin_actual",
				costingData.profit_margin_actual.toString(),
			);
		}
		if (costingData.profit_margin_target !== undefined) {
			formData.append(
				"profit_margin_target",
				costingData.profit_margin_target.toString(),
			);
		}

		const result = await updateJob(job.id, formData);
		if (result.success) {
			toast.success("Job costing updated successfully");
		} else {
			toast.error(result.error || "Failed to update job costing");
			throw new Error(result.error || "Failed to update job costing");
		}
	};

	const formatCurrency = (cents: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(cents / 100);

	const formatDate = (date: string | null) => {
		if (!date) {
			return "Not set";
		}
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "2-digit",
		}).format(new Date(date));
	};

	const _formatHours = (hours: number) => `${hours.toFixed(1)}h`;

	const _formatTime = (date: string | null) => {
		if (!date) {
			return "Not set";
		}
		return new Intl.DateTimeFormat("en-US", {
			hour: "numeric",
			minute: "2-digit",
		}).format(new Date(date));
	};

	const _formatDuration = (minutes: number | null) => {
		if (!minutes) {
			return "-";
		}
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours > 0 && mins > 0) {
			return `${hours}h ${mins}m`;
		}
		if (hours > 0) {
			return `${hours}h`;
		}
		return `${mins}m`;
	};

	const formatRelativeTime = (date: string | Date | null) => {
		if (!date) {
			return "—";
		}
		const value =
			typeof date === "string" || typeof date === "number"
				? new Date(date)
				: date;

		if (!value || Number.isNaN(value.getTime())) {
			return "—";
		}

		const diffMs = value.getTime() - Date.now();
		const diffMinutes = Math.round(diffMs / (1000 * 60));
		const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

		if (Math.abs(diffMinutes) < 60) {
			return rtf.format(diffMinutes, "minute");
		}

		const diffHours = Math.round(diffMinutes / 60);
		if (Math.abs(diffHours) < 24) {
			return rtf.format(diffHours, "hour");
		}

		const diffDays = Math.round(diffHours / 24);
		if (Math.abs(diffDays) < 30) {
			return rtf.format(diffDays, "day");
		}

		const diffMonths = Math.round(diffDays / 30);
		if (Math.abs(diffMonths) < 12) {
			return rtf.format(diffMonths, "month");
		}

		const diffYears = Math.round(diffMonths / 12);
		return rtf.format(diffYears, "year");
	};

	const customerDetailPath = customer
		? `/dashboard/customers/${customer.id}`
		: null;

	const parseMaybeJson = (value: unknown) => {
		if (!value) {
			return null;
		}
		if (typeof value === "string") {
			try {
				return JSON.parse(value);
			} catch {
				return null;
			}
		}
		if (typeof value === "object") {
			return value as Record<string, unknown>;
		}
		return null;
	};

	const customerTags = useMemo<string[]>(() => {
		const normalizeTagArray = (tags: unknown[]): string[] =>
			tags
				.filter(
					(tag): tag is string =>
						typeof tag === "string" && tag.trim().length > 0,
				)
				.map((tag) => tag.trim());

		if (!customer?.tags) {
			return [];
		}

		if (Array.isArray(customer.tags)) {
			return normalizeTagArray(customer.tags);
		}

		if (typeof customer.tags === "string") {
			try {
				const parsed = JSON.parse(customer.tags);
				if (Array.isArray(parsed)) {
					return normalizeTagArray(parsed);
				}
				if (typeof parsed === "string") {
					return parsed
						.split(",")
						.map((tag) => tag.trim())
						.filter(Boolean);
				}
			} catch {
				return customer.tags
					.split(",")
					.map((tag: string) => tag.trim())
					.filter(Boolean);
			}
		}

		return [];
	}, [customer?.tags]);

	const customerMetadata = useMemo<Record<string, any>>(() => {
		const parsed = parseMaybeJson(customer?.metadata);
		return parsed && typeof parsed === "object"
			? (parsed as Record<string, any>)
			: {};
	}, [customer?.metadata, parseMaybeJson]);

	const communicationPreferences = useMemo<Record<
		string,
		boolean
	> | null>(() => {
		const parsed = parseMaybeJson(customer?.communication_preferences);
		if (parsed && typeof parsed === "object") {
			return parsed as Record<string, boolean>;
		}
		return null;
	}, [customer?.communication_preferences, parseMaybeJson]);

	const membershipLabel = useMemo(() => {
		const fromMetadata =
			customerMetadata.membershipTier ||
			customerMetadata.membership_level ||
			customerMetadata.membership ||
			customerMetadata.plan;

		if (fromMetadata) {
			return fromMetadata;
		}

		const vipTag = customerTags.find((tag) => {
			if (typeof tag !== "string") {
				return false;
			}
			const lowerTag = tag.toLowerCase();
			return ["vip", "member", "plan", "tier", "priority"].some((keyword) =>
				lowerTag.includes(keyword),
			);
		});

		return vipTag ?? null;
	}, [customerMetadata, customerTags]);

	const outstandingBalance =
		customer?.outstanding_balance ?? customer?.outstandingBalance ?? 0;

	const accountHealth = useMemo(() => {
		if (!customer) {
			return {
				tone: "neutral",
				label: "No customer",
				description: "",
			};
		}

		if ((customer.status || "").toLowerCase() === "blocked") {
			return {
				tone: "destructive",
				label: "Credit Hold",
				description: "Account is blocked until balance issues are resolved.",
			};
		}

		if (outstandingBalance > 0) {
			return {
				tone: "warning",
				label: "Balance Due",
				description: `${formatCurrency(outstandingBalance)} outstanding`,
			};
		}

		if ((customer.status || "").toLowerCase() === "inactive") {
			return {
				tone: "warning",
				label: "Inactive",
				description: "Customer marked inactive. Reactivate to schedule work.",
			};
		}

		return {
			tone: "positive",
			label: "In Good Standing",
			description: "No outstanding balances or restrictions.",
		};
	}, [customer, outstandingBalance, formatCurrency]);

	const toneClasses = {
		positive:
			"border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200",
		warning:
			"border-warning bg-warning text-warning dark:border-warning/20 dark:bg-warning/10 dark:text-warning",
		destructive:
			"border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200",
		neutral:
			"border-muted bg-muted/40 text-muted-foreground dark:border-muted/30 dark:bg-muted/20 dark:text-muted-foreground",
	} as const;

	const accountToneClass =
		toneClasses[accountHealth.tone as keyof typeof toneClasses] ??
		toneClasses.neutral;

	const paymentTermsRaw =
		customer?.payment_terms ?? customer?.paymentTerms ?? "due_on_receipt";

	const normalizedPaymentTerms = paymentTermsRaw
		.replace(/_/g, " ")
		.replace(/\b\w/g, (char: string) => char.toUpperCase());

	const creditLimit = customer?.credit_limit ?? customer?.creditLimit ?? 0;

	const openInvoices = useMemo(() => {
		const list = Array.isArray(invoices) ? invoices : [];
		return list.filter((invoice: any) => {
			const status = (invoice?.status || "").toLowerCase();
			return ["sent", "viewed", "partial", "overdue"].includes(status);
		});
	}, [invoices]);

	const overdueInvoices = useMemo(() => {
		const now = Date.now();
		return openInvoices.filter((invoice: any) => {
			const status = (invoice?.status || "").toLowerCase();
			if (status === "overdue") {
				return true;
			}
			const due =
				invoice?.due_date ??
				invoice?.dueDate ??
				invoice?.due_on ??
				invoice?.dueOn;
			if (!due) {
				return false;
			}
			const dueDate = new Date(due);
			return !Number.isNaN(dueDate.getTime()) && dueDate.getTime() < now;
		});
	}, [openInvoices]);

	const _totalOutstanding = useMemo(
		() =>
			openInvoices.reduce((sum: number, invoice: any) => {
				const balance = invoice?.balance_amount ?? invoice?.balanceAmount ?? 0;
				return sum + (balance || 0);
			}, 0),
		[openInvoices],
	);

	const nextDueInvoice = useMemo(() => {
		const withDates = openInvoices
			.map((invoice: any) => {
				const due =
					invoice?.due_date ??
					invoice?.dueDate ??
					invoice?.due_on ??
					invoice?.dueOn;
				const dueDate = due ? new Date(due) : null;
				return {
					invoice,
					dueDate,
				};
			})
			.filter((item) => item.dueDate && !Number.isNaN(item.dueDate.getTime()))
			.sort((a, b) => a.dueDate?.getTime() - b.dueDate?.getTime());

		return withDates[0]?.invoice ?? null;
	}, [openInvoices]);

	const upcomingVisits = useMemo(() => {
		const list = Array.isArray(schedules) ? schedules : [];
		const now = Date.now();

		return list
			.map((schedule: any) => {
				const start =
					schedule?.start_time ??
					schedule?.startTime ??
					schedule?.start_at ??
					schedule?.startAt;
				const startDate = start ? new Date(start) : null;
				return {
					schedule,
					startDate,
				};
			})
			.filter(
				({ startDate }) =>
					startDate &&
					!Number.isNaN(startDate.getTime()) &&
					startDate.getTime() > now,
			)
			.sort((a, b) => a.startDate?.getTime() - b.startDate?.getTime())
			.map(({ schedule }) => schedule);
	}, [schedules]);

	const nextVisit = upcomingVisits[0] ?? null;

	const lastCommunication = communications?.[0] ?? null;

	const communicationChannels = useMemo(() => {
		if (!communicationPreferences) {
			return null;
		}

		const channels: Array<{ key: string; label: string; enabled: boolean }> = [
			{
				key: "email",
				label: "Email",
				enabled:
					communicationPreferences.email ??
					communicationPreferences.Email ??
					true,
			},
			{
				key: "sms",
				label: "SMS",
				enabled:
					communicationPreferences.sms ?? communicationPreferences.SMS ?? false,
			},
			{
				key: "phone",
				label: "Phone",
				enabled:
					communicationPreferences.phone ??
					communicationPreferences.Phone ??
					false,
			},
		];

		return channels;
	}, [communicationPreferences]);

	const preferredContact =
		customer?.preferred_contact_method ??
		customer?.preferredContactMethod ??
		(typeof communicationPreferences?.preferred === "string"
			? communicationPreferences?.preferred
			: null) ??
		"email";

	const normalizedPreferredContact = preferredContact
		? preferredContact.replace(/_/g, " ")
		: "Not set";

	const customerSource =
		customer?.source ??
		customerMetadata?.source ??
		customerMetadata?.acquiredVia ??
		"—";

	const portalEnabled =
		customer?.portal_enabled ?? customer?.portalEnabled ?? false;

	const lastPortalLogin =
		customer?.portal_last_login_at ?? customer?.portalLastLoginAt ?? null;

	const customerSince = customer?.created_at ?? customer?.createdAt ?? null;

	const _lastInvoiceDate =
		customer?.last_invoice_date ?? customer?.lastInvoiceDate ?? null;

	const _lastPaymentDate =
		customer?.last_payment_date ?? customer?.lastPaymentDate ?? null;

	const lastJobDate = customer?.last_job_date ?? customer?.lastJobDate ?? null;

	const averageJobValue =
		customer?.average_job_value ?? customer?.averageJobValue ?? 0;

	const totalRevenue = customer?.total_revenue ?? customer?.totalRevenue ?? 0;

	const totalJobs = customer?.total_jobs ?? customer?.totalJobs ?? 0;

	const _outstandingInvoicesCount = openInvoices.length;
	const overdueInvoicesCount = overdueInvoices.length;

	const _internalNotes =
		customer?.internal_notes ?? customer?.internalNotes ?? "";

	const assignedTeamMembers = useMemo(() => {
		if (!Array.isArray(teamAssignments) || teamAssignments.length === 0) {
			return [];
		}

		const seen = new Set<string>();

		return teamAssignments
			.map((assignment: any) => {
				const teamMember = assignment?.team_member || assignment?.teamMember;
				if (!teamMember) {
					return null;
				}

				const user =
					teamMember.users ||
					teamMember.user ||
					assignment?.user ||
					assignment?.assigned_user;

				const memberId = teamMember.id ?? assignment.id;

				if (!memberId || seen.has(memberId)) {
					return null;
				}

				seen.add(memberId);

				return {
					id: memberId,
					userId: user?.id ?? teamMember.user_id ?? assignment.user_id ?? null,
					name:
						user?.name ??
						teamMember.name ??
						teamMember.display_name ??
						"Team member",
					title:
						teamMember.job_title ??
						assignment.job_title ??
						assignment.role ??
						user?.job_title ??
						null,
					avatar:
						user?.avatar ??
						user?.avatar_url ??
						user?.profile_image_url ??
						teamMember.avatar ??
						null,
					email: user?.email ?? teamMember.email ?? null,
				};
			})
			.filter(Boolean);
	}, [teamAssignments]);

	const currentTeamMemberIds = useMemo(() => {
		if (!Array.isArray(teamAssignments) || teamAssignments.length === 0) {
			return [];
		}

		const ids = teamAssignments
			.map((assignment: any) => {
				return (
					assignment.team_member_id ||
					assignment.teamMemberId ||
					assignment.team_member?.id ||
					assignment.id ||
					null
				);
			})
			.filter((id): id is string => Boolean(id));

		return Array.from(new Set(ids));
	}, [teamAssignments]);

	const _primaryAddressLine = [
		customer?.address,
		customer?.city,
		customer?.state,
		customer?.zip_code ?? customer?.zipCode,
	]
		.filter(Boolean)
		.join(", ");

	const secondaryPhone =
		customer?.secondary_phone ?? customer?.secondaryPhone ?? null;

	const billingEmail =
		customer?.billing_email ??
		customer?.billingEmail ??
		customer?.email ??
		null;

	const _lastCommunicationAt =
		lastCommunication?.created_at ?? lastCommunication?.createdAt ?? null;

	const _lastCommunicationChannel =
		lastCommunication?.channel ??
		lastCommunication?.type ??
		lastCommunication?.medium ??
		null;

	const _nextInvoiceDueDate =
		nextDueInvoice?.due_date ??
		nextDueInvoice?.dueDate ??
		nextDueInvoice?.due_on ??
		nextDueInvoice?.dueOn ??
		null;

	const _nextInvoiceBalance =
		nextDueInvoice?.balance_amount ?? nextDueInvoice?.balanceAmount ?? 0;

	const customerStatusLabel = (customer?.status || "active").replace(/_/g, " ");

	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case "paid":
			case "approved":
			case "completed":
				return "default";
			case "sent":
			case "scheduled":
			case "confirmed":
				return "secondary";
			case "in_progress":
				return "default";
			case "overdue":
			case "cancelled":
			case "no_show":
				return "destructive";
			case "rescheduled":
				return "outline";
			case "draft":
			case "pending":
				return "outline";
			default:
				return "secondary";
		}
	};

	const headerBadges = (
		job
			? [
					<Badge
						className="font-mono text-xs"
						key="job-number"
						variant="secondary"
					>
						#{job.job_number}
					</Badge>,
					localJob.status ? (
						<Badge
							className="font-medium capitalize"
							key="job-status"
							variant={getStatusColor(localJob.status) as any}
						>
							{localJob.status.replace(/_/g, " ")}
						</Badge>
					) : null,
					localJob.priority ? (
						<Badge
							className="font-medium capitalize"
							key="job-priority"
							variant={
								localJob.priority === "high" || localJob.priority === "urgent"
									? "destructive"
									: "outline"
							}
						>
							{localJob.priority}
						</Badge>
					) : null,
				]
			: []
	).filter(Boolean);

	const handleArchiveJob = async () => {
		setIsArchiving(true);
		try {
			const result = await archiveJob(job.id);
			if (result.success) {
				toast.success("Job archived successfully");
				setIsArchiveDialogOpen(false);
				router.push("/dashboard/work");
				// Server Action handles revalidation automatically
			} else {
				toast.error(result.error || "Failed to archive job");
			}
		} catch {
			toast.error("Failed to archive job");
		} finally {
			setIsArchiving(false);
		}
	};

	// Build subtitle with customer and property links
	const subtitleContent = (
		<div className="flex flex-wrap items-center gap-3 text-sm">
			{customer && (
				<Link
					className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
					href={`/dashboard/customers/${customer.id}`}
				>
					<User className="h-3.5 w-3.5" />
					<span className="font-medium">
						{customer.first_name} {customer.last_name}
					</span>
				</Link>
			)}
			{customer && property && (
				<span aria-hidden="true" className="text-muted-foreground/40">
					•
				</span>
			)}
			{property && (
				<>
					<Link
						className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
						href={`/dashboard/work/properties/${property.id}`}
					>
						<MapPin className="h-3.5 w-3.5" />
						<span className="font-medium">
							{property.city}, {property.state}{" "}
							{property.zip_code || property.zipCode || ""}
						</span>
					</Link>
					{/* TEMPORARILY DISABLED FOR DEBUGGING */}
					{/* <TravelTime property={property} /> */}
				</>
			)}
		</div>
	);

	// Build action buttons (only save/cancel when editing)
	// Note: Statistics, Invoice, Estimate, Clone, Archive are in the toolbar
	const primaryActions: ReactNode[] = [];
	const secondaryActions: ReactNode[] = [];

	// Add save/cancel buttons if there are changes
	if (hasChanges) {
		secondaryActions.unshift(
			<Button
				key="cancel"
				onClick={() => {
					setLocalJob({
						...job,
						priority: job.priority || "medium",
					});
					setHasChanges(false);
				}}
				size="sm"
				variant="outline"
			>
				Cancel
			</Button>,
			<Button disabled={isSaving} key="save" onClick={handleSave} size="sm">
				<Save className="mr-2 h-4 w-4" />
				{isSaving ? "Saving..." : "Save Changes"}
			</Button>,
		);
	}

	// Metadata items removed - stats are already shown in the top toolbar
	// const metadataItems: DetailPageHeaderConfig["metadata"] = [
	//   {
	//     label: "Total Amount",
	//     icon: <DollarSign className="h-3.5 w-3.5" />,
	//     value: formatCurrency(metrics.totalAmount),
	//   },
	//   {
	//     label: "Paid Amount",
	//     icon: <CreditCard className="h-3.5 w-3.5" />,
	//     value: formatCurrency(metrics.paidAmount),
	//     helperText: `${formatCurrency(metrics.totalAmount - metrics.paidAmount)} remaining`,
	//   },
	//   {
	//     label: "Labor Hours",
	//     icon: <Clock className="h-3.5 w-3.5" />,
	//     value: formatHours(metrics.totalLaborHours),
	//     helperText: metrics.estimatedLaborHours
	//       ? `${formatHours(metrics.estimatedLaborHours)} estimated`
	//       : undefined,
	//   },
	//   {
	//     label: "Profit Margin",
	//     icon: <TrendingUp className="h-3.5 w-3.5" />,
	//     value: `${metrics.profitMargin.toFixed(1)}%`,
	//   },
	// ];

	// Build header config - Now using AI Job Assistant Header
	const headerConfig: DetailPageHeaderConfig = {
		title: (
			<AIJobAssistantHeader
				job={localJob}
				customer={customer}
				property={property}
				metrics={metrics}
				teamAssignments={teamAssignments}
				timeEntries={timeEntries}
				invoices={invoices}
				payments={payments}
				estimates={estimates}
				userRole="owner" // TODO: Get from user context
				onTitleChange={(value) => handleFieldChange("title", value)}
				onSave={handleSave}
				onCancel={() => {
					setLocalJob({
						...job,
						priority: job.priority || "medium",
					});
					setHasChanges(false);
				}}
				isSaving={isSaving}
				hasChanges={hasChanges}
			/>
		),
		// subtitle, badges, actions all handled by AIJobAssistantHeader now
	};

	// Memoize property object to prevent unnecessary re-renders in child components
	const enrichmentProperty = useMemo(
		() =>
			property
				? {
						address: property.address,
						city: property.city,
						state: property.state,
						zip_code: property.zip_code,
						lat: property.lat,
						lon: property.lon,
					}
				: undefined,
		[
			property?.address,
			property?.city,
			property?.state,
			property?.zip_code,
			property?.lat,
			property?.lon,
		],
	);

	// Content to show before sections (editable fields, enrichment, travel time)
	const beforeContent = (
		<div className="space-y-3">
			{/* Alerts & Warnings - TEMPORARILY DISABLED FOR DEBUGGING */}
			{/* <JobEnrichmentInline
				enrichmentData={jobData.enrichmentData}
				jobId={jobData.job.id}
				property={enrichmentProperty}
			/> */}

			{/* Ultra-Compact Job Overview */}
			<DetailPageSurface padding="sm" variant="default" className="rounded-xl">
				<div className="space-y-2">
					{/* Top Row: Status, Priority, Travel Time - Inline */}
					<div className="flex items-center gap-3 flex-wrap">
						<StandardFormField label="Status" className="mb-0 min-w-[140px]">
							<JobStatusSelector
								currentStatus={(localJob.status || "quoted") as JobStatus}
								onStatusChange={(newStatus) =>
									handleFieldChange("status", newStatus)
								}
								job={{
									id: jobData.job.id,
									scheduled_start:
										localJob.scheduled_start || jobData.job.scheduled_start,
									scheduled_end:
										localJob.scheduled_end || jobData.job.scheduled_end,
									assigned_to: localJob.assigned_to || jobData.job.assigned_to,
									customer_id: localJob.customer_id || jobData.job.customer_id,
									property_id: localJob.property_id || jobData.property?.id,
									total_amount:
										localJob.total_amount || jobData.job.total_amount,
									invoices: jobData.invoices,
									estimates: jobData.estimates,
									teamAssignments: jobData.teamAssignments,
								}}
							/>
						</StandardFormField>

						<StandardFormField label="Priority" className="mb-0 min-w-[120px]">
							<Select
								onValueChange={(value) => handleFieldChange("priority", value)}
								value={localJob.priority || undefined}
							>
								<SelectTrigger className="h-8">
									<SelectValue placeholder="Set priority">
										<div className="flex items-center gap-1.5">
											<AlertCircle className="h-3.5 w-3.5" />
											<span className="capitalize text-xs">
												{localJob.priority || "Set priority"}
											</span>
										</div>
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="low">Low</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="high">High</SelectItem>
									<SelectItem value="urgent">Urgent</SelectItem>
								</SelectContent>
							</Select>
						</StandardFormField>

						{property && (
							<StandardFormField label="Travel" className="mb-0">
								<TravelTime property={property} />
							</StandardFormField>
						)}
					</div>

					{/* Compact Data Grid - All in one row with popovers for details */}
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
						{/* Customer - Compact with Popover */}
						{customer && (
							<Popover>
								<PopoverTrigger asChild>
									<button className="text-left p-2 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
										<div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
											<User className="h-2.5 w-2.5" />
											Customer
										</div>
										<div className="text-xs font-medium truncate">
											{customer.display_name ||
												`${customer.first_name} ${customer.last_name}`}
										</div>
										<div className="text-[10px] text-muted-foreground truncate">
											{customer.phone || customer.email || customer.type || ""}
										</div>
									</button>
								</PopoverTrigger>
								<PopoverContent className="w-64" align="start">
									<div className="space-y-2">
										<div>
											<div className="text-xs text-muted-foreground mb-1">
												Name
											</div>
											<Link
												href={`/dashboard/customers/${customer.id}`}
												className="text-sm font-medium text-primary hover:underline"
											>
												{customer.display_name ||
													`${customer.first_name} ${customer.last_name}`}
											</Link>
										</div>
										{customer.phone && (
											<div>
												<div className="text-xs text-muted-foreground mb-1">
													Phone
												</div>
												<a
													href={`tel:${customer.phone}`}
													className="text-sm text-primary hover:underline"
												>
													{customer.phone}
												</a>
											</div>
										)}
										{customer.email && (
											<div>
												<div className="text-xs text-muted-foreground mb-1">
													Email
												</div>
												<a
													href={`mailto:${customer.email}`}
													className="text-sm text-primary hover:underline"
												>
													{customer.email}
												</a>
											</div>
										)}
										<div>
											<div className="text-xs text-muted-foreground mb-1">
												Type
											</div>
											<Badge variant="outline" className="text-xs">
												{customer.type || "residential"}
											</Badge>
										</div>
									</div>
								</PopoverContent>
							</Popover>
						)}

						{/* Property - Compact with Popover */}
						{property && (
							<Popover>
								<PopoverTrigger asChild>
									<button className="text-left p-2 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
										<div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
											<MapPin className="h-2.5 w-2.5" />
											Location
										</div>
										<div className="text-xs font-medium truncate">
											{property.address}
										</div>
										<div className="text-[10px] text-muted-foreground truncate">
											{property.city}, {property.state}
										</div>
									</button>
								</PopoverTrigger>
								<PopoverContent className="w-64" align="start">
									<div className="space-y-2">
										<div>
											<div className="text-xs text-muted-foreground mb-1">
												Address
											</div>
											<div className="text-sm">
												{property.address}
												{property.address_line2 &&
													`, ${property.address_line2}`}
												<br />
												{property.city}, {property.state} {property.zip}
											</div>
											{property.lat && property.lon && (
												<a
													href={`https://www.google.com/maps?q=${property.lat},${property.lon}`}
													target="_blank"
													rel="noopener noreferrer"
													className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1"
												>
													<ExternalLink className="h-3 w-3" />
													Open in Maps
												</a>
											)}
										</div>
										<div className="grid grid-cols-2 gap-2">
											<div>
												<div className="text-xs text-muted-foreground mb-1">
													Type
												</div>
												<Badge variant="outline" className="text-xs">
													{property.property_type || "Unknown"}
												</Badge>
											</div>
											<div>
												<div className="text-xs text-muted-foreground mb-1">
													Access
												</div>
												{property.access_code ? (
													<code className="text-xs bg-muted px-1.5 py-0.5 rounded">
														{property.access_code}
													</code>
												) : (
													<span className="text-xs text-muted-foreground">
														None
													</span>
												)}
											</div>
										</div>
									</div>
								</PopoverContent>
							</Popover>
						)}

						{/* Schedule - Compact with Popover */}
						<Popover>
							<PopoverTrigger asChild>
								<button className="text-left p-2 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
									<div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
										<Calendar className="h-2.5 w-2.5" />
										Schedule
									</div>
									{localJob.scheduled_start ? (
										<>
											<div className="text-xs font-medium">
												{new Date(localJob.scheduled_start).toLocaleTimeString(
													"en-US",
													{
														hour: "numeric",
														minute: "2-digit",
														hour12: true,
													},
												)}
											</div>
											<div className="text-[10px] text-muted-foreground">
												{teamAssignments?.length || 0} tech
												{teamAssignments?.length !== 1 ? "s" : ""}
											</div>
										</>
									) : (
										<div className="text-xs text-muted-foreground">
											Not scheduled
										</div>
									)}
								</button>
							</PopoverTrigger>
							<PopoverContent className="w-64" align="start">
								<div className="space-y-2">
									<div className="grid grid-cols-2 gap-2">
										<div>
											<div className="text-xs text-muted-foreground mb-1">
												Start
											</div>
											<div className="text-sm">
												{localJob.scheduled_start
													? formatDate(localJob.scheduled_start)
													: "Not set"}
											</div>
										</div>
										<div>
											<div className="text-xs text-muted-foreground mb-1">
												End
											</div>
											<div className="text-sm">
												{localJob.scheduled_end
													? formatDate(localJob.scheduled_end)
													: "Not set"}
											</div>
										</div>
									</div>
									{teamAssignments && teamAssignments.length > 0 && (
										<div>
											<div className="text-xs text-muted-foreground mb-1">
												Team ({teamAssignments.length})
											</div>
											<div className="flex flex-wrap gap-1">
												{teamAssignments.map((assignment: any) => (
													<Badge
														key={assignment.id}
														variant="secondary"
														className="text-xs"
													>
														{assignment.user?.name || "Unknown"}
													</Badge>
												))}
											</div>
										</div>
									)}
								</div>
							</PopoverContent>
						</Popover>

						{/* Financial - Compact with Popover */}
						<Popover>
							<PopoverTrigger asChild>
								<button className="text-left p-2 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
									<div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
										<DollarSign className="h-2.5 w-2.5" />
										Financial
									</div>
									<div className="text-xs font-semibold">
										{formatCurrency(localJob.total_amount || 0)}
									</div>
									<div className="text-[10px] text-muted-foreground">
										{payments && payments.length > 0
											? `${formatCurrency(
													payments.reduce(
														(sum: number, p: any) => sum + (p.amount || 0),
														0,
													),
												)} paid`
											: "$0 paid"}
									</div>
								</button>
							</PopoverTrigger>
							<PopoverContent className="w-64" align="start">
								<div className="space-y-2">
									<div>
										<div className="text-xs text-muted-foreground mb-1">
											Job Value
										</div>
										<div className="text-sm font-semibold">
											{formatCurrency(localJob.total_amount || 0)}
										</div>
									</div>
									<div className="grid grid-cols-2 gap-2">
										<div>
											<div className="text-xs text-muted-foreground mb-1">
												Payments
											</div>
											<div className="text-sm font-semibold text-green-600 dark:text-green-400">
												{payments && payments.length > 0
													? formatCurrency(
															payments.reduce(
																(sum: number, p: any) => sum + (p.amount || 0),
																0,
															),
														)
													: "$0"}
											</div>
											<div className="text-[10px] text-muted-foreground">
												{payments?.length || 0} payment
												{payments?.length !== 1 ? "s" : ""}
											</div>
										</div>
										<div>
											<div className="text-xs text-muted-foreground mb-1">
												Estimates
											</div>
											<div className="text-sm">{estimates?.length || 0}</div>
											{estimates && estimates.length > 0 && (
												<Badge
													variant={
														estimates.some((e: any) => e.status === "accepted")
															? "default"
															: "secondary"
													}
													className="text-[10px] mt-0.5"
												>
													{estimates.find((e: any) => e.status === "accepted")
														? "Accepted"
														: "Pending"}
												</Badge>
											)}
										</div>
										<div>
											<div className="text-xs text-muted-foreground mb-1">
												Invoices
											</div>
											<div className="text-sm">{invoices?.length || 0}</div>
										</div>
									</div>
								</div>
							</PopoverContent>
						</Popover>

						{/* Activity - Compact with Popover */}
						<Popover>
							<PopoverTrigger asChild>
								<button className="text-left p-2 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
									<div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
										<MessageSquare className="h-2.5 w-2.5" />
										Activity
									</div>
									<div className="text-xs font-medium">
										{(communications?.length || 0) +
											(jobNotes?.length || 0) +
											(photos?.length || 0) +
											(documents?.length || 0)}{" "}
										items
									</div>
									<div className="text-[10px] text-muted-foreground">
										{communications?.length || 0} msg • {jobNotes?.length || 0}{" "}
										notes
									</div>
								</button>
							</PopoverTrigger>
							<PopoverContent className="w-64" align="start">
								<div className="grid grid-cols-2 gap-2">
									<div>
										<div className="text-xs text-muted-foreground mb-1">
											Messages
										</div>
										<div className="text-sm font-semibold">
											{communications?.length || 0}
										</div>
									</div>
									<div>
										<div className="text-xs text-muted-foreground mb-1">
											Notes
										</div>
										<div className="text-sm font-semibold">
											{jobNotes?.length || 0}
										</div>
									</div>
									<div>
										<div className="text-xs text-muted-foreground mb-1">
											Photos
										</div>
										<div className="text-sm font-semibold">
											{photos?.length || 0}
										</div>
									</div>
									<div>
										<div className="text-xs text-muted-foreground mb-1">
											Documents
										</div>
										<div className="text-sm font-semibold">
											{documents?.length || 0}
										</div>
									</div>
								</div>
							</PopoverContent>
						</Popover>

						{/* Service - Compact with Collapsible */}
						<Collapsible>
							<CollapsibleTrigger asChild>
								<button className="text-left p-2 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50 w-full">
									<div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
										<Wrench className="h-2.5 w-2.5" />
										Service
									</div>
									<div className="text-xs font-medium truncate">
										{localJob.service_type || localJob.job_type || "Not set"}
									</div>
									<div className="text-[10px] text-muted-foreground">
										{jobEquipment?.length || 0} equipment
									</div>
								</button>
							</CollapsibleTrigger>
							<CollapsibleContent className="mt-2">
								<div className="space-y-2 p-2 bg-muted/30 rounded-md">
									<StandardFormField
										label="Service Type"
										htmlFor="service-type"
										className="mb-0"
									>
										<Input
											id="service-type"
											onChange={(e) =>
												handleFieldChange("service_type", e.target.value)
											}
											placeholder="e.g. HVAC Maintenance"
											value={localJob.service_type || localJob.job_type || ""}
											className="h-8 text-sm"
										/>
									</StandardFormField>
									{jobEquipment && jobEquipment.length > 0 && (
										<div>
											<div className="text-xs text-muted-foreground mb-1">
												Equipment
											</div>
											<div className="flex flex-wrap gap-1.5">
												{jobEquipment.map((eq: any) => (
													<Badge
														key={eq.id}
														variant="outline"
														className="text-xs"
													>
														{eq.equipment?.name || eq.equipment_id}
													</Badge>
												))}
											</div>
										</div>
									)}
									<StandardFormField
										label="Description"
										htmlFor="job-description"
										className="mb-0"
									>
										<Textarea
											id="job-description"
											onChange={(e) =>
												handleFieldChange("description", e.target.value)
											}
											placeholder="Add context, expectations, or key notes for the crew."
											value={localJob.description || ""}
											className="min-h-[60px] text-sm"
										/>
									</StandardFormField>
								</div>
							</CollapsibleContent>
						</Collapsible>
					</div>

					{/* Quick Actions Footer */}
					<div className="flex justify-end pt-2 border-t border-border/40">
						<JobQuickActions currentStatus={job.status} jobId={job.id} />
					</div>
				</div>
			</DetailPageSurface>
		</div>
	);

	const sections: UnifiedAccordionSection[] = [];

	sections.push({
		id: "customer",
		title: "Customer & Property",
		icon: <User className="size-4" />,
		count: customer ? 1 : 0,
		actions: (
			<JobCustomerPropertyManager
				currentCustomer={
					customer
						? {
								id: customer.id,
								first_name: customer.first_name || "",
								last_name: customer.last_name || "",
								display_name: customer.display_name || "",
								email: customer.email || "",
								phone: customer.phone || "",
								company_name: customer.company_name,
								type: customer.type || "residential",
								address: customer.address,
								city: customer.city,
								state: customer.state,
								zip: customer.zip,
							}
						: null
				}
				currentProperty={
					property
						? {
								id: property.id,
								customer_id: property.customer_id,
								address: property.address || "",
								address_line2: property.address_line2,
								city: property.city || "",
								state: property.state || "",
								zip: property.zip || "",
								property_type: property.property_type,
							}
						: null
				}
				getCustomerProperties={getCustomerProperties}
				onAssignCustomer={async (selectedCustomer, selectedProperty) => {
					const result = await assignCustomerToJob(
						job.id,
						selectedCustomer.id,
						selectedProperty?.id || null,
					);

					if (result.success) {
						// Update local state immediately so UI reflects the change without waiting for router refresh
						setCustomer(selectedCustomer);
						setProperty(selectedProperty ?? null);
						toast.success("Customer and property assigned successfully");
						safeRefresh();
					} else {
						toast.error(result.error || "Failed to assign customer");
					}
				}}
				onRemoveCustomer={async () => {
					const result = await removeCustomerFromJob(job.id);

					if (result.success) {
						setCustomer(null);
						setProperty(null);
						toast.success("Customer and property removed successfully");
						safeRefresh();
					} else {
						toast.error(result.error || "Failed to remove customer");
					}
				}}
				onRemoveProperty={async () => {
					if (!customer) {
						return;
					}

					const result = await assignCustomerToJob(job.id, customer.id, null);

					if (result.success) {
						setProperty(null);
						toast.success("Property removed from job");
						safeRefresh();
					} else {
						toast.error(result.error || "Failed to remove property");
					}
				}}
				searchCustomers={searchCustomersForJob}
			/>
		),
		content: (
			<UnifiedAccordionContent className="space-y-6">
				<div className="flex flex-col gap-6 lg:flex-row">
					{customer ? (
						<div className="flex min-w-0 flex-1 flex-col gap-6">
							<div className="border-border/60 bg-card/80 rounded-xl border p-6 shadow-sm">
								<div className="flex items-start justify-between gap-6">
									<div className="flex min-w-0 items-start gap-4">
										<div className="bg-primary/10 text-primary flex size-14 flex-shrink-0 items-center justify-center rounded-full text-xl font-semibold">
											{customer.first_name?.[0]}
											{customer.last_name?.[0]}
										</div>
										<div className="min-w-0 space-y-1.5">
											{customerDetailPath ? (
												<Link
													className="text-foreground hover:text-primary block text-lg font-semibold transition-colors"
													href={customerDetailPath}
												>
													{customer.first_name} {customer.last_name}
												</Link>
											) : (
												<span className="text-foreground block text-lg font-semibold">
													{customer.first_name} {customer.last_name}
												</span>
											)}
											<div className="flex flex-wrap items-center gap-2">
												<Badge
													className="h-6 rounded-full px-2.5 text-[11px] font-medium capitalize"
													variant="outline"
												>
													{customerStatusLabel}
												</Badge>
												<span
													className={cn(
														"inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
														accountToneClass,
													)}
													title={accountHealth.description}
												>
													<ShieldCheck className="h-3 w-3" />
													{accountHealth.label}
												</span>
												{membershipLabel && (
													<span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium">
														<Sparkles className="h-3 w-3" />
														{membershipLabel}
													</span>
												)}
											</div>
										</div>
									</div>
									{customerDetailPath && (
										<Button
											asChild
											className="flex-shrink-0"
											size="sm"
											variant="outline"
										>
											<Link
												className="flex items-center gap-1.5"
												href={customerDetailPath}
											>
												View Profile
												<ChevronRight className="h-3.5 w-3.5" />
											</Link>
										</Button>
									)}
								</div>
							</div>

							<div className="border-border/60 bg-card/80 rounded-xl border shadow-sm">
								<div className="divide-border/40 bg-muted/20 grid grid-cols-2 divide-x divide-y sm:divide-y-0 md:grid-cols-4 px-4 py-4 sm:px-6">
									<div className="px-3 py-3 first:pl-0 last:pr-0 sm:py-0">
										<div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
											Lifetime Value
										</div>
										<div className="text-foreground mt-1 text-lg font-bold">
											{formatCurrency(totalRevenue)}
										</div>
										<div className="text-muted-foreground mt-0.5 text-xs">
											{totalJobs} job{totalJobs === 1 ? "" : "s"} ·{" "}
											{formatCurrency(averageJobValue)} avg
										</div>
									</div>
									<div className="px-3 py-3 first:pl-0 last:pr-0 sm:py-0">
										<div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
											Balance Due
										</div>
										<div
											className={cn(
												"mt-1 text-lg font-bold",
												outstandingBalance > 0
													? "text-warning"
													: "text-foreground",
											)}
										>
											{formatCurrency(outstandingBalance)}
										</div>
										<div className="text-muted-foreground mt-0.5 text-xs">
											{overdueInvoicesCount > 0
												? `${overdueInvoicesCount} overdue`
												: normalizedPaymentTerms}
										</div>
									</div>
									<div className="px-3 py-3 first:pl-0 last:pr-0 sm:py-0">
										<div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
											Credit Limit
										</div>
										<div className="text-foreground mt-1 text-lg font-bold">
											{creditLimit > 0 ? formatCurrency(creditLimit) : "None"}
										</div>
										<div className="text-muted-foreground mt-0.5 text-xs">
											{creditLimit > 0 && outstandingBalance > 0
												? `${Math.round((outstandingBalance / creditLimit) * 100)}% used`
												: creditLimit > 0
													? "Available"
													: "Cash only"}
										</div>
									</div>
									<div className="px-3 py-3 first:pl-0 last:pr-0 sm:py-0">
										<div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
											Customer Since
										</div>
										<div className="text-foreground mt-1 text-lg font-bold">
											{customerSince ? formatRelativeTime(customerSince) : "—"}
										</div>
										<div className="text-muted-foreground mt-0.5 text-xs capitalize">
											via {customerSource}
										</div>
									</div>
								</div>
							</div>

							<div className="border-border/60 bg-card/80 rounded-xl border p-6 shadow-sm">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
											Contact
										</div>
										<div className="flex items-center gap-1.5">
											{customer.email && (
												<Button
													className="h-7 w-7 p-0"
													onClick={() => setIsEmailDialogOpen(true)}
													size="sm"
													title="Send Email"
													variant="outline"
												>
													<Mail className="h-3.5 w-3.5" />
												</Button>
											)}
											{customer.phone && (
												<>
													<Button
														className="h-7 w-7 p-0"
														onClick={() => {
															setIncomingCall({
																number: customer.phone,
																name: `${customer.first_name} ${customer.last_name}`,
																avatar: customer.avatar_url,
															});
														}}
														size="sm"
														title="Call"
														variant="outline"
													>
														<Phone className="h-3.5 w-3.5" />
													</Button>
													<Button
														className="h-7 w-7 p-0"
														onClick={() => setIsSMSDialogOpen(true)}
														size="sm"
														title="Send Text Message"
														variant="outline"
													>
														<MessageSquare className="h-3.5 w-3.5" />
													</Button>
												</>
											)}
										</div>
									</div>
									<dl className="grid gap-3">
										{customer.email && (
											<div className="flex items-center gap-2.5">
												<div className="bg-muted flex size-8 flex-shrink-0 items-center justify-center rounded-lg">
													<Mail className="text-muted-foreground h-3.5 w-3.5" />
												</div>
												<div className="min-w-0 flex-1">
													<dt className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
														Email
													</dt>
													<dd className="text-foreground truncate text-sm font-medium">
														{customer.email}
													</dd>
												</div>
											</div>
										)}
										{customer.phone && (
											<div className="flex items-center gap-2.5">
												<div className="bg-muted flex size-8 flex-shrink-0 items-center justify-center rounded-lg">
													<Phone className="text-muted-foreground h-3.5 w-3.5" />
												</div>
												<div className="min-w-0 flex-1">
													<dt className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
														Phone
													</dt>
													<dd className="text-foreground text-sm font-medium">
														{customer.phone}
													</dd>
												</div>
											</div>
										)}
										{secondaryPhone && (
											<div className="flex items-center gap-2.5">
												<div className="bg-muted flex size-8 flex-shrink-0 items-center justify-center rounded-lg">
													<Phone className="text-muted-foreground h-3.5 w-3.5" />
												</div>
												<div className="min-w-0 flex-1">
													<dt className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
														Alt Phone
													</dt>
													<dd className="text-foreground text-sm font-medium">
														{secondaryPhone}
													</dd>
												</div>
											</div>
										)}
										{billingEmail && billingEmail !== customer.email && (
											<div className="flex items-center gap-2.5">
												<div className="bg-muted flex size-8 flex-shrink-0 items-center justify-center rounded-lg">
													<Receipt className="text-muted-foreground h-3.5 w-3.5" />
												</div>
												<div className="min-w-0 flex-1">
													<dt className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
														Billing Email
													</dt>
													<dd className="text-foreground truncate text-sm font-medium">
														{billingEmail}
													</dd>
												</div>
											</div>
										)}
									</dl>
								</div>
							</div>

							<div className="border-border/60 bg-card/80 rounded-xl border p-6 shadow-sm">
								<div className="space-y-4">
									<div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
										Account Details
									</div>
									<dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
										<div>
											<dt className="text-muted-foreground text-xs">
												Portal Access
											</dt>
											<dd className="text-foreground mt-1 text-sm font-medium">
												{portalEnabled ? (
													<span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-200">
														<Globe className="h-3.5 w-3.5" /> Enabled
													</span>
												) : (
													<span className="text-muted-foreground">
														Disabled
													</span>
												)}
											</dd>
											{portalEnabled && lastPortalLogin && (
												<dd className="text-muted-foreground mt-0.5 text-xs">
													Last login {formatRelativeTime(lastPortalLogin)}
												</dd>
											)}
										</div>
										<div>
											<dt className="text-muted-foreground text-xs">
												Preferred Contact
											</dt>
											<dd className="text-foreground mt-1 text-sm font-medium capitalize">
												{normalizedPreferredContact}
											</dd>
											{communicationChannels && (
												<dd className="mt-1.5 flex flex-wrap gap-1.5">
													{communicationChannels.map(
														(channel) =>
															channel.enabled && (
																<span
																	className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200"
																	key={channel.key}
																>
																	{channel.label}
																</span>
															),
													)}
												</dd>
											)}
										</div>
										<div>
											<dt className="text-muted-foreground text-xs">
												Last Activity
											</dt>
											<dd className="text-foreground mt-1 text-sm font-medium">
												{lastJobDate
													? formatRelativeTime(lastJobDate)
													: "No activity"}
											</dd>
											{nextVisit && (
												<dd className="text-muted-foreground mt-0.5 text-xs">
													Next:{" "}
													{formatRelativeTime(
														nextVisit.start_time ??
															nextVisit.startTime ??
															nextVisit.start_at ??
															nextVisit.startAt,
													)}
												</dd>
											)}
										</div>
									</dl>
								</div>
							</div>

							{/* Job Tags Section */}
							<div className="border-border/60 bg-card/80 rounded-xl border p-6 shadow-sm">
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<Tag className="text-muted-foreground size-4" />
										<h4 className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
											Job Tags
										</h4>
									</div>
									<EntityTags
										entityId={job.id}
										entityType="job"
										tags={jobTags}
										onUpdateTags={async (id, tags) => {
											const result = await updateEntityTags("job", id, tags);
											if (result.success) {
												safeRefresh();
											}
										}}
									/>
								</div>
							</div>

							{(assignedTeamMembers.length > 0 || customerTags.length > 0) && (
								<div className="border-border/60 bg-card/80 rounded-xl border p-6 shadow-sm">
									<div className="space-y-4">
										{assignedTeamMembers.length > 0 && (
											<div className="space-y-2">
												<div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
													Assigned Team
												</div>
												<div className="flex flex-wrap gap-2">
													{assignedTeamMembers.filter(Boolean).map((member) => (
														<Link
															className="group border-border/60 bg-background text-foreground hover:border-primary/50 hover:bg-primary/5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
															href={
																member?.id
																	? `/dashboard/settings/team/${member.id}`
																	: "/dashboard/settings/team"
															}
															key={member?.id || "unknown"}
														>
															<Avatar className="bg-muted h-6 w-6 border border-white/10">
																{member?.avatar ? (
																	<AvatarImage
																		alt={member?.name || "Team Member"}
																		src={member.avatar}
																	/>
																) : (
																	<AvatarFallback className="text-[10px]">
																		{member?.name
																			?.split(" ")
																			.map((part: string) => part[0])
																			.join("")
																			.slice(0, 2)
																			.toUpperCase() || "TM"}
																	</AvatarFallback>
																)}
															</Avatar>
															<span>{member?.name || "Unknown"}</span>
														</Link>
													))}
												</div>
											</div>
										)}

										{customerTags.length > 0 && (
											<div className="space-y-2">
												<div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
													Tags
												</div>
												<div className="flex flex-wrap gap-2">
													{customerTags.map((tag) => (
														<span
															className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
															key={tag}
														>
															{tag}
														</span>
													))}
												</div>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					) : (
						<div className="border-border/60 bg-background flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center">
							<div className="bg-muted mb-3 flex size-12 items-center justify-center rounded-full">
								<User className="text-muted-foreground size-6" />
							</div>
							<p className="text-muted-foreground text-sm">
								No customer assigned
							</p>
							<p className="text-muted-foreground mt-1 text-xs">
								Assign a customer to unlock profile insights.
							</p>
						</div>
					)}

					<aside className="mt-6 space-y-6 lg:mt-0 lg:w-[360px]">
						{property ? (
							<>
								<div className="border-border/60 bg-card/80 rounded-xl border p-0 shadow-sm">
									{canShowInteractiveMap ? (
										<PropertyLocationVisual property={property} />
									) : (
										<div className="space-y-4 p-6">
											<Skeleton className="h-40 w-full rounded-lg" />
											<div className="text-muted-foreground space-y-1 text-sm">
												<p>
													Connect a Google Maps API key or add coordinates to
													visualize this location.
												</p>
												<p className="text-xs">
													Update property details to include latitude and
													longitude for enhanced routing.
												</p>
											</div>
										</div>
									)}
								</div>

								<div className="border-border/60 bg-card/80 space-y-3 rounded-xl border p-6 shadow-sm">
									<div className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
										Property Details
									</div>
									<dl className="space-y-2 text-sm">
										<div>
											<dt className="text-muted-foreground text-xs">Address</dt>
											<dd className="text-foreground">
												{property.address}
												{property.address2 ? `, ${property.address2}` : ""}
												<br />
												{property.city}, {property.state} {property.zip_code}
											</dd>
										</div>
										{property.square_footage && (
											<div>
												<dt className="text-muted-foreground text-xs">
													Square Footage
												</dt>
												<dd className="text-foreground">
													{property.square_footage}
												</dd>
											</div>
										)}
										{property.year_built && (
											<div>
												<dt className="text-muted-foreground text-xs">
													Year Built
												</dt>
												<dd className="text-foreground">
													{property.year_built}
												</dd>
											</div>
										)}
									</dl>
								</div>
							</>
						) : (
							<div className="border-border/60 bg-background text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center text-sm">
								No property assigned
							</div>
						)}
					</aside>
				</div>
			</UnifiedAccordionContent>
		),
	});

	// Transform teamAssignments to match JobTeamMembersTable expected format
	const transformedTeamMembers = useMemo(() => {
		if (!Array.isArray(teamAssignments) || teamAssignments.length === 0) {
			return [];
		}

		return teamAssignments
			.map((assignment: any) => {
				const teamMember = assignment?.team_member || assignment?.teamMember;
				if (!teamMember) {
					return null;
				}

				// Handle both user (single) and users (array) formats
				const user =
					teamMember.user ||
					teamMember.users?.[0] ||
					assignment?.user ||
					assignment?.assigned_user;

				// Get user ID from various possible locations
				const userId = user?.id || teamMember.user_id || assignment.user_id;
				if (!userId) {
					return null;
				}

				// Build user name from various possible formats
				let userName: string | null = null;
				if (user?.name) {
					userName = user.name;
				} else if (user?.first_name || user?.last_name) {
					userName = [user.first_name, user.last_name]
						.filter(Boolean)
						.join(" ");
				} else if (teamMember.user?.name) {
					userName = teamMember.user.name;
				} else if (user?.email) {
					userName = user.email;
				}

				return {
					id: assignment.id || assignment.team_member_id || teamMember.id,
					user_id: userId,
					team_member: {
						job_title:
							teamMember.job_title || assignment.job_title || undefined,
						user: {
							name: userName || undefined,
							email: user?.email || teamMember.email || undefined,
							avatar_url:
								user?.avatar_url ||
								user?.avatar ||
								teamMember.avatar ||
								undefined,
							first_name:
								user?.first_name ||
								(userName ? userName.split(" ")[0] : undefined),
							last_name:
								user?.last_name ||
								(userName && userName.includes(" ")
									? userName.split(" ").slice(1).join(" ")
									: undefined),
						},
					},
					assigned_at:
						assignment.assigned_at ||
						assignment.assignedAt ||
						new Date().toISOString(),
					role: assignment.role || "crew",
				};
			})
			.filter((member) => member !== null) as Array<{
			id: string;
			user_id: string;
			team_member: {
				job_title?: string;
				user: {
					name?: string;
					email?: string;
					avatar_url?: string;
					first_name?: string;
					last_name?: string;
				};
			};
			assigned_at: string;
			role?: string;
		}>;
	}, [teamAssignments]);

	sections.push({
		id: "team",
		title: "Team Members",
		icon: <Users className="size-4" />,
		count: transformedTeamMembers.length,
		actions: (
			<JobTeamMemberSelector
				availableMembers={availableTeamMembers}
				currentMemberIds={currentTeamMemberIds}
				onAssign={handleAssignTeamMember}
			/>
		),
		content: (
			<UnifiedAccordionContent className="overflow-x-auto p-0 sm:p-0">
				<JobTeamMembersTable
					teamMembers={transformedTeamMembers}
					onRemoveMember={handleRemoveTeamMember}
				/>
			</UnifiedAccordionContent>
		),
	});

	sections.push({
		id: "appointments",
		title: "Appointments",
		icon: <Calendar className="size-4" />,
		count: schedules.length,
		actions: (
			<Button
				onClick={() => router.push(`/dashboard/schedule/new?jobId=${job.id}`)}
				size="sm"
				variant="outline"
			>
				<Plus className="mr-2 h-4 w-4" /> Add Appointment
			</Button>
		),
		content: (
			<UnifiedAccordionContent className="p-0 sm:p-0">
				<JobAppointmentsExpandable appointments={schedules} />
			</UnifiedAccordionContent>
		),
	});

	sections.push({
		id: "equipment-serviced",
		title: "Equipment Serviced",
		icon: <Wrench className="size-4" />,
		count: jobEquipment.length,
		actions: (
			<div className="flex items-center gap-2">
				<Button
					onClick={() => setIsLinkEquipmentOpen(true)}
					size="sm"
					variant="ghost"
				>
					<Link2 className="mr-2 h-4 w-4" /> Link Existing
				</Button>
				<Button
					onClick={() =>
						router.push(`/dashboard/work/equipment/new?jobId=${job.id}`)
					}
					size="sm"
					variant="outline"
				>
					<Plus className="mr-2 h-4 w-4" /> Add Equipment
				</Button>
			</div>
		),
		content: (
			<UnifiedAccordionContent>
				{jobEquipment.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
							<Wrench className="text-muted-foreground h-8 w-8" />
						</div>
						<h3 className="mb-2 text-lg font-semibold">
							No equipment has been added to this job yet
						</h3>
						<p className="text-muted-foreground mb-4 text-sm">
							Equipment serviced on this job will appear here
						</p>
						<Button onClick={() => {}} size="sm" variant="secondary">
							<Plus className="mr-2 h-4 w-4" /> Add Equipment
						</Button>
					</div>
				) : (
					<div className="space-y-4">
						{jobEquipment.map((je: any) => (
							<div
								className="hover:bg-accent/50 space-y-3 rounded-lg border p-4 transition-colors"
								key={je.id}
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="mb-2 flex items-center gap-2">
											<h4 className="font-semibold">{je.equipment?.name}</h4>
											<Badge variant="secondary">{je.service_type}</Badge>
										</div>
										<div className="text-muted-foreground space-y-1 text-sm">
											<p>
												{je.equipment?.manufacturer} {je.equipment?.model}
												{je.equipment?.serial_number &&
													` • SN: ${je.equipment.serial_number}`}
											</p>
										</div>
									</div>
								</div>
								{je.work_performed && (
									<div className="text-sm">
										<span className="font-medium">Work Performed:</span>
										<p className="text-muted-foreground mt-1">
											{je.work_performed}
										</p>
									</div>
								)}
								<div className="flex flex-wrap items-center gap-4 text-sm">
									{je.condition_before && (
										<div>
											<span className="text-muted-foreground mr-2">
												Before:
											</span>
											<Badge variant="outline">{je.condition_before}</Badge>
										</div>
									)}
									{je.condition_after && (
										<div>
											<span className="text-muted-foreground mr-2">After:</span>
											<Badge variant="default">{je.condition_after}</Badge>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</UnifiedAccordionContent>
		),
	});

	if (equipment.length > 0) {
		sections.push({
			id: "equipment",
			title: "Customer Equipment at Property",
			icon: <Building2 className="size-4" />,
			count: equipment.length,
			content: (
				<UnifiedAccordionContent className="p-0">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Equipment</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Manufacturer</TableHead>
									<TableHead>Model</TableHead>
									<TableHead>Serial #</TableHead>
									<TableHead>Last Service</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{equipment.map((item: any) => (
									<TableRow key={item.id}>
										<TableCell className="font-medium">{item.name}</TableCell>
										<TableCell>{item.type}</TableCell>
										<TableCell>{item.manufacturer || "N/A"}</TableCell>
										<TableCell>{item.model || "N/A"}</TableCell>
										<TableCell className="font-mono text-sm">
											{item.serial_number || "N/A"}
										</TableCell>
										<TableCell className="text-sm">
											{item.last_service_date
												? formatDate(item.last_service_date)
												: "Never"}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</UnifiedAccordionContent>
			),
		});
	}

	sections.push({
		id: "estimates",
		title: "Estimates",
		icon: <Receipt className="size-4" />,
		count: estimates.length,
		actions: (
			<div className="flex items-center gap-2">
				<Button
					onClick={() => setIsLinkEstimateOpen(true)}
					size="sm"
					variant="ghost"
				>
					<Link2 className="mr-2 h-4 w-4" /> Link Existing
				</Button>
				<Button
					onClick={() =>
						router.push(`/dashboard/work/estimates/new?jobId=${job.id}`)
					}
					size="sm"
					variant="outline"
				>
					<Plus className="mr-2 h-4 w-4" /> Create Estimate
				</Button>
			</div>
		),
		content: (
			<UnifiedAccordionContent className="overflow-x-auto p-0 sm:p-0">
				<JobEstimatesTable estimates={estimates} />
			</UnifiedAccordionContent>
		),
	});

	sections.push({
		id: "invoices",
		title: "Invoices",
		icon: <FileText className="size-4" />,
		count: invoices.length,
		actions: (
			<div className="flex items-center gap-2">
				<Button
					onClick={() => setIsLinkInvoiceOpen(true)}
					size="sm"
					variant="ghost"
				>
					<Link2 className="mr-2 h-4 w-4" /> Link Existing
				</Button>
				<Button
					onClick={() =>
						router.push(`/dashboard/work/invoices/new?jobId=${job.id}`)
					}
					size="sm"
					variant="outline"
				>
					<Plus className="mr-2 h-4 w-4" /> Create Invoice
				</Button>
			</div>
		),
		content: (
			<UnifiedAccordionContent className="overflow-x-auto p-0 sm:p-0">
				<JobInvoicesTable invoices={invoices} />
			</UnifiedAccordionContent>
		),
	});

	sections.push({
		id: "payments",
		title: "Payments",
		icon: <DollarSign className="size-4" />,
		count: payments.length,
		actions: (
			<div className="flex items-center gap-2">
				<Button
					onClick={() => setIsLinkPaymentOpen(true)}
					size="sm"
					variant="ghost"
				>
					<Link2 className="mr-2 h-4 w-4" /> Link Existing
				</Button>
				<Button
					onClick={() =>
						router.push(`/dashboard/work/payments/new?jobId=${job.id}`)
					}
					size="sm"
					variant="outline"
				>
					<Plus className="mr-2 h-4 w-4" /> Record Payment
				</Button>
			</div>
		),
		content: (
			<UnifiedAccordionContent className="overflow-x-auto p-0 sm:p-0">
				<JobPaymentsTable payments={payments} />
			</UnifiedAccordionContent>
		),
	});

	sections.push({
		id: "purchase-orders",
		title: "Purchase Orders",
		icon: <Package className="size-4" />,
		count: purchaseOrders.length,
		actions: (
			<Button
				onClick={() =>
					router.push(`/dashboard/work/purchase-orders/new?jobId=${job.id}`)
				}
				size="sm"
				variant="outline"
			>
				<Plus className="mr-2 h-4 w-4" /> Create PO
			</Button>
		),
		content: (
			<UnifiedAccordionContent className="overflow-x-auto p-0 sm:p-0">
				<JobPurchaseOrdersTable purchaseOrders={purchaseOrders} />
			</UnifiedAccordionContent>
		),
	});

	sections.push({
		id: "photos",
		title: "Photos & Documents",
		icon: <Camera className="size-4" />,
		count: photos.length + documents.length,
		actions: (
			<>
				<input
					accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
					className="hidden"
					multiple
					onChange={(e) => {
						if (e.target.files && e.target.files.length > 0) {
							setShowUploader(true);
						}
					}}
					ref={fileInputRef}
					type="file"
				/>
				<Button
					onClick={() => fileInputRef.current?.click()}
					size="sm"
					variant="outline"
				>
					<Plus className="mr-2 h-4 w-4" /> Upload
				</Button>
			</>
		),
		content: (
			<UnifiedAccordionContent className="p-0">
				<div
					className={cn(
						"relative transition-colors",
						isDraggingOver && "bg-primary/5 ring-primary ring-2 ring-inset",
					)}
					onDragEnter={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setIsDraggingOver(true);
					}}
					onDragLeave={(e) => {
						e.preventDefault();
						e.stopPropagation();
						if (e.currentTarget === e.target) {
							// Only set to false if leaving the container entirely
							setIsDraggingOver(false);
						}
					}}
					onDragOver={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
					onDrop={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setIsDraggingOver(false);
						setShowUploader(true);
					}}
				>
					{isDraggingOver && (
						<div className="bg-primary/5 pointer-events-none absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
							<div className="border-primary bg-background rounded-lg border-2 border-dashed p-8 text-center">
								<Upload className="text-primary mx-auto mb-2 h-12 w-12" />
								<p className="text-primary font-semibold">
									Drop files to upload
								</p>
								<p className="text-muted-foreground text-sm">
									Photos, documents, and more
								</p>
							</div>
						</div>
					)}
					<div className="bg-muted/30 border-b px-6 py-3">
						<div className="text-muted-foreground flex items-center gap-2 text-sm">
							<Upload className="h-4 w-4" />
							<span>
								Drag and drop files anywhere in this section to upload
							</span>
						</div>
					</div>
					<div className="space-y-6 px-6 py-6">
						{showUploader && (
							<InlinePhotoUploader
								companyId={job.company_id}
								jobId={job.id}
								onCancel={() => setShowUploader(false)}
								onUploadComplete={() => {
									setShowUploader(false);
									// Server Action handles revalidation automatically
								}}
							/>
						)}

						<div>
							<div className="mb-3 flex items-center justify-between">
								<h4 className="font-semibold">
									Photos by Category ({photos.length})
								</h4>
							</div>
							{photos.length > 0 ? (
								<div className="grid gap-3 md:grid-cols-4">
									{[
										"before",
										"during",
										"after",
										"issue",
										"equipment",
										"completion",
										"other",
									].map((category) => {
										const count = photos.filter(
											(p: any) => p.category === category,
										).length;
										return (
											<div
												className="rounded-lg border p-4 text-center"
												key={category}
											>
												<p className="text-muted-foreground text-xs font-medium uppercase">
													{category}
												</p>
												<p className="text-3xl font-bold">{count}</p>
											</div>
										);
									})}
								</div>
							) : (
								<div className="flex flex-col items-center justify-center py-8 text-center">
									<div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
										<Camera className="text-muted-foreground h-8 w-8" />
									</div>
									<h3 className="mb-2 text-lg font-semibold">
										No photos uploaded yet
									</h3>
									<p className="text-muted-foreground mb-4 text-sm">
										Upload photos to document the job progress
									</p>
									<Button
										onClick={() => setShowUploader(true)}
										size="sm"
										variant="secondary"
									>
										<Plus className="mr-2 h-4 w-4" /> Upload Photos
									</Button>
								</div>
							)}
						</div>

						<Separator />

						<div>
							<h4 className="mb-3 font-semibold">
								Documents ({documents.length})
							</h4>
							{documents.length > 0 ? (
								<div className="space-y-2">
									{documents.map((doc: any) => (
										<div
											className="flex items-center justify-between rounded-lg border p-3"
											key={doc.id}
										>
											<div className="flex items-center gap-2">
												<FileText className="text-muted-foreground h-4 w-4" />
												<span className="text-sm">{doc.file_name}</span>
											</div>
											<Button
												className="h-8 px-2"
												size="sm"
												variant="secondary"
											>
												<Download className="h-3.5 w-3.5" />
											</Button>
										</div>
									))}
								</div>
							) : (
								<div className="flex flex-col items-center justify-center py-8 text-center">
									<div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
										<FileText className="text-muted-foreground h-8 w-8" />
									</div>
									<h3 className="mb-2 text-lg font-semibold">
										No documents uploaded yet
									</h3>
									<p className="text-muted-foreground mb-4 text-sm">
										Upload documents, receipts, or other files related to this
										job
									</p>
									<Button
										onClick={() => setShowUploader(true)}
										size="sm"
										variant="secondary"
									>
										<Plus className="mr-2 h-4 w-4" /> Upload Document
									</Button>
								</div>
							)}
						</div>

						<Separator />

						<div>
							<h4 className="mb-3 font-semibold">Signatures</h4>
							<div className="grid gap-3 md:grid-cols-2">
								<div className="rounded-lg border p-4">
									<div className="mb-2 flex items-center justify-between">
										<p className="text-sm font-medium">Customer Signature</p>
										{signatures.find(
											(s: any) => s.signature_type === "customer",
										) ? (
											<Badge variant="default">
												<CheckCircle className="mr-1 h-3 w-3" /> Signed
											</Badge>
										) : (
											<Badge variant="secondary">Pending</Badge>
										)}
									</div>
									{signatures.find(
										(s: any) => s.signature_type === "customer",
									) && (
										<p className="text-muted-foreground text-xs">
											Signed{" "}
											{formatDate(
												signatures.find(
													(s: any) => s.signature_type === "customer",
												).signed_at,
											)}
										</p>
									)}
								</div>

								<div className="rounded-lg border p-4">
									<div className="mb-2 flex items-center justify-between">
										<p className="text-sm font-medium">Technician Signature</p>
										{signatures.find(
											(s: any) => s.signature_type === "technician",
										) ? (
											<Badge variant="default">
												<CheckCircle className="mr-1 h-3 w-3" /> Signed
											</Badge>
										) : (
											<Badge variant="secondary">Pending</Badge>
										)}
									</div>
									{signatures.find(
										(s: any) => s.signature_type === "technician",
									) && (
										<p className="text-muted-foreground text-xs">
											Signed{" "}
											{formatDate(
												signatures.find(
													(s: any) => s.signature_type === "technician",
												).signed_at,
											)}
										</p>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</UnifiedAccordionContent>
		),
	});

	sections.push({
		id: "tasks",
		title: "Job Tasks & Checklist",
		icon: <CheckCircle className="size-4" />,
		count: tasks.length,
		actions: (
			<div className="flex items-center gap-2">
				<Button
					onClick={() => setIsAddTaskDialogOpen(true)}
					size="sm"
					variant="outline"
				>
					<Plus className="mr-2 h-4 w-4" /> Add Task
				</Button>
				<Button
					onClick={() => setIsLoadTemplateDialogOpen(true)}
					size="sm"
					variant="outline"
				>
					Load Template
				</Button>
			</div>
		),
		content: (
			<UnifiedAccordionContent className="overflow-x-auto p-0 sm:p-0">
				<JobTasksTable tasks={tasks} />
			</UnifiedAccordionContent>
		),
	});

	sections.push({
		id: "notes",
		title: "Notes",
		icon: <StickyNote className="size-4" />,
		count: jobNotes.length,
		actions: (
			<Button
				onClick={() => setIsAddNoteDialogOpen(true)}
				size="sm"
				variant="outline"
			>
				<Plus className="mr-2 h-4 w-4" /> Add Note
			</Button>
		),
		content: (
			<UnifiedAccordionContent className="overflow-x-auto p-0 sm:p-0">
				<JobNotesTable notes={jobNotes} />
			</UnifiedAccordionContent>
		),
	});

	sections.push({
		id: "activity",
		title: "Activity & Communications",
		icon: <Activity className="size-4" />,
		count: activities.length + communications.length,
		actions: (
			<Button
				onClick={() => {
					// Navigate to messages page - if customer is attached, their communications will auto-load
					const baseUrl = "/dashboard/communication/messages";
					const url = customer?.id
						? `${baseUrl}?customerId=${customer.id}`
						: baseUrl;
					router.push(url);
				}}
				size="sm"
				variant="outline"
			>
				<Plus className="mr-2 h-4 w-4" /> Add Communication
			</Button>
		),
		content: (
			<UnifiedAccordionContent className="p-0">
				<JobActivityTimeline activities={[...activities, ...communications]} />
			</UnifiedAccordionContent>
		),
	});

	const relatedItems = [] as Array<{
		id: string;
		type: string;
		title: string;
		subtitle?: string;
		href: string;
		badge?: {
			label: string;
			variant?: "default" | "secondary" | "destructive" | "outline";
		};
	}>;

	if (customer) {
		relatedItems.push({
			id: `customer-${customer.id}`,
			type: "customer",
			title: `${customer.first_name} ${customer.last_name}`,
			subtitle: customer.email || customer.phone || undefined,
			href: `/dashboard/customers/${customer.id}`,
		});
	}

	if (property) {
		relatedItems.push({
			id: `property-${property.id}`,
			type: "property",
			title: property.name || property.address,
			subtitle: `${property.city || ""}, ${property.state || ""}`,
			href: `/dashboard/work/properties/${property.id}`,
		});
	}

	if (assignedUser) {
		relatedItems.push({
			id: `technician-${assignedUser.id}`,
			type: "team",
			title: assignedUser.name,
			subtitle: assignedUser.email || assignedUser.phone || undefined,
			href: assignedUser.id
				? `/dashboard/settings/team/${assignedUser.id}`
				: "/dashboard/settings/team",
		});
	}

	return jobRecord ? (
		<>
			<DetailPageContentLayout
				activities={activities}
				beforeContent={beforeContent}
				customSections={sections}
				enableReordering={true}
				header={headerConfig}
				notes={jobNotes}
				relatedItems={relatedItems}
				showStandardSections={{
					activities: false,
					notes: false,
					attachments: false,
				}}
				storageKey="job-details"
			/>

			<Dialog
				onOpenChange={setIsCreatePropertyDialogOpen}
				open={isCreatePropertyDialogOpen}
			>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Create New Property</DialogTitle>
						<DialogDescription>
							Add a new property for {customer?.first_name}{" "}
							{customer?.last_name}
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<StandardFormField label="Property Name" htmlFor="property-name">
							<Input
								id="property-name"
								onChange={(e) =>
									setNewProperty({ ...newProperty, name: e.target.value })
								}
								placeholder="Main Residence"
								value={newProperty.name}
							/>
						</StandardFormField>

						<StandardFormField
							label="Address"
							htmlFor="property-address"
							required
						>
							<Input
								id="property-address"
								onChange={(e) =>
									setNewProperty({ ...newProperty, address: e.target.value })
								}
								placeholder="123 Main St"
								value={newProperty.address}
							/>
						</StandardFormField>

						<StandardFormField
							label="Address Line 2"
							htmlFor="property-address2"
						>
							<Input
								id="property-address2"
								onChange={(e) =>
									setNewProperty({ ...newProperty, address2: e.target.value })
								}
								placeholder="Apt 4B"
								value={newProperty.address2}
							/>
						</StandardFormField>

						<StandardFormRow cols={2}>
							<StandardFormField label="City" htmlFor="property-city" required>
								<Input
									id="property-city"
									onChange={(e) =>
										setNewProperty({ ...newProperty, city: e.target.value })
									}
									placeholder="New York"
									value={newProperty.city}
								/>
							</StandardFormField>

							<StandardFormField
								label="State"
								htmlFor="property-state"
								required
							>
								<Input
									id="property-state"
									onChange={(e) =>
										setNewProperty({ ...newProperty, state: e.target.value })
									}
									placeholder="NY"
									value={newProperty.state}
								/>
							</StandardFormField>
						</StandardFormRow>

						<StandardFormField label="ZIP Code" htmlFor="property-zip" required>
							<Input
								id="property-zip"
								onChange={(e) =>
									setNewProperty({ ...newProperty, zipCode: e.target.value })
								}
								placeholder="10001"
								value={newProperty.zipCode}
							/>
						</StandardFormField>
					</div>

					<DialogFooter>
						<Button
							disabled={isCreatingProperty}
							onClick={() => setIsCreatePropertyDialogOpen(false)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={
								isCreatingProperty ||
								!newProperty.address ||
								!newProperty.city ||
								!newProperty.state ||
								!newProperty.zipCode
							}
							onClick={handleCreateProperty}
						>
							{isCreatingProperty ? "Creating..." : "Create Property"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{customer?.email && (
				<EmailDialog
					companyId={job.company_id}
					customerEmail={customer.email}
					customerId={customer.id}
					customerName={`${customer.first_name} ${customer.last_name}`}
					jobId={job.id}
					onOpenChange={setIsEmailDialogOpen}
					open={isEmailDialogOpen}
					propertyId={property?.id}
				/>
			)}

			{customer?.phone && (
				<SMSDialog
					companyId={job.company_id}
					companyPhones={companyPhones}
					customerId={customer.id}
					customerName={`${customer.first_name} ${customer.last_name}`}
					customerPhone={customer.phone}
					jobId={job.id}
					onOpenChange={setIsSMSDialogOpen}
					open={isSMSDialogOpen}
					propertyId={property?.id}
				/>
			)}

			<Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Archive Job</DialogTitle>
						<DialogDescription>
							Archiving removes this job from active workflows. You can restore
							it from the archive within 90 days.
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

			<AlertDialog
				onOpenChange={setIsRemoveCustomerDialogOpen}
				open={isRemoveCustomerDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remove Customer and Property?</AlertDialogTitle>
						<AlertDialogDescription>
							This will clear the customer and property fields from this job.
							This action can be undone by reassigning a customer and property.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={async () => {
								try {
									const formData = new FormData();
									formData.append("customer_id", "");
									formData.append("property_id", "");

									const result = await updateJob(job.id, formData);
									if (result.success) {
										toast.success("Customer and property removed");
										// Server Action handles revalidation automatically
									} else {
										toast.error(
											result.error || "Failed to remove customer and property",
										);
									}
								} catch {
									toast.error("Failed to remove customer and property");
								}
							}}
						>
							Remove
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{metrics && (
				<JobStatisticsSheet
					invoices={invoices}
					job={job}
					jobMaterials={jobMaterials}
					metrics={metrics}
					onOpenChange={setIsStatisticsOpen}
					open={isStatisticsOpen}
					payments={payments}
					teamAssignments={teamAssignments}
					timeEntries={timeEntries}
					onUpdateCosting={handleUpdateCosting}
				/>
			)}

			{/* Add Task Dialog */}
			<Dialog onOpenChange={setIsAddTaskDialogOpen} open={isAddTaskDialogOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Add Task</DialogTitle>
						<DialogDescription>
							Create a new task or checklist item for this job.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<StandardFormField label="Title" htmlFor="task-title" required>
							<Input
								id="task-title"
								onChange={(e) => setNewTaskTitle(e.target.value)}
								placeholder="Enter task title..."
								value={newTaskTitle}
							/>
						</StandardFormField>

						<StandardFormField
							label="Description"
							htmlFor="task-description"
							description="Optional"
						>
							<Textarea
								id="task-description"
								onChange={(e) => setNewTaskDescription(e.target.value)}
								placeholder="Enter task description..."
								value={newTaskDescription}
								className="min-h-[80px]"
							/>
						</StandardFormField>
					</div>
					<DialogFooter>
						<Button
							disabled={isCreatingTask}
							onClick={() => {
								setNewTaskTitle("");
								setNewTaskDescription("");
								setIsAddTaskDialogOpen(false);
							}}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={isCreatingTask || !newTaskTitle.trim()}
							onClick={async () => {
								if (!newTaskTitle.trim()) return;

								setIsCreatingTask(true);

								// Optimistic update - add task to UI immediately
								const newTask = {
									id: `temp-${Date.now()}`,
									job_id: job.id,
									title: newTaskTitle.trim(),
									description: newTaskDescription.trim() || null,
									is_completed: false,
									is_required: false,
									created_at: new Date().toISOString(),
									updated_at: new Date().toISOString(),
								};

								setTasks([...tasks, newTask]);
								setNewTaskTitle("");
								setNewTaskDescription("");
								setIsAddTaskDialogOpen(false);

								try {
									const supabase = createClient();
									const { data, error } = await supabase
										.from("job_tasks")
										.insert({
											job_id: job.id,
											title: newTask.title,
											description: newTask.description,
											is_completed: false,
											is_required: false,
										})
										.select()
										.single();

									if (error) {
										// Rollback optimistic update
										setTasks(tasks);
										toast.error("Failed to create task");
									} else {
										// Replace temp item with real data
										setTasks((prev) =>
											prev.map((t) => (t.id === newTask.id ? data : t)),
										);
										toast.success("Task created successfully");
									}
								} catch {
									// Rollback optimistic update
									setTasks(tasks);
									toast.error("Failed to create task");
								} finally {
									setIsCreatingTask(false);
								}
							}}
						>
							{isCreatingTask ? "Creating..." : "Create Task"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Add Note Dialog */}
			<Dialog onOpenChange={setIsAddNoteDialogOpen} open={isAddNoteDialogOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Add Note</DialogTitle>
						<DialogDescription>
							Add a note or comment for this job.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<StandardFormField
							label="Note Content"
							htmlFor="note-content"
							required
						>
							<Textarea
								id="note-content"
								onChange={(e) => setNewNoteContent(e.target.value)}
								placeholder="Enter note content..."
								value={newNoteContent}
								className="min-h-[120px]"
							/>
						</StandardFormField>
					</div>
					<DialogFooter>
						<Button
							disabled={isCreatingNote}
							onClick={() => {
								setNewNoteContent("");
								setIsAddNoteDialogOpen(false);
							}}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={isCreatingNote || !newNoteContent.trim()}
							onClick={async () => {
								if (!newNoteContent.trim()) return;

								setIsCreatingNote(true);

								// Get user first for optimistic update
								const supabase = createClient();
								const {
									data: { user },
								} = await supabase.auth.getUser();

								// Optimistic update - add note to UI immediately
								const newNote = {
									id: `temp-${Date.now()}`,
									job_id: job.id,
									content: newNoteContent.trim(),
									note_type: "general",
									is_important: false,
									created_by: user?.id || null,
									created_by_name: user?.email || "Unknown",
									created_at: new Date().toISOString(),
								};

								setJobNotes([...jobNotes, newNote]);
								setNewNoteContent("");
								setIsAddNoteDialogOpen(false);

								try {
									const { data, error } = await supabase
										.from("job_notes")
										.insert({
											job_id: job.id,
											content: newNote.content,
											note_type: "general",
											is_important: false,
											created_by: user?.id || null,
										})
										.select()
										.single();

									if (error) {
										// Rollback optimistic update
										setJobNotes(jobNotes);
										toast.error("Failed to create note");
									} else {
										// Replace temp item with real data
										setJobNotes((prev) =>
											prev.map((n) => (n.id === newNote.id ? data : n)),
										);
										toast.success("Note created successfully");
									}
								} catch {
									// Rollback optimistic update
									setJobNotes(jobNotes);
									toast.error("Failed to create note");
								} finally {
									setIsCreatingNote(false);
								}
							}}
						>
							{isCreatingNote ? "Creating..." : "Create Note"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Load Template Dialog */}
			<Dialog
				onOpenChange={setIsLoadTemplateDialogOpen}
				open={isLoadTemplateDialogOpen}
			>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Load Task Template</DialogTitle>
						<DialogDescription>
							Select a task template to apply to this job. This feature will be
							available soon.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
							Task templates feature is coming soon. You'll be able to save and
							load predefined task checklists for different job types.
						</div>
					</div>
					<DialogFooter>
						<Button
							onClick={() => setIsLoadTemplateDialogOpen(false)}
							variant="outline"
						>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Link Existing Estimate Dialog */}
			<Dialog onOpenChange={setIsLinkEstimateOpen} open={isLinkEstimateOpen}>
				<DialogContent className="sm:max-w-[700px]">
					<DialogHeader>
						<DialogTitle>Link Existing Estimate</DialogTitle>
						<DialogDescription>
							Search and select an estimate to link to this job. Only unlinked
							estimates are shown.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="relative">
							<Input
								placeholder="Search by estimate number, customer, or status..."
								value={estimateSearchQuery}
								onChange={(e) => setEstimateSearchQuery(e.target.value)}
								className="pl-10"
							/>
							<FileText className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
						</div>
						<div className="border rounded-lg max-h-[400px] overflow-y-auto">
							{availableEstimates.filter((estimate) => {
								if (!estimateSearchQuery) return true;
								const query = estimateSearchQuery.toLowerCase();
								return (
									estimate.estimate_number.toLowerCase().includes(query) ||
									estimate.status.toLowerCase().includes(query) ||
									estimate.customer?.name?.toLowerCase().includes(query)
								);
							}).length === 0 ? (
								<div className="flex flex-col items-center justify-center py-12 text-center">
									<FileText className="h-12 w-12 text-muted-foreground/50 mb-3" />
									<p className="text-sm text-muted-foreground">
										No estimates found
									</p>
									<p className="text-xs text-muted-foreground">
										Try adjusting your search
									</p>
								</div>
							) : (
								<div className="divide-y">
									{availableEstimates
										.filter((estimate) => {
											if (!estimateSearchQuery) return true;
											const query = estimateSearchQuery.toLowerCase();
											return (
												estimate.estimate_number
													.toLowerCase()
													.includes(query) ||
												estimate.status.toLowerCase().includes(query) ||
												estimate.customer?.name?.toLowerCase().includes(query)
											);
										})
										.map((estimate) => (
											<button
												key={estimate.id}
												onClick={async () => {
													setIsLinking(true);

													// Optimistic update - add estimate to UI immediately
													const linkedEstimate = {
														...estimate,
														job_id: job.id,
													};
													setEstimates([...estimates, linkedEstimate]);
													setIsLinkEstimateOpen(false);
													setEstimateSearchQuery("");

													try {
														const supabase = createClient();
														const { error } = await supabase
															.from("estimates")
															.update({ job_id: job.id })
															.eq("id", estimate.id);

														if (error) {
															// Rollback optimistic update
															setEstimates(estimates);
															toast.error("Failed to link estimate");
														} else {
															toast.success("Estimate linked successfully");
														}
													} catch {
														// Rollback optimistic update
														setEstimates(estimates);
														toast.error("Failed to link estimate");
													} finally {
														setIsLinking(false);
													}
												}}
												disabled={isLinking}
												className="w-full px-4 py-3 hover:bg-accent transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
											>
												<div className="flex items-center justify-between gap-4">
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-1">
															<span className="font-semibold text-sm">
																{estimate.estimate_number}
															</span>
															<Badge variant="outline" className="text-xs">
																{estimate.status}
															</Badge>
														</div>
														<div className="flex items-center gap-2 text-xs text-muted-foreground">
															<User className="h-3 w-3" />
															<span className="truncate">
																{estimate.customer?.name || "No customer"}
															</span>
														</div>
													</div>
													<div className="text-right">
														<div className="font-semibold text-sm">
															${(estimate.total_amount / 100).toFixed(2)}
														</div>
														<div className="text-xs text-muted-foreground">
															{new Date(
																estimate.created_at,
															).toLocaleDateString()}
														</div>
													</div>
												</div>
											</button>
										))}
								</div>
							)}
						</div>
					</div>
					<DialogFooter>
						<Button
							onClick={() => {
								setIsLinkEstimateOpen(false);
								setEstimateSearchQuery("");
							}}
							variant="outline"
							disabled={isLinking}
						>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Link Existing Invoice Dialog */}
			<Dialog onOpenChange={setIsLinkInvoiceOpen} open={isLinkInvoiceOpen}>
				<DialogContent className="sm:max-w-[700px]">
					<DialogHeader>
						<DialogTitle>Link Existing Invoice</DialogTitle>
						<DialogDescription>
							Search and select an invoice to link to this job. Only unlinked
							invoices are shown.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="relative">
							<Input
								placeholder="Search by invoice number, customer, or status..."
								value={invoiceSearchQuery}
								onChange={(e) => setInvoiceSearchQuery(e.target.value)}
								className="pl-10"
							/>
							<FileText className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
						</div>
						<div className="border rounded-lg max-h-[400px] overflow-y-auto">
							{availableInvoices.filter((invoice) => {
								if (!invoiceSearchQuery) return true;
								const query = invoiceSearchQuery.toLowerCase();
								return (
									invoice.invoice_number.toLowerCase().includes(query) ||
									invoice.status.toLowerCase().includes(query) ||
									invoice.customer?.name?.toLowerCase().includes(query)
								);
							}).length === 0 ? (
								<div className="flex flex-col items-center justify-center py-12 text-center">
									<FileText className="h-12 w-12 text-muted-foreground/50 mb-3" />
									<p className="text-sm text-muted-foreground">
										No invoices found
									</p>
									<p className="text-xs text-muted-foreground">
										Try adjusting your search
									</p>
								</div>
							) : (
								<div className="divide-y">
									{availableInvoices
										.filter((invoice) => {
											if (!invoiceSearchQuery) return true;
											const query = invoiceSearchQuery.toLowerCase();
											return (
												invoice.invoice_number.toLowerCase().includes(query) ||
												invoice.status.toLowerCase().includes(query) ||
												invoice.customer?.name?.toLowerCase().includes(query)
											);
										})
										.map((invoice) => (
											<button
												key={invoice.id}
												onClick={async () => {
													setIsLinking(true);

													// Optimistic update - add invoice to UI immediately
													const linkedInvoice = { ...invoice, job_id: job.id };
													setInvoices([...invoices, linkedInvoice]);
													setIsLinkInvoiceOpen(false);
													setInvoiceSearchQuery("");

													try {
														const supabase = createClient();
														const { error } = await supabase
															.from("invoices")
															.update({ job_id: job.id })
															.eq("id", invoice.id);

														if (error) {
															// Rollback optimistic update
															setInvoices(invoices);
															toast.error("Failed to link invoice");
														} else {
															toast.success("Invoice linked successfully");
														}
													} catch {
														// Rollback optimistic update
														setInvoices(invoices);
														toast.error("Failed to link invoice");
													} finally {
														setIsLinking(false);
													}
												}}
												disabled={isLinking}
												className="w-full px-4 py-3 hover:bg-accent transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
											>
												<div className="flex items-center justify-between gap-4">
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-1">
															<span className="font-semibold text-sm">
																{invoice.invoice_number}
															</span>
															<Badge variant="outline" className="text-xs">
																{invoice.status}
															</Badge>
														</div>
														<div className="flex items-center gap-2 text-xs text-muted-foreground">
															<User className="h-3 w-3" />
															<span className="truncate">
																{invoice.customer?.name || "No customer"}
															</span>
														</div>
													</div>
													<div className="text-right">
														<div className="font-semibold text-sm">
															${(invoice.total_amount / 100).toFixed(2)}
														</div>
														<div className="text-xs text-muted-foreground">
															{new Date(
																invoice.created_at,
															).toLocaleDateString()}
														</div>
													</div>
												</div>
											</button>
										))}
								</div>
							)}
						</div>
					</div>
					<DialogFooter>
						<Button
							onClick={() => {
								setIsLinkInvoiceOpen(false);
								setInvoiceSearchQuery("");
							}}
							variant="outline"
							disabled={isLinking}
						>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Link Existing Payment Dialog */}
			<Dialog onOpenChange={setIsLinkPaymentOpen} open={isLinkPaymentOpen}>
				<DialogContent className="sm:max-w-[700px]">
					<DialogHeader>
						<DialogTitle>Link Existing Payment</DialogTitle>
						<DialogDescription>
							Search and select a payment to link to this job. Only unlinked
							payments are shown.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="relative">
							<Input
								placeholder="Search by reference, payment method, or customer..."
								value={paymentSearchQuery}
								onChange={(e) => setPaymentSearchQuery(e.target.value)}
								className="pl-10"
							/>
							<DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
						</div>
						<div className="border rounded-lg max-h-[400px] overflow-y-auto">
							{availablePayments.filter((payment) => {
								if (!paymentSearchQuery) return true;
								const query = paymentSearchQuery.toLowerCase();
								return (
									payment.payment_method.toLowerCase().includes(query) ||
									payment.reference_number?.toLowerCase().includes(query) ||
									payment.customer?.name?.toLowerCase().includes(query)
								);
							}).length === 0 ? (
								<div className="flex flex-col items-center justify-center py-12 text-center">
									<DollarSign className="h-12 w-12 text-muted-foreground/50 mb-3" />
									<p className="text-sm text-muted-foreground">
										No payments found
									</p>
									<p className="text-xs text-muted-foreground">
										Try adjusting your search
									</p>
								</div>
							) : (
								<div className="divide-y">
									{availablePayments
										.filter((payment) => {
											if (!paymentSearchQuery) return true;
											const query = paymentSearchQuery.toLowerCase();
											return (
												payment.payment_method.toLowerCase().includes(query) ||
												payment.reference_number
													?.toLowerCase()
													.includes(query) ||
												payment.customer?.name?.toLowerCase().includes(query)
											);
										})
										.map((payment) => (
											<button
												key={payment.id}
												onClick={async () => {
													setIsLinking(true);

													// Optimistic update - add payment to UI immediately
													const linkedPayment = { ...payment, job_id: job.id };
													setPayments([...payments, linkedPayment]);
													setIsLinkPaymentOpen(false);
													setPaymentSearchQuery("");

													try {
														const supabase = createClient();
														const { error } = await supabase
															.from("payments")
															.update({ job_id: job.id })
															.eq("id", payment.id);

														if (error) {
															// Rollback optimistic update
															setPayments(payments);
															toast.error("Failed to link payment");
														} else {
															toast.success("Payment linked successfully");
														}
													} catch {
														// Rollback optimistic update
														setPayments(payments);
														toast.error("Failed to link payment");
													} finally {
														setIsLinking(false);
													}
												}}
												disabled={isLinking}
												className="w-full px-4 py-3 hover:bg-accent transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
											>
												<div className="flex items-center justify-between gap-4">
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-1">
															<span className="font-semibold text-sm">
																{payment.reference_number || "No reference"}
															</span>
															<Badge variant="outline" className="text-xs">
																{payment.payment_method}
															</Badge>
														</div>
														<div className="flex items-center gap-2 text-xs text-muted-foreground">
															<User className="h-3 w-3" />
															<span className="truncate">
																{payment.customer?.name || "No customer"}
															</span>
														</div>
													</div>
													<div className="text-right">
														<div className="font-semibold text-sm">
															${(payment.amount / 100).toFixed(2)}
														</div>
														<div className="text-xs text-muted-foreground">
															{new Date(
																payment.created_at,
															).toLocaleDateString()}
														</div>
													</div>
												</div>
											</button>
										))}
								</div>
							)}
						</div>
					</div>
					<DialogFooter>
						<Button
							onClick={() => {
								setIsLinkPaymentOpen(false);
								setPaymentSearchQuery("");
							}}
							variant="outline"
							disabled={isLinking}
						>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Link Existing Equipment Dialog */}
			<Dialog onOpenChange={setIsLinkEquipmentOpen} open={isLinkEquipmentOpen}>
				<DialogContent className="sm:max-w-[700px]">
					<DialogHeader>
						<DialogTitle>Link Existing Equipment</DialogTitle>
						<DialogDescription>
							Search and link existing equipment to this job. Select equipment
							from the list below.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="relative">
							<Input
								placeholder="Search by equipment name, category, or serial number..."
								value={equipmentSearchQuery}
								onChange={(e) => setEquipmentSearchQuery(e.target.value)}
								className="pl-10"
							/>
							<Wrench className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
						</div>
						<div className="border rounded-lg max-h-[400px] overflow-y-auto">
							{availableEquipment.filter((equipment) => {
								if (!equipmentSearchQuery) return true;
								const query = equipmentSearchQuery.toLowerCase();
								return (
									equipment.name.toLowerCase().includes(query) ||
									equipment.category?.toLowerCase().includes(query) ||
									equipment.serial_number?.toLowerCase().includes(query)
								);
							}).length === 0 ? (
								<div className="flex flex-col items-center justify-center py-12 text-center">
									<Wrench className="h-12 w-12 text-muted-foreground/50 mb-4" />
									<p className="text-sm text-muted-foreground mb-2">
										No equipment found
									</p>
									<p className="text-xs text-muted-foreground">
										Try adjusting your search terms or create new equipment from
										the inventory section.
									</p>
								</div>
							) : (
								availableEquipment
									.filter((equipment) => {
										if (!equipmentSearchQuery) return true;
										const query = equipmentSearchQuery.toLowerCase();
										return (
											equipment.name.toLowerCase().includes(query) ||
											equipment.category?.toLowerCase().includes(query) ||
											equipment.serial_number?.toLowerCase().includes(query)
										);
									})
									.map((equipment, index, filteredArray) => (
										<div key={equipment.id}>
											<button
												onClick={async () => {
													setIsLinking(true);

													// Optimistic update - add equipment to UI immediately
													const newJobEquipment = {
														id: `temp-${Date.now()}`,
														company_id: job.company_id,
														job_id: job.id,
														equipment_id: equipment.id,
														equipment: equipment,
														service_type: null,
														service_description: null,
														hours_spent: null,
														parts_cost: null,
														labor_cost: null,
														created_at: new Date().toISOString(),
														updated_at: new Date().toISOString(),
													};

													setJobEquipment([...jobEquipment, newJobEquipment]);
													setIsLinkEquipmentOpen(false);
													setEquipmentSearchQuery("");

													try {
														const supabase = createClient();
														// Check if equipment is already linked
														const { data: existing } = await supabase
															.from("job_equipment")
															.select("id")
															.eq("job_id", job.id)
															.eq("equipment_id", equipment.id)
															.single();

														if (existing) {
															// Rollback optimistic update
															setJobEquipment(jobEquipment);
															toast.error(
																"Equipment is already linked to this job",
															);
															setIsLinking(false);
															return;
														}

														// Create junction table entry
														const { data, error } = await supabase
															.from("job_equipment")
															.insert({
																company_id: job.company_id,
																job_id: job.id,
																equipment_id: equipment.id,
															})
															.select("*, equipment:equipment_id(*)")
															.single();

														if (error) {
															// Rollback optimistic update
															setJobEquipment(jobEquipment);
															toast.error("Failed to link equipment");
														} else {
															// Replace temp item with real data
															setJobEquipment((prev) =>
																prev.map((je) =>
																	je.id === newJobEquipment.id ? data : je,
																),
															);
															toast.success("Equipment linked successfully");
														}
													} catch {
														// Rollback optimistic update
														setJobEquipment(jobEquipment);
														toast.error("Failed to link equipment");
													} finally {
														setIsLinking(false);
													}
												}}
												disabled={isLinking}
												className="w-full px-4 py-3 hover:bg-accent transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
											>
												<div className="flex items-center justify-between gap-4">
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-1">
															<span className="font-semibold text-sm truncate">
																{equipment.name}
															</span>
															{equipment.category && (
																<Badge
																	variant="outline"
																	className="text-xs shrink-0"
																>
																	{equipment.category}
																</Badge>
															)}
														</div>
														{equipment.serial_number && (
															<div className="flex items-center gap-2 text-xs text-muted-foreground">
																<Wrench className="h-3 w-3" />
																<span className="truncate">
																	SN: {equipment.serial_number}
																</span>
															</div>
														)}
													</div>
													<div className="text-right shrink-0">
														<div className="text-xs text-muted-foreground">
															{new Date(
																equipment.created_at,
															).toLocaleDateString()}
														</div>
													</div>
												</div>
											</button>
											{index < filteredArray.length - 1 && (
												<div className="border-b" />
											)}
										</div>
									))
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	) : (
		<div className="flex h-full w-full items-center justify-center">
			<div className="text-center">
				<p className="text-muted-foreground">Job not found</p>
			</div>
		</div>
	);
}
