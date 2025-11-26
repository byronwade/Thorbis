"use client";

/**
 * Property Page Content - Comprehensive Single Page View
 * All details visible with collapsible sections - matches Job Details pattern
 *
 * Features:
 * - Property Details (editable)
 * - Job History
 * - Equipment
 * - Schedules
 * - Customer Information
 * - Activity Log
 * - Notes
 * - Attachments
 */

import {
	AlertCircle,
	Briefcase,
	Building2,
	Calendar,
	Clock,
	DollarSign,
	FileText,
	Home,
	Info,
	Mail,
	MapPin,
	MessageSquare,
	Navigation,
	Paperclip,
	Phone,
	Receipt,
	Ruler,
	Settings,
	ShieldCheck,
	User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updateEntityTags } from "@/actions/entity-tags";
import { _updateProperty as updateProperty } from "@/actions/properties";
import {
	DetailPageContentLayout,
	type DetailPageHeaderConfig,
} from "@/components/layout/detail-page-content-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	UnifiedAccordionContent,
	type UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";
import { EntityTags } from "@/components/work/entity-tags";
import { TravelTime } from "@/components/work/job-details/travel-time";
import { PropertyLocationVisual } from "@/components/work/job-details/widgets/property-location-visual";
import { useToast } from "@/hooks/use-toast";
import { PropertyEquipmentTable } from "./property-equipment-table";
import { PropertyJobsTable } from "./property-jobs-table";

type PropertyPageContentProps = {
	entityData: {
		property: any;
		customer: any;
		jobs: any[];
		equipment: any[];
		schedules: any[];
		estimates: any[]; // NEW
		invoices: any[]; // NEW
		maintenancePlans: any[]; // NEW
		communications: any[];
		activities: any[];
		notes: any[];
		attachments: any[];
	};
	metrics: {
		totalJobs: number;
		activeJobs: number;
		totalRevenue: number;
		lastServiceDate: string | null;
		nextScheduledDate: string | null;
		equipmentCount: number;
	};
};

export function PropertyPageContent({
	entityData,
	metrics,
}: PropertyPageContentProps) {
	const propertyData = entityData;
	const router = useRouter();
	const { toast } = useToast();
	const [_mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const {
		property,
		customer,
		jobs = [],
		equipment = [],
		schedules = [],
		estimates = [], // NEW
		invoices = [], // NEW
		maintenancePlans = [], // NEW
		communications = [],
		activities = [],
		notes = [],
		attachments = [],
	} = propertyData;

	// Get initials for avatar
	const _getInitials = (name: string) =>
		name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();

	// Format currency
	const formatCurrency = (cents: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(cents / 100);

	// Save handlers for inline editing
	const _handleSaveField = async (field: string, newValue: string) => {
		const formData = new FormData();
		formData.append(field, newValue);

		const result = await updateProperty(property.id, formData);
		if (result.success) {
			toast.success(`${field.replace(/_/g, " ")} updated successfully`);
			// Server Action handles revalidation automatically
			return true;
		}
		toast.error(result.error || `Failed to update ${field}`);
		return false;
	};

	// Metadata items for quick-glance data - ALL property fields with inline editing
	const metadataItems: DetailPageHeaderConfig["metadata"] = [
		{
			label: "Property Name",
			icon: <Home className="h-3.5 w-3.5" />,
			value: property.name || "Unnamed Property",
		},
		{
			label: "Address",
			icon: <MapPin className="h-3.5 w-3.5" />,
			value: property.address,
			helperText: `${property.city}, ${property.state} ${property.zip_code}`,
		},
		{
			label: "Property Type",
			icon: <Building2 className="h-3.5 w-3.5" />,
			value: property.property_type || "residential",
		},
		{
			label: "Square Footage",
			icon: <Ruler className="h-3.5 w-3.5" />,
			value: property.square_footage?.toString() || "Not specified",
			helperText: property.square_footage
				? `${property.square_footage.toLocaleString()} sq ft`
				: undefined,
		},
		{
			label: "Year Built",
			icon: <Calendar className="h-3.5 w-3.5" />,
			value: property.year_built?.toString() || "Unknown",
		},
		{
			label: "Best Access Time",
			icon: <Clock className="h-3.5 w-3.5" />,
			value: property.best_access_time || "Anytime",
			helperText: property.requires_appointment
				? "Appointment required"
				: undefined,
		},
		{
			label: "Owner",
			icon: <User className="h-3.5 w-3.5" />,
			value: customer
				? `${customer.first_name} ${customer.last_name}`
				: "Not assigned",
			helperText: customer?.email,
		},
		{
			label: "GPS Coordinates",
			icon: <MapPin className="h-3.5 w-3.5" />,
			value:
				property.lat && property.lon
					? `${property.lat.toFixed(6)}, ${property.lon.toFixed(6)}`
					: "Not set",
			helperText:
				property.lat && property.lon
					? "Geocoded"
					: "Click Location section to geocode",
		},
		{
			label: "Total Jobs",
			icon: <Briefcase className="h-3.5 w-3.5" />,
			value: metrics.totalJobs.toString(),
			helperText: `${metrics.activeJobs} active`,
		},
		{
			label: "Total Revenue",
			icon: <DollarSign className="h-3.5 w-3.5" />,
			value: formatCurrency(metrics.totalRevenue),
			helperText: `from ${metrics.totalJobs} job${metrics.totalJobs !== 1 ? "s" : ""}`,
		},
		{
			label: "Equipment",
			icon: <Settings className="h-3.5 w-3.5" />,
			value: `${metrics.equipmentCount}`,
			helperText:
				metrics.equipmentCount > 0
					? `${metrics.equipmentCount} unit${metrics.equipmentCount !== 1 ? "s" : ""} installed`
					: "No equipment",
		},
		{
			label: "Last Service",
			icon: <Clock className="h-3.5 w-3.5" />,
			value: metrics.lastServiceDate
				? new Date(metrics.lastServiceDate).toLocaleDateString()
				: "Never",
			helperText: metrics.lastServiceDate
				? (() => {
						const diffDays = Math.floor(
							(Date.now() - new Date(metrics.lastServiceDate).getTime()) /
								(1000 * 60 * 60 * 24),
						);
						return diffDays === 0 ? "Today" : `${diffDays} days ago`;
					})()
				: undefined,
		},
	];

	const renderCommunicationEntries = (items: any[]) => (
		<div className="space-y-3">
			{items.slice(0, 25).map((communication) => {
				const contactName =
					communication.customer?.first_name ||
					communication.customer?.last_name
						? `${communication.customer?.first_name ?? ""} ${communication.customer?.last_name ?? ""}`.trim()
						: communication.direction === "inbound"
							? communication.from_address
							: communication.to_address;
				const preview =
					communication.subject ||
					communication.body?.slice(0, 160) ||
					"No additional details";
				const timestamp = new Date(communication.created_at).toLocaleString();

				return (
					<div className="rounded-lg border p-3" key={communication.id}>
						<div className="flex flex-wrap items-center gap-2">
							<Badge variant="outline">
								{communication.type?.toUpperCase()}
							</Badge>
							<Badge
								variant={
									communication.direction === "inbound"
										? "secondary"
										: "default"
								}
							>
								{communication.direction === "inbound" ? "Inbound" : "Outbound"}
							</Badge>
							{communication.status && (
								<Badge variant="outline">{communication.status}</Badge>
							)}
							<span className="text-muted-foreground text-xs">{timestamp}</span>
						</div>
						<div className="mt-2">
							<p className="text-sm font-medium">{contactName || "Contact"}</p>
							<p className="text-muted-foreground text-sm">{preview}</p>
						</div>
					</div>
				);
			})}
		</div>
	);

	const _headerConfig: DetailPageHeaderConfig = {
		title: property.name || property.address,
		subtitle: `${property.city}, ${property.state} ${property.zip_code}`,
		metadata: metadataItems,
		leadingVisual: (
			<div className="bg-primary/10 ring-border flex size-16 items-center justify-center rounded-lg ring-2">
				<Building2 className="text-primary size-8" />
			</div>
		),
	};

	const sections: UnifiedAccordionSection[] = [
		{
			id: "location",
			title: "Location & Maps",
			icon: <MapPin className="size-4" />,
			defaultOpen: true,
			content: (
				<UnifiedAccordionContent>
					<div className="space-y-4">
						<PropertyLocationVisual nearbySuppliers={[]} property={property} />

						{/* Access Instructions */}
						{(property.directions ||
							property.parking_instructions ||
							property.service_entrance_notes) && (
							<div className="space-y-3">
								<h3 className="text-sm font-semibold">Access Information</h3>
								<div className="space-y-2">
									{property.directions && (
										<div className="bg-muted/50 rounded-lg border p-3">
											<div className="mb-1 flex items-center gap-2">
												<Navigation className="text-muted-foreground size-4" />
												<p className="text-sm font-medium">Directions</p>
											</div>
											<p className="text-muted-foreground text-sm">
												{property.directions}
											</p>
										</div>
									)}
									{property.parking_instructions && (
										<div className="bg-muted/50 rounded-lg border p-3">
											<div className="mb-1 flex items-center gap-2">
												<Info className="text-muted-foreground size-4" />
												<p className="text-sm font-medium">
													Parking Instructions
												</p>
											</div>
											<p className="text-muted-foreground text-sm">
												{property.parking_instructions}
											</p>
										</div>
									)}
									{property.service_entrance_notes && (
										<div className="bg-muted/50 rounded-lg border p-3">
											<div className="mb-1 flex items-center gap-2">
												<AlertCircle className="text-muted-foreground size-4" />
												<p className="text-sm font-medium">Service Entrance</p>
											</div>
											<p className="text-muted-foreground text-sm">
												{property.service_entrance_notes}
											</p>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</UnifiedAccordionContent>
			),
		},
		{
			id: "communications",
			title: "Communications",
			icon: <MessageSquare className="size-4" />,
			content: (
				<UnifiedAccordionContent>
					{communications.length === 0 ? (
						<div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center text-sm">
							<MessageSquare className="text-muted-foreground mb-4 size-10" />
							No communications logged for this property yet.
						</div>
					) : (
						renderCommunicationEntries(communications)
					)}
				</UnifiedAccordionContent>
			),
		},
		{
			id: "jobs",
			title: "Job History",
			icon: <Briefcase className="size-4" />,
			count: jobs.length,
			actions: (
				<Button asChild size="sm" variant="outline">
					<Link href={`/dashboard/work/new?propertyId=${property.id}`}>
						<Briefcase className="mr-2 size-4" />
						Create Job
					</Link>
				</Button>
			),
			content:
				jobs.length === 0 ? (
					<UnifiedAccordionContent>
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<Briefcase className="text-muted-foreground mb-4 size-12" />
							<p className="text-muted-foreground text-sm">
								No jobs found for this property
							</p>
							<Button asChild className="mt-4" size="sm">
								<Link href={`/dashboard/work/new?propertyId=${property.id}`}>
									Create First Job
								</Link>
							</Button>
						</div>
					</UnifiedAccordionContent>
				) : (
					<UnifiedAccordionContent className="p-0">
						<PropertyJobsTable jobs={jobs} />
					</UnifiedAccordionContent>
				),
		},
		{
			id: "equipment",
			title: "Equipment",
			icon: <Settings className="size-4" />,
			count: equipment.length,
			actions: (
				<Button asChild size="sm" variant="outline">
					<Link
						href={`/dashboard/work/equipment/new?propertyId=${property.id}`}
					>
						<Settings className="mr-2 size-4" />
						Add Equipment
					</Link>
				</Button>
			),
			content:
				equipment.length === 0 ? (
					<UnifiedAccordionContent>
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<Settings className="text-muted-foreground mb-4 size-12" />
							<p className="text-muted-foreground text-sm">
								No equipment installed at this property
							</p>
							<Button asChild className="mt-4" size="sm" variant="outline">
								<Link
									href={`/dashboard/work/equipment/new?propertyId=${property.id}`}
								>
									Add Equipment
								</Link>
							</Button>
						</div>
					</UnifiedAccordionContent>
				) : (
					<UnifiedAccordionContent className="p-0">
						<PropertyEquipmentTable equipment={equipment} />
					</UnifiedAccordionContent>
				),
		},
		// NEW: Estimates Section
		{
			id: "estimates",
			title: "Estimates",
			icon: <FileText className="size-4" />,
			count: estimates.length,
			content: (
				<UnifiedAccordionContent className="p-0">
					<div className="text-muted-foreground border-b px-6 py-4 text-sm">
						Estimates and quotes for work at this property.
					</div>
					{estimates.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-muted/50 border-b">
									<tr>
										<th className="px-6 py-3 text-left text-sm font-medium">
											Estimate #
										</th>
										<th className="px-6 py-3 text-left text-sm font-medium">
											Title
										</th>
										<th className="px-6 py-3 text-left text-sm font-medium">
											Date
										</th>
										<th className="px-6 py-3 text-left text-sm font-medium">
											Total
										</th>
										<th className="px-6 py-3 text-left text-sm font-medium">
											Status
										</th>
										<th className="px-6 py-3 text-left text-sm font-medium">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{estimates.map((estimate: any) => (
										<tr
											className="hover:bg-muted/30 border-b"
											key={estimate.id}
										>
											<td className="px-6 py-4 text-sm">
												#{estimate.estimate_number || estimate.id.slice(0, 8)}
											</td>
											<td className="px-6 py-4 text-sm">
												{estimate.title || "-"}
											</td>
											<td className="px-6 py-4 text-sm">
												{new Date(estimate.created_at).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 text-sm font-medium">
												{formatCurrency(estimate.total_amount)}
											</td>
											<td className="px-6 py-4 text-sm">
												<Badge variant="outline">{estimate.status}</Badge>
											</td>
											<td className="px-6 py-4 text-sm">
												<Link
													className="text-primary hover:underline"
													href={`/dashboard/work/estimates/${estimate.id}`}
												>
													View
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center p-12 text-center">
							<FileText className="text-muted-foreground h-8 w-8" />
							<p className="text-muted-foreground mt-2 text-sm">
								No estimates for this property yet.
							</p>
						</div>
					)}
				</UnifiedAccordionContent>
			),
		},
		// NEW: Invoices Section
		{
			id: "invoices",
			title: "Invoices",
			icon: <Receipt className="size-4" />,
			count: invoices.length,
			content: (
				<UnifiedAccordionContent className="p-0">
					<div className="text-muted-foreground border-b px-6 py-4 text-sm">
						Billing and invoices for work at this property.
					</div>
					{invoices.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-muted/50 border-b">
									<tr>
										<th className="px-6 py-3 text-left text-sm font-medium">
											Invoice #
										</th>
										<th className="px-6 py-3 text-left text-sm font-medium">
											Title
										</th>
										<th className="px-6 py-3 text-left text-sm font-medium">
											Date
										</th>
										<th className="px-6 py-3 text-left text-sm font-medium">
											Total
										</th>
										<th className="px-6 py-3 text-left text-sm font-medium">
											Balance
										</th>
										<th className="px-6 py-3 text-left text-sm font-medium">
											Status
										</th>
										<th className="px-6 py-3 text-left text-sm font-medium">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{invoices.map((invoice: any) => (
										<tr className="hover:bg-muted/30 border-b" key={invoice.id}>
											<td className="px-6 py-4 text-sm">
												#{invoice.invoice_number || invoice.id.slice(0, 8)}
											</td>
											<td className="px-6 py-4 text-sm">
												{invoice.title || "-"}
											</td>
											<td className="px-6 py-4 text-sm">
												{new Date(invoice.created_at).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 text-sm font-medium">
												{formatCurrency(invoice.total_amount)}
											</td>
											<td className="px-6 py-4 text-sm font-medium">
												{formatCurrency(invoice.balance_amount)}
											</td>
											<td className="px-6 py-4 text-sm">
												<Badge
													variant={
														invoice.status === "paid" ? "default" : "outline"
													}
												>
													{invoice.status}
												</Badge>
											</td>
											<td className="px-6 py-4 text-sm">
												<Link
													className="text-primary hover:underline"
													href={`/dashboard/work/invoices/${invoice.id}`}
												>
													View
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center p-12 text-center">
							<Receipt className="text-muted-foreground h-8 w-8" />
							<p className="text-muted-foreground mt-2 text-sm">
								No invoices for this property yet.
							</p>
						</div>
					)}
				</UnifiedAccordionContent>
			),
		},
		// NEW: Maintenance Plans Section
		{
			id: "maintenance-plans",
			title: "Maintenance Plans",
			icon: <ShieldCheck className="size-4" />,
			count: maintenancePlans.length,
			content: (
				<UnifiedAccordionContent className="p-0">
					<div className="text-muted-foreground border-b px-6 py-4 text-sm">
						Active maintenance plans for this property.
					</div>
					{maintenancePlans.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-muted/50 border-b">
									<tr>
										<th className="px-6 py-3 text-left text-sm font-medium">
											Plan Name
										</th>
										<th className="px-6 py-3 text-left text-sm font-medium">
											Frequency
										</th>
										<th className="px-6 py-3 text-left text-sm font-medium">
											Next Service
										</th>
										<th className="px-6 py-3 text-left text-sm font-medium">
											Status
										</th>
										<th className="px-6 py-3 text-left text-sm font-medium">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{maintenancePlans.map((plan: any) => (
										<tr className="hover:bg-muted/30 border-b" key={plan.id}>
											<td className="px-6 py-4 text-sm font-medium">
												{plan.name || `Plan ${plan.id.slice(0, 8)}`}
											</td>
											<td className="px-6 py-4 text-sm capitalize">
												{plan.frequency || "Monthly"}
											</td>
											<td className="px-6 py-4 text-sm">
												{plan.next_service_date
													? new Date(
															plan.next_service_date,
														).toLocaleDateString()
													: "-"}
											</td>
											<td className="px-6 py-4 text-sm">
												<Badge variant="outline">
													{plan.status || "active"}
												</Badge>
											</td>
											<td className="px-6 py-4 text-sm">
												<Link
													className="text-primary hover:underline"
													href={`/dashboard/work/maintenance-plans/${plan.id}`}
												>
													View
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center p-12 text-center">
							<ShieldCheck className="text-muted-foreground h-8 w-8" />
							<p className="text-muted-foreground mt-2 text-sm">
								No maintenance plans for this property.
							</p>
						</div>
					)}
				</UnifiedAccordionContent>
			),
		},
		{
			id: "notes",
			title: "Notes",
			icon: <FileText className="size-4" />,
			count: notes.length,
			actions: (
				<Button size="sm" variant="outline">
					<FileText className="mr-2 size-4" />
					Add Note
				</Button>
			),
			content: (
				<UnifiedAccordionContent>
					<div className="space-y-4">
						{notes.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<FileText className="text-muted-foreground mb-4 size-12" />
								<p className="text-muted-foreground text-sm">No notes yet</p>
							</div>
						) : (
							<div className="space-y-2">
								{notes.map((note: any, idx: number) => (
									<div className="rounded-lg border p-4" key={idx}>
										<p className="text-sm">{note.content || note.note}</p>
										<div className="mt-2 flex items-center justify-between">
											{note.user && (
												<p className="text-muted-foreground text-xs">
													by {note.user.name || note.user.email}
												</p>
											)}
											<p className="text-muted-foreground text-xs">
												{new Date(note.created_at).toLocaleString()}
											</p>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</UnifiedAccordionContent>
			),
		},
		{
			id: "attachments",
			title: "Attachments",
			icon: <Paperclip className="size-4" />,
			count: attachments.length,
			actions: (
				<Button size="sm" variant="outline">
					<Paperclip className="mr-2 size-4" />
					Upload File
				</Button>
			),
			content: (
				<UnifiedAccordionContent>
					<div className="space-y-4">
						{attachments.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<Paperclip className="text-muted-foreground mb-4 size-12" />
								<p className="text-muted-foreground text-sm">
									No attachments yet
								</p>
							</div>
						) : (
							<div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
								{attachments.map((attachment: any, idx: number) => (
									<div
										className="hover:bg-accent flex items-center gap-3 rounded-lg border p-4"
										key={idx}
									>
										<Paperclip className="text-muted-foreground size-4" />
										<div className="flex-1 overflow-hidden">
											<p className="truncate text-sm font-medium">
												{attachment.filename || "Untitled"}
											</p>
											<p className="text-muted-foreground text-xs">
												{attachment.file_size
													? `${(attachment.file_size / 1024).toFixed(1)} KB`
													: "Unknown size"}
											</p>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</UnifiedAccordionContent>
			),
		},
		{
			id: "customer",
			title: "Customer Information",
			icon: <User className="size-4" />,
			actions: (
				<div className="flex items-center gap-2">
					{customer?.email && (
						<Button asChild size="sm" variant="outline">
							<Link href={`mailto:${customer.email}`}>
								<Mail className="mr-2 size-4" />
								Email Customer
							</Link>
						</Button>
					)}
					{customer?.phone && (
						<Button asChild size="sm" variant="outline">
							<Link href={`tel:${customer.phone}`}>
								<Phone className="mr-2 size-4" />
								Call Customer
							</Link>
						</Button>
					)}
					{customer?.id && (
						<Button asChild size="sm" variant="outline">
							<Link href={`/dashboard/customers/${customer.id}`}>
								<User className="mr-2 size-4" />
								View Full Profile
							</Link>
						</Button>
					)}
				</div>
			),
			content: (
				<UnifiedAccordionContent>
					{customer ? (
						<div className="space-y-4">
							<div className="flex items-start gap-4">
								<div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
									<User className="text-primary size-6" />
								</div>
								<div className="flex-1 space-y-3">
									<div>
										<h3 className="font-semibold text-lg">
											{customer.display_name ||
												`${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
												"Customer"}
										</h3>
										{customer.company_name && (
											<p className="text-muted-foreground text-sm">
												{customer.company_name}
											</p>
										)}
									</div>
									<div className="space-y-2">
										{customer.email && (
											<div className="flex items-center gap-2 text-sm">
												<Mail className="text-muted-foreground size-4 shrink-0" />
												<a
													href={`mailto:${customer.email}`}
													className="text-primary hover:underline"
												>
													{customer.email}
												</a>
											</div>
										)}
										{customer.phone && (
											<div className="flex items-center gap-2 text-sm">
												<Phone className="text-muted-foreground size-4 shrink-0" />
												<a
													href={`tel:${customer.phone}`}
													className="text-primary hover:underline"
												>
													{customer.phone}
												</a>
											</div>
										)}
										{!customer.email && !customer.phone && (
											<p className="text-muted-foreground text-sm italic">
												No contact information available
											</p>
										)}
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center text-sm">
							<User className="text-muted-foreground mb-4 size-10" />
							No customer information available
						</div>
					)}
				</UnifiedAccordionContent>
			),
		},
	];

	// Custom Header with Travel Time
	const propertyTags =
		(property?.metadata?.tags &&
			Array.isArray(property.metadata.tags) &&
			property.metadata.tags) ||
		[];

	const customHeader = (
		<div className="w-full px-2 sm:px-0">
			<div className="bg-muted/50 mx-auto max-w-7xl rounded-md shadow-sm">
				<div className="flex flex-col gap-4 p-4 sm:p-6">
					{/* Property Name and Location */}
					<div className="flex flex-col gap-3">
						<div className="flex items-start justify-between">
							<div className="flex items-center gap-4">
								<div className="bg-primary/10 ring-border flex size-16 items-center justify-center rounded-lg ring-2">
									<Building2 className="text-primary size-8" />
								</div>
								<div>
									<h1 className="text-2xl font-semibold">
										{property.name || property.address}
									</h1>
									<p className="text-muted-foreground text-sm">
										{property.city}, {property.state} {property.zip_code}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Badges */}
					<div className="flex flex-wrap gap-2">
						<Badge className="gap-1.5" variant="secondary">
							<Building2 className="size-3.5" />
							{property.property_type || "Residential"}
						</Badge>
						{property.square_footage && (
							<Badge className="gap-1.5" variant="secondary">
								<Ruler className="size-3.5" />
								{property.square_footage.toLocaleString()} sq ft
							</Badge>
						)}
						{metrics.equipmentCount > 0 && (
							<Badge className="gap-1.5" variant="secondary">
								<Settings className="size-3.5" />
								{metrics.equipmentCount} Equipment
							</Badge>
						)}
						{metrics.activeJobs > 0 && (
							<Badge className="gap-1.5" variant="secondary">
								<Briefcase className="size-3.5" />
								{metrics.activeJobs} Active Jobs
							</Badge>
						)}
					</div>

					{/* Tags */}
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-muted-foreground text-xs font-medium">
							Tags:
						</span>
						<EntityTags
							entityId={property.id}
							entityType="property"
							onUpdateTags={(id, tags) =>
								updateEntityTags("property", id, tags)
							}
							tags={propertyTags}
						/>
					</div>

					{/* Travel Time */}
					{property && (
						<TravelTime
							property={{
								address: property.address ?? undefined,
								city: property.city ?? undefined,
								state: property.state ?? undefined,
								zip_code: property.zip_code ?? undefined,
								lat: property.lat ?? undefined,
								lon: property.lon ?? undefined,
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);

	return (
		<DetailPageContentLayout
			activities={activities}
			attachments={[]}
			customHeader={customHeader}
			customSections={sections}
			defaultOpenSection="location"
			enableReordering={true}
			notes={[]}
			showStandardSections={{
				activities: true,
				notes: false,
				attachments: false,
				relatedItems: false,
			}}
			storageKey="property-details"
		/>
	);
}
