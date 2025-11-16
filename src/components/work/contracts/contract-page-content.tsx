"use client";

import {
	Calendar,
	CalendarDays,
	FileSignature,
	FileText,
	GitBranch,
	MapPin,
	NotebookPen,
	Send,
	User,
} from "lucide-react";
import Link from "next/link";
import { type ElementType, type ReactElement, type ReactNode, useMemo } from "react";
import type { DetailPageHeaderConfig } from "@/components/layout/detail-page-content-layout";
import { DetailPageContentLayout } from "@/components/layout/detail-page-content-layout";
import { Badge } from "@/components/ui/badge";
import { UnifiedAccordionContent, type UnifiedAccordionSection } from "@/components/ui/unified-accordion";
import { WorkflowTimeline } from "@/components/ui/workflow-timeline";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type ContractStatus = "draft" | "sent" | "viewed" | "signed" | "rejected" | "expired" | string;

export type ContractRecord = {
	id: string;
	contractNumber?: string | null;
	title?: string | null;
	description?: string | null;
	customerName: string;
	customerId?: string | null;
	status?: ContractStatus | null;
	contractType?: string | null;
	signerName?: string | null;
	signerEmail?: string | null;
	signerTitle?: string | null;
	signerCompany?: string | null;
	signedAt?: string | null;
	sentAt?: string | null;
	viewedAt?: string | null;
	createdAt?: string | null;
	validFrom?: string | null;
	validUntil?: string | null;
	ipAddress?: string | null;
	content?: string | null;
	terms?: string | null;
	notes?: string | null;
};

export type CustomerRecord = {
	id: string;
	display_name?: string | null;
	first_name?: string | null;
	last_name?: string | null;
	email?: string | null;
	phone?: string | null;
};

export type PropertyRecord = {
	id: string;
	name?: string | null;
	address?: string | null;
	city?: string | null;
	state?: string | null;
};

export type RelatedEstimate = {
	id: string;
	estimate_number?: string | null;
	title?: string | null;
	status?: string | null;
	created_at?: string | null;
};

export type RelatedInvoice = {
	id: string;
	invoice_number?: string | null;
	title?: string | null;
	status?: string | null;
	created_at?: string | null;
	balance_amount?: number | null;
	paid_at?: string | null;
};

export type RelatedJob = {
	id: string;
	job_number?: string | null;
	title?: string | null;
	status?: string | null;
	created_at?: string | null;
};

export type AppointmentRecord = {
	id: string;
	scheduled_start?: string | null;
	scheduled_end?: string | null;
	status?: string | null;
	type?: string | null;
};

type RelatedItemBadgeVariant = "default" | "secondary" | "destructive" | "outline";

type RelatedItem = {
	id: string;
	type: string;
	title: string;
	subtitle?: string;
	href: string;
	badge?: {
		label: string;
		variant?: RelatedItemBadgeVariant;
	};
};

type WorkflowStageStatus = "completed" | "current" | "pending";

type WorkflowStage = {
	id: string;
	label: string;
	status: WorkflowStageStatus;
	date?: string;
	href?: string;
	description?: string;
};

export type ContractPageEntityData = {
	contract: ContractRecord;
	customer?: CustomerRecord | null;
	property?: PropertyRecord | null;
	estimate?: RelatedEstimate | null;
	invoice?: RelatedInvoice | null;
	job?: RelatedJob | null;
	appointments?: AppointmentRecord[];
};

export type ContractPageContentProps = {
	entityData: ContractPageEntityData;
};

function formatStatusLabel(status: ContractStatus | null | undefined): string {
	if (!status) {
		return "Draft";
	}

	return status
		.toString()
		.split("_")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function getStatusBadgeStyles(status: ContractStatus | null | undefined) {
	switch (status) {
		case "signed":
			return "bg-green-500/90 text-white hover:bg-green-600";
		case "sent":
			return "bg-primary/10 text-primary";
		case "viewed":
			return "bg-accent/10 text-accent-foreground";
		case "rejected":
			return "bg-destructive/10 text-destructive";
		case "expired":
			return "bg-warning/10 text-warning";
		default:
			return "bg-muted text-foreground";
	}
}

function getCustomerDisplayName(customer?: CustomerRecord | null, fallback?: string): string {
	if (!customer) {
		return fallback || "Unknown Customer";
	}

	if (customer.display_name) {
		return customer.display_name;
	}

	const fullName = `${customer.first_name || ""} ${customer.last_name || ""}`.trim();
	if (fullName) {
		return fullName;
	}

	return fallback || "Unknown Customer";
}

function getPropertyDisplayName(property?: PropertyRecord | null): string {
	if (!property) {
		return "Property";
	}

	return property.address || property.name || [property.city, property.state].filter(Boolean).join(", ") || "Property";
}

function buildHeaderConfig(
	contract: ContractRecord,
	customerName: string,
	statusBadge: ReactElement | null
): DetailPageHeaderConfig {
	const contractNumber = contract.contractNumber || `CON-${contract.id.slice(0, 8).toUpperCase()}`;

	const badges: ReactElement[] = [
		<Badge key="contract-number" variant="outline">
			{contractNumber}
		</Badge>,
	];

	if (statusBadge) {
		badges.push(statusBadge);
	}

	if (contract.contractType) {
		badges.push(
			<Badge className="capitalize" key="contract-type" variant="secondary">
				{contract.contractType}
			</Badge>
		);
	}

	return {
		title: contract.title || contractNumber,
		subtitle: customerName,
		badges,
	};
}

export function ContractPageContent({ entityData }: ContractPageContentProps) {
	const { contract, customer, property, estimate, invoice, job, appointments = [] } = entityData;

	const customerName = getCustomerDisplayName(customer, contract.customerName);
	const statusLabel = formatStatusLabel(contract.status);
	const statusBadge = contract.status ? (
		<Badge className={cn("capitalize", getStatusBadgeStyles(contract.status))} key="status-badge" variant="outline">
			{statusLabel}
		</Badge>
	) : null;

	const headerConfig = buildHeaderConfig(contract, customerName, statusBadge);

	const quickInfo = useMemo(() => {
		const items: {
			key: string;
			icon: ElementType;
			label: string;
			value: string;
		}[] = [];

		items.push({
			key: "status",
			icon: GitBranch,
			label: "Status",
			value: statusLabel,
		});

		items.push({
			key: "sent",
			icon: Send,
			label: "Sent At",
			value:
				contract.sentAt && contract.sentAt !== "" ? formatDate(contract.sentAt, { preset: "datetime" }) : "Not sent",
		});

		items.push({
			key: "viewed",
			icon: CalendarDays,
			label: "Viewed",
			value:
				contract.viewedAt && contract.viewedAt !== ""
					? formatDate(contract.viewedAt, { preset: "datetime" })
					: "Not viewed",
		});

		items.push({
			key: "signed",
			icon: FileSignature,
			label: "Signed",
			value:
				contract.signedAt && contract.signedAt !== ""
					? formatDate(contract.signedAt, { preset: "datetime" })
					: "Awaiting signature",
		});

		return items;
	}, [contract.sentAt, contract.viewedAt, contract.signedAt, statusLabel]);

	const relatedItems = useMemo<RelatedItem[]>(() => {
		const items: RelatedItem[] = [];

		if (customer) {
			items.push({
				id: `customer-${customer.id}`,
				type: "customer",
				title: getCustomerDisplayName(customer, contract.customerName),
				subtitle: customer.email || customer.phone || undefined,
				href: `/dashboard/customers/${customer.id}`,
			});
		} else if (contract.customerId) {
			items.push({
				id: `customer-${contract.customerId}`,
				type: "customer",
				title: contract.customerName,
				href: `/dashboard/customers/${contract.customerId}`,
			});
		}

		if (property) {
			items.push({
				id: `property-${property.id}`,
				type: "property",
				title: getPropertyDisplayName(property),
				subtitle: [property.city, property.state].filter(Boolean).join(", ") || undefined,
				href: `/dashboard/work/properties/${property.id}`,
			});
		}

		if (job) {
			items.push({
				id: `job-${job.id}`,
				type: "job",
				title: job.title || `Job #${job.job_number || job.id.slice(0, 8)}`,
				subtitle: job.status || undefined,
				href: `/dashboard/work/${job.id}`,
				badge: job.status ? { label: formatStatusLabel(job.status), variant: "outline" } : undefined,
			});
		}

		if (estimate) {
			items.push({
				id: `estimate-${estimate.id}`,
				type: "estimate",
				title: estimate.title || `Estimate #${estimate.estimate_number || estimate.id.slice(0, 8)}`,
				subtitle: estimate.status || undefined,
				href: `/dashboard/work/estimates/${estimate.id}`,
				badge: estimate.status ? { label: formatStatusLabel(estimate.status), variant: "secondary" } : undefined,
			});
		}

		if (invoice) {
			items.push({
				id: `invoice-${invoice.id}`,
				type: "invoice",
				title: invoice.title || `Invoice #${invoice.invoice_number || invoice.id.slice(0, 8)}`,
				subtitle: invoice.status || undefined,
				href: `/dashboard/work/invoices/${invoice.id}`,
				badge: invoice.status ? { label: formatStatusLabel(invoice.status), variant: "outline" } : undefined,
			});
		}

		return items;
	}, [contract, customer, estimate, invoice, job, property]);

	const workflowStages = useMemo<WorkflowStage[]>(() => {
		if (!(estimate || invoice)) {
			return [];
		}

		return [
			{
				id: "estimate",
				label: "Estimate Created",
				status: estimate ? "completed" : "pending",
				date: estimate?.created_at || undefined,
				href: estimate?.id ? `/dashboard/work/estimates/${estimate.id}` : undefined,
				description: estimate?.estimate_number ? `#${estimate.estimate_number}` : undefined,
			},
			{
				id: "contract",
				label: "Contract Generated",
				status: "completed",
				date: contract.createdAt || undefined,
				href: `/dashboard/work/contracts/${contract.id}`,
				description: contract.status === "signed" ? "Signed" : "Pending signature",
			},
			{
				id: "invoice",
				label: "Invoice Created",
				status: invoice ? "completed" : "pending",
				date: invoice?.created_at || undefined,
				href: invoice?.id ? `/dashboard/work/invoices/${invoice.id}` : undefined,
				description: invoice?.invoice_number ? `#${invoice.invoice_number}` : undefined,
			},
			{
				id: "payment",
				label: "Payment Received",
				status: invoice?.status === "paid" ? "completed" : invoice ? "current" : "pending",
				date: invoice?.paid_at || undefined,
				description: invoice?.paid_at
					? "Completed"
					: invoice
						? `Balance: ${formatCurrency(invoice.balance_amount ?? 0)}`
						: undefined,
			},
		];
	}, [contract, estimate, invoice]);

	const overviewSection = useMemo<UnifiedAccordionSection>(() => {
		const contractNumber = contract.contractNumber || `CON-${contract.id.slice(0, 8).toUpperCase()}`;

		return {
			id: "contract-overview",
			title: "Contract Overview",
			icon: <FileText className="size-4" />,
			defaultOpen: true,
			content: (
				<UnifiedAccordionContent>
					<div className="grid gap-6 md:grid-cols-2">
						<InfoBlock label="Contract Number" value={`#${contractNumber}`} />
						<InfoBlock label="Status" value={statusLabel} />
						<InfoBlock label="Contract Type" value={contract.contractType ? contract.contractType : "Not specified"} />
						<InfoBlock label="Created" value={formatDate(contract.createdAt, { preset: "datetime" })} />
						<InfoBlock label="Valid From" value={formatDate(contract.validFrom, { preset: "long" })} />
						<InfoBlock label="Valid Until" value={formatDate(contract.validUntil, { preset: "long" })} />
						<InfoBlock
							label="Customer"
							value={
								customer ? (
									<Link
										className="inline-flex items-center gap-2 font-medium text-primary text-sm hover:underline"
										href={`/dashboard/customers/${customer.id}`}
									>
										<User className="size-4" />
										{getCustomerDisplayName(customer, contract.customerName)}
									</Link>
								) : (
									contract.customerName
								)
							}
						/>
						{property && (
							<InfoBlock
								label="Property"
								value={
									<Link
										className="inline-flex items-center gap-2 font-medium text-primary text-sm hover:underline"
										href={`/dashboard/work/properties/${property.id}`}
									>
										<MapPin className="size-4" />
										{getPropertyDisplayName(property)}
									</Link>
								}
							/>
						)}
					</div>
				</UnifiedAccordionContent>
			),
		};
	}, [contract, customer, property, statusLabel]);

	const termsSection = useMemo<UnifiedAccordionSection>(
		() => ({
			id: "contract-terms",
			title: "Contract Terms",
			icon: <FileSignature className="size-4" />,
			content: (
				<UnifiedAccordionContent>
					<div className="rounded-lg border border-border/60 bg-muted/30 p-5 text-sm leading-relaxed">
						{contract.content && contract.content.trim().length > 0 ? (
							<p className="whitespace-pre-wrap">{contract.content}</p>
						) : (
							<p className="text-muted-foreground">No contract terms provided.</p>
						)}
					</div>
				</UnifiedAccordionContent>
			),
		}),
		[contract.content]
	);

	const signerSection = useMemo<UnifiedAccordionSection | null>(() => {
		if (!(contract.signerName || contract.signedAt)) {
			return null;
		}

		return {
			id: "signature",
			title: "Signature",
			icon: <FileSignature className="size-4" />,
			content: (
				<UnifiedAccordionContent>
					<div className="flex items-start gap-4 rounded-lg border border-border/60 bg-muted/20 p-4">
						<div className="rounded-lg bg-background p-3 shadow-sm">
							<FileSignature className="size-6 text-muted-foreground" />
						</div>
						<div className="flex-1 space-y-1">
							<p className="font-medium text-sm">{contract.signerName || "Signer name not provided"}</p>
							{contract.signerTitle && (
								<p className="text-muted-foreground text-sm">
									{contract.signerTitle}
									{contract.signerCompany ? ` at ${contract.signerCompany}` : ""}
								</p>
							)}
							{contract.signerEmail && <p className="text-muted-foreground text-xs">{contract.signerEmail}</p>}
							<div className="text-muted-foreground text-xs">
								<p>Signed on {formatDate(contract.signedAt, { preset: "datetime" })}</p>
								{contract.ipAddress && <p>IP: {contract.ipAddress}</p>}
							</div>
						</div>
					</div>
				</UnifiedAccordionContent>
			),
		};
	}, [
		contract.ipAddress,
		contract.signerCompany,
		contract.signerEmail,
		contract.signerName,
		contract.signerTitle,
		contract.signedAt,
	]);

	const engagementSection = useMemo<UnifiedAccordionSection>(() => {
		const events: {
			id: string;
			label: string;
			value: string;
			icon: ElementType;
			tone: "default" | "accent" | "success" | "muted";
		}[] = [
			{
				id: "signed",
				label: "Signed",
				value: formatDate(contract.signedAt, { preset: "datetime" }),
				icon: FileSignature,
				tone: "success",
			},
			{
				id: "viewed",
				label: "Viewed",
				value: formatDate(contract.viewedAt, { preset: "datetime" }),
				icon: CalendarDays,
				tone: "accent",
			},
			{
				id: "sent",
				label: "Sent",
				value: formatDate(contract.sentAt, { preset: "datetime" }),
				icon: Send,
				tone: "default",
			},
			{
				id: "created",
				label: "Created",
				value: formatDate(contract.createdAt, { preset: "datetime" }),
				icon: Calendar,
				tone: "muted",
			},
		];

		return {
			id: "engagement-history",
			title: "Engagement History",
			icon: <GitBranch className="size-4" />,
			content: (
				<UnifiedAccordionContent>
					<div className="space-y-3">
						{events.map((event) => (
							<TimelineEvent event={event} key={event.id} />
						))}
					</div>
				</UnifiedAccordionContent>
			),
		};
	}, [contract.createdAt, contract.sentAt, contract.signedAt, contract.viewedAt]);

	const appointmentsSection = useMemo<UnifiedAccordionSection | null>(() => {
		if (appointments.length === 0) {
			return null;
		}

		return {
			id: "appointments",
			title: "Recent Appointments",
			icon: <Calendar className="size-4" />,
			content: (
				<UnifiedAccordionContent>
					<div className="space-y-2">
						{appointments.map((appointment) => (
							<Link
								className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/40"
								href={`/dashboard/appointments/${appointment.id}`}
								key={appointment.id}
							>
								<div>
									<p className="font-medium text-sm">
										{formatDate(appointment.scheduled_start, {
											preset: "long",
										})}
									</p>
									<p className="text-muted-foreground text-xs">
										{formatDate(appointment.scheduled_start, {
											preset: "time",
										})}
										{appointment.scheduled_end
											? ` – ${formatDate(appointment.scheduled_end, {
													preset: "time",
												})}`
											: ""}
									</p>
								</div>
								<Badge variant="outline">{formatStatusLabel(appointment.status || "scheduled")}</Badge>
							</Link>
						))}
					</div>
				</UnifiedAccordionContent>
			),
		};
	}, [appointments]);

	const additionalTermsSection = useMemo<UnifiedAccordionSection | null>(() => {
		if (!contract.terms || contract.terms.trim().length === 0) {
			return null;
		}

		return {
			id: "additional-terms",
			title: "Additional Terms",
			icon: <NotebookPen className="size-4" />,
			content: (
				<UnifiedAccordionContent>
					<p className="whitespace-pre-wrap text-sm leading-relaxed">{contract.terms}</p>
				</UnifiedAccordionContent>
			),
		};
	}, [contract.terms]);

	const internalNotesSection = useMemo<UnifiedAccordionSection | null>(() => {
		if (!contract.notes || contract.notes.trim().length === 0) {
			return null;
		}

		return {
			id: "internal-notes",
			title: "Internal Notes",
			icon: <NotebookPen className="size-4" />,
			content: (
				<UnifiedAccordionContent>
					<p className="whitespace-pre-wrap text-muted-foreground text-sm">{contract.notes}</p>
				</UnifiedAccordionContent>
			),
		};
	}, [contract.notes]);

	const customSections = useMemo<UnifiedAccordionSection[]>(
		() =>
			[
				overviewSection,
				termsSection,
				signerSection,
				engagementSection,
				appointmentsSection,
				additionalTermsSection,
				internalNotesSection,
			].filter(Boolean) as UnifiedAccordionSection[],
		[
			additionalTermsSection,
			appointmentsSection,
			engagementSection,
			overviewSection,
			signerSection,
			termsSection,
			internalNotesSection,
		]
	);

	const shouldShowWorkflowTimeline = workflowStages.length > 0;

	return (
		<DetailPageContentLayout
			beforeContent={
				shouldShowWorkflowTimeline ? (
					<div className="w-full px-2 sm:px-0">
						<div className="mx-auto max-w-7xl">
							<WorkflowTimeline stages={workflowStages} />
						</div>
					</div>
				) : undefined
			}
			customHeader={<HeaderSurface config={headerConfig} quickInfo={quickInfo} />}
			customSections={customSections}
			defaultOpenSection="contract-overview"
			relatedItems={relatedItems}
			showStandardSections={{
				activities: false,
				notes: false,
				attachments: false,
				relatedItems: relatedItems.length > 0,
			}}
			storageKey="contract-details"
		/>
	);
}

function HeaderSurface({
	config,
	quickInfo,
}: {
	config: DetailPageHeaderConfig;
	quickInfo: {
		key: string;
		icon: ElementType;
		label: string;
		value: string;
	}[];
}) {
	return (
		<div className="w-full px-2 sm:px-0">
			<div className="mx-auto max-w-7xl rounded-xl border border-border/60 bg-card shadow-sm">
				<div className="flex flex-col gap-6 p-6 md:p-8">
					<DetailPageHeader config={config} />
					<QuickInfoGrid items={quickInfo} />
				</div>
			</div>
		</div>
	);
}

function DetailPageHeader({ config }: { config: DetailPageHeaderConfig }) {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				{config.title ? <h1 className="font-semibold text-2xl leading-tight md:text-3xl">{config.title}</h1> : null}
				{config.subtitle ? <p className="text-muted-foreground text-sm md:text-base">{config.subtitle}</p> : null}
				{config.description ? <p className="text-muted-foreground text-sm">{config.description}</p> : null}
			</div>
			{config.badges && config.badges.length > 0 ? (
				<div className="flex flex-wrap items-center gap-2">{config.badges}</div>
			) : null}
		</div>
	);
}

function QuickInfoGrid({
	items,
}: {
	items: {
		key: string;
		icon: ElementType;
		label: string;
		value: string;
	}[];
}) {
	if (items.length === 0) {
		return null;
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{items.map((item) => {
				const Icon = item.icon;
				return (
					<div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-3" key={item.key}>
						<div className="rounded-md bg-background p-2 shadow-sm">
							<Icon className="size-4 text-muted-foreground" />
						</div>
						<div className="flex flex-col">
							<span className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">{item.label}</span>
							<span className="font-medium text-sm">{item.value}</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}

function InfoBlock({ label, value }: { label: string; value: ReactNode }) {
	return (
		<div className="space-y-1">
			<span className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">{label}</span>
			<div className="font-medium text-sm">{value}</div>
		</div>
	);
}

function TimelineEvent({
	event,
}: {
	event: {
		id: string;
		label: string;
		value: string;
		icon: ElementType;
		tone: "default" | "accent" | "success" | "muted";
	};
}) {
	if (event.value === "—") {
		return null;
	}

	const Icon = event.icon;

	const toneClasses: Record<typeof event.tone, string> = {
		default: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground",
		accent: "bg-accent/10 text-accent-foreground dark:bg-accent/20 dark:text-accent-foreground",
		success: "bg-success/10 text-success dark:bg-success/20 dark:text-success",
		muted: "bg-muted text-muted-foreground",
	};

	return (
		<div className="flex items-start gap-3">
			<span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", toneClasses[event.tone])}>
				<Icon className="size-4" />
			</span>
			<div className="space-y-1">
				<p className="font-medium text-sm">{event.label}</p>
				<p className="text-muted-foreground text-xs">{event.value}</p>
			</div>
		</div>
	);
}
