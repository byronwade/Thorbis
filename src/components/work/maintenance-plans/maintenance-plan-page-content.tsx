/**
 * Maintenance Plan Page Content
 *
 * Comprehensive maintenance plan details with collapsible sections
 * Matches job and customer detail page patterns
 */

"use client";

import { Calendar, CheckCircle2, DollarSign, Package, Receipt, User, Wrench } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { DetailPageContentLayout } from "@/components/layout/detail-page-content-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	UnifiedAccordionContent,
	type UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";

export type MaintenancePlanData = {
	plan: any;
	customer?: any;
	property?: any;
	equipment?: any[];
	generatedJobs?: any[]; // NEW
	scheduledAppointments?: any[]; // NEW
	generatedInvoices?: any[]; // NEW
	notes?: any[];
	activities?: any[];
	attachments?: any[];
};

export type MaintenancePlanPageContentProps = {
	entityData: MaintenancePlanData;
};

function formatCurrency(cents: number | null | undefined): string {
	if (cents === null || cents === undefined) {
		return "$0.00";
	}
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(cents / 100);
}

function getStatusBadge(status: string, key?: string) {
	const variants: Record<string, { className: string; label: string }> = {
		draft: {
			className: "bg-muted text-foreground dark:bg-foreground/20 dark:text-muted-foreground",
			label: "Draft",
		},
		active: {
			className: "bg-success text-white",
			label: "Active",
		},
		paused: {
			className: "bg-warning text-white",
			label: "Paused",
		},
		cancelled: {
			className: "bg-destructive text-white",
			label: "Cancelled",
		},
		expired: {
			className: "bg-warning text-white",
			label: "Expired",
		},
		completed: {
			className: "bg-primary text-white",
			label: "Completed",
		},
	};

	const config = variants[status] || {
		className: "bg-muted text-foreground",
		label: status,
	};

	return (
		<Badge className={config.className} key={key} variant="outline">
			{config.label}
		</Badge>
	);
}

export function MaintenancePlanPageContent({ entityData }: MaintenancePlanPageContentProps) {
	const {
		plan,
		customer,
		property,
		equipment = [],
		generatedJobs = [], // NEW
		scheduledAppointments = [], // NEW
		generatedInvoices = [], // NEW
		notes = [],
		activities = [],
		attachments = [],
	} = entityData;

	const includedServices = plan.included_services
		? typeof plan.included_services === "string"
			? JSON.parse(plan.included_services)
			: plan.included_services
		: [];

	const headerBadges = [
		getStatusBadge(plan.status || "draft", "status"),
		<Badge key="type" variant="outline">
			{plan.type || "preventive"}
		</Badge>,
	];

	const customHeader = (
		<div className="w-full px-2 sm:px-0">
			<div className="bg-muted/50 rounded-md shadow-sm">
				<div className="flex flex-col gap-4 p-4 sm:p-6">
					<div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
						<div className="flex flex-col gap-4">
							<div className="flex flex-wrap items-center gap-2">{headerBadges}</div>
							<div className="flex flex-col gap-2">
								<h1 className="text-2xl font-semibold sm:text-3xl">
									{plan.name || `Plan ${plan.plan_number || plan.id.slice(0, 8)}`}
								</h1>
								<p className="text-muted-foreground text-sm sm:text-base">
									{formatCurrency(plan.price)}
								</p>
							</div>
						</div>
					</div>

					{customer && (
						<div className="flex flex-wrap items-center gap-3">
							<Link
								className="border-border/60 bg-background hover:border-primary/50 hover:bg-primary/5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
								href={`/dashboard/customers/${customer.id}`}
							>
								<User className="size-4" />
								{customer.display_name ||
									`${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
									"Unknown Customer"}
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);

	const customSections = useMemo<UnifiedAccordionSection[]>(() => {
		const sections: UnifiedAccordionSection[] = [
			{
				id: "service-schedule",
				title: "Service Schedule",
				icon: <Calendar className="size-4" />,
				defaultOpen: true,
				content: (
					<UnifiedAccordionContent>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label>Frequency</Label>
								<Input readOnly value={plan.frequency || "annually"} />
							</div>
							<div>
								<Label>Visits Per Term</Label>
								<Input readOnly value={plan.visits_per_term || 1} />
							</div>
							<div>
								<Label>Start Date</Label>
								<Input
									readOnly
									value={plan.start_date ? new Date(plan.start_date).toLocaleDateString() : "N/A"}
								/>
							</div>
							{plan.end_date && (
								<div>
									<Label>End Date</Label>
									<Input readOnly value={new Date(plan.end_date).toLocaleDateString()} />
								</div>
							)}
							{plan.next_service_due && (
								<div>
									<Label>Next Service Due</Label>
									<Input readOnly value={new Date(plan.next_service_due).toLocaleDateString()} />
								</div>
							)}
							{plan.last_service_date && (
								<div>
									<Label>Last Service</Label>
									<Input readOnly value={new Date(plan.last_service_date).toLocaleDateString()} />
								</div>
							)}
						</div>
					</UnifiedAccordionContent>
				),
			},
		];

		if (includedServices.length > 0) {
			sections.push({
				id: "included-services",
				title: "Included Services",
				icon: <Wrench className="size-4" />,
				count: includedServices.length,
				content: (
					<UnifiedAccordionContent>
						<div className="space-y-2">
							{includedServices.map((service: any, index: number) => (
								<div className="flex items-center gap-2 rounded-lg border p-3" key={index}>
									<CheckCircle2 className="text-success size-4" />
									<span className="text-sm">{service.name || service.description || service}</span>
								</div>
							))}
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		if (equipment.length > 0) {
			sections.push({
				id: "equipment",
				title: "Equipment",
				icon: <Package className="size-4" />,
				count: equipment.length,
				content: (
					<UnifiedAccordionContent>
						<div className="space-y-2">
							{equipment.map((eq: any) => (
								<div
									className="flex items-center justify-between rounded-lg border p-3"
									key={eq.id}
								>
									<div>
										<p className="text-sm font-medium">{eq.name || eq.equipment_number}</p>
										<p className="text-muted-foreground text-xs">
											{eq.manufacturer} {eq.model}
										</p>
									</div>
									<Button asChild size="sm" variant="ghost">
										<Link href={`/dashboard/work/equipment/${eq.id}`}>View</Link>
									</Button>
								</div>
							))}
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		sections.push({
			id: "billing",
			title: "Billing",
			icon: <DollarSign className="size-4" />,
			content: (
				<UnifiedAccordionContent>
					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<Label>Price</Label>
							<Input readOnly value={formatCurrency(plan.price)} />
						</div>
						<div>
							<Label>Billing Frequency</Label>
							<Input readOnly value={plan.billing_frequency || "annually"} />
						</div>
						<div>
							<Label>Taxable</Label>
							<Input readOnly value={plan.taxable ? "Yes" : "No"} />
						</div>
						{plan.renewal_type && (
							<div>
								<Label>Renewal Type</Label>
								<Input readOnly value={plan.renewal_type} />
							</div>
						)}
					</div>
				</UnifiedAccordionContent>
			),
		});

		if (customer) {
			sections.push({
				id: "customer-details",
				title: "Customer Details",
				icon: <User className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
							<div className="grid flex-1 gap-4 md:grid-cols-2">
								<div>
									<Label>Name</Label>
									<p className="text-sm">
										{customer.display_name ||
											`${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
											"Unknown"}
									</p>
								</div>
								<div>
									<Label>Email</Label>
									<p className="text-sm">{customer.email || "N/A"}</p>
								</div>
							</div>
							<Button asChild size="sm" variant="ghost">
								<Link href={`/dashboard/customers/${customer.id}`}>View Full Profile</Link>
							</Button>
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		// NEW: Generated Jobs Section
		if (generatedJobs.length > 0) {
			sections.push({
				id: "generated-jobs",
				title: "Generated Jobs",
				icon: <Wrench className="size-4" />,
				count: generatedJobs.length,
				content: (
					<UnifiedAccordionContent className="p-0">
						<div className="text-muted-foreground border-b px-6 py-4 text-sm">
							Jobs created from this maintenance plan.
						</div>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-muted/50 border-b">
									<tr>
										<th className="px-6 py-3 text-left text-sm font-medium">Job #</th>
										<th className="px-6 py-3 text-left text-sm font-medium">Title</th>
										<th className="px-6 py-3 text-left text-sm font-medium">Property</th>
										<th className="px-6 py-3 text-left text-sm font-medium">Status</th>
										<th className="px-6 py-3 text-left text-sm font-medium">Completed</th>
										<th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
									</tr>
								</thead>
								<tbody>
									{generatedJobs.map((job: any) => (
										<tr className="hover:bg-muted/30 border-b" key={job.id}>
											<td className="px-6 py-4 text-sm">#{job.job_number}</td>
											<td className="px-6 py-4 text-sm font-medium">{job.title}</td>
											<td className="px-6 py-4 text-sm">
												{job.property?.name || job.property?.address || "-"}
											</td>
											<td className="px-6 py-4 text-sm">
												<Badge variant="outline">{job.status}</Badge>
											</td>
											<td className="px-6 py-4 text-sm">
												{job.completed_at ? new Date(job.completed_at).toLocaleDateString() : "-"}
											</td>
											<td className="px-6 py-4 text-sm">
												<Link
													className="text-primary hover:underline"
													href={`/dashboard/work/${job.id}`}
												>
													View
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		// NEW: Scheduled Appointments Section
		if (scheduledAppointments.length > 0) {
			sections.push({
				id: "scheduled-appointments",
				title: "Upcoming Appointments",
				icon: <Calendar className="size-4" />,
				count: scheduledAppointments.length,
				content: (
					<UnifiedAccordionContent className="p-0">
						<div className="text-muted-foreground border-b px-6 py-4 text-sm">
							Scheduled maintenance appointments for equipment covered by this plan.
						</div>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-muted/50 border-b">
									<tr>
										<th className="px-6 py-3 text-left text-sm font-medium">Date & Time</th>
										<th className="px-6 py-3 text-left text-sm font-medium">Job</th>
										<th className="px-6 py-3 text-left text-sm font-medium">Property</th>
										<th className="px-6 py-3 text-left text-sm font-medium">Status</th>
										<th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
									</tr>
								</thead>
								<tbody>
									{scheduledAppointments.map((appointment: any) => (
										<tr className="hover:bg-muted/30 border-b" key={appointment.id}>
											<td className="px-6 py-4 text-sm">
												{new Date(appointment.scheduled_start).toLocaleString("en-US", {
													month: "short",
													day: "numeric",
													year: "numeric",
													hour: "numeric",
													minute: "2-digit",
												})}
											</td>
											<td className="px-6 py-4 text-sm">
												{appointment.job ? `#${appointment.job.job_number}` : "-"}
											</td>
											<td className="px-6 py-4 text-sm">
												{appointment.property?.name || appointment.property?.address || "-"}
											</td>
											<td className="px-6 py-4 text-sm">
												<Badge variant="outline">{appointment.status}</Badge>
											</td>
											<td className="px-6 py-4 text-sm">
												<Link
													className="text-primary hover:underline"
													href={`/dashboard/appointments/${appointment.id}`}
												>
													View
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		// NEW: Generated Invoices Section
		if (generatedInvoices.length > 0) {
			sections.push({
				id: "generated-invoices",
				title: "Generated Invoices",
				icon: <Receipt className="size-4" />,
				count: generatedInvoices.length,
				content: (
					<UnifiedAccordionContent className="p-0">
						<div className="text-muted-foreground border-b px-6 py-4 text-sm">
							Invoices created from maintenance work under this plan.
						</div>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-muted/50 border-b">
									<tr>
										<th className="px-6 py-3 text-left text-sm font-medium">Invoice #</th>
										<th className="px-6 py-3 text-left text-sm font-medium">Date</th>
										<th className="px-6 py-3 text-left text-sm font-medium">Total</th>
										<th className="px-6 py-3 text-left text-sm font-medium">Status</th>
										<th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
									</tr>
								</thead>
								<tbody>
									{generatedInvoices.map((invoice: any) => (
										<tr className="hover:bg-muted/30 border-b" key={invoice.id}>
											<td className="px-6 py-4 text-sm">
												#{invoice.invoice_number || invoice.id.slice(0, 8)}
											</td>
											<td className="px-6 py-4 text-sm">
												{new Date(invoice.created_at).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 text-sm font-medium">
												{formatCurrency(invoice.total_amount)}
											</td>
											<td className="px-6 py-4 text-sm">
												<Badge variant={invoice.status === "paid" ? "default" : "outline"}>
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
					</UnifiedAccordionContent>
				),
			});
		}

		return sections;
	}, [
		plan,
		customer,
		equipment,
		generatedJobs,
		scheduledAppointments,
		generatedInvoices,
		includedServices,
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
				title: property.address || property.name || "Property",
				subtitle: `${property.city || ""}, ${property.state || ""}`.trim() || undefined,
				href: `/dashboard/work/properties/${property.id}`,
			});
		}

		equipment.forEach((eq: any) => {
			items.push({
				id: `equipment-${eq.id}`,
				type: "equipment",
				title: eq.name || eq.equipment_number,
				subtitle: `${eq.manufacturer || ""} ${eq.model || ""}`.trim() || undefined,
				href: `/dashboard/work/equipment/${eq.id}`,
			});
		});

		return items;
	}, [customer, property, equipment]);

	return (
		<DetailPageContentLayout
			activities={activities}
			attachments={attachments}
			customHeader={customHeader}
			customSections={customSections}
			defaultOpenSection="service-schedule"
			notes={notes}
			relatedItems={relatedItems}
			showStandardSections={{
				activities: true,
				notes: true,
				attachments: true,
				relatedItems: true,
			}}
		/>
	);
}
