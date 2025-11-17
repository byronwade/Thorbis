/**
 * Service Agreement Page Content
 *
 * Comprehensive service agreement details with collapsible sections
 * Matches job and customer detail page patterns
 */

"use client";

import {
	CalendarDays,
	CheckCircle2,
	DollarSign,
	FileSignature,
	MapPin,
	Package,
	Receipt,
	RefreshCw,
	ShieldCheck,
	User,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import { type ElementType, type ReactNode, useMemo } from "react";
import { DetailPageContentLayout } from "@/components/layout/detail-page-content-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	UnifiedAccordionContent,
	type UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MS_PER_DAY = MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;
const RENEWAL_SOON_THRESHOLD_DAYS = 30;
const SHORT_ID_LENGTH = 8;

type ServiceAgreementRecord = {
	id: string;
	plan_number?: string | null;
	agreement_number?: string | null;
	agreementNumber?: string | null;
	name?: string | null;
	title?: string | null;
	description?: string | null;
	status?: string | null;
	billing_frequency?: string | null;
	auto_renew?: boolean | null;
	contract_value?: number | null;
	price?: number | null;
	value?: number | null;
	start_date?: string | null;
	end_date?: string | null;
	renewal_date?: string | null;
	renewal_type?: string | null;
	renewal_notice_days?: number | null;
	service_levels?: unknown;
	terms?: string | null;
	payment_terms?: string | null;
};

type CustomerRecord = {
	id: string;
	display_name?: string | null;
	first_name?: string | null;
	last_name?: string | null;
	email?: string | null;
	phone?: string | null;
};

type PropertyRecord = {
	id: string;
	address?: string | null;
	name?: string | null;
	city?: string | null;
	state?: string | null;
};

type InvoiceRecord = {
	id: string;
	invoice_number?: string | null;
	title?: string | null;
	total_amount?: number | null;
	balance_amount?: number | null;
	status?: string | null;
	created_at?: string | null;
};

type JobRecord = {
	id: string;
	job_number?: string | null;
	title?: string | null;
	status?: string | null;
	created_at?: string | null;
	completed_at?: string | null;
};

type EquipmentRecord = {
	id: string;
	equipment_number?: string | null;
	name?: string | null;
	type?: string | null;
	manufacturer?: string | null;
};

type RelatedItem = {
	id: string;
	type: "customer" | "property";
	title: string;
	subtitle?: string;
	href: string;
};

type ServiceLevelDisplay = {
	id: string;
	label: string;
	responseTime?: string;
};

export type ServiceAgreementData = {
	agreement: ServiceAgreementRecord;
	customer?: CustomerRecord | null;
	property?: PropertyRecord | null;
	generatedInvoices?: InvoiceRecord[];
	generatedJobs?: JobRecord[];
	equipment?: EquipmentRecord[];
	notes?: unknown[];
	activities?: unknown[];
	attachments?: unknown[];
};

export type ServiceAgreementPageContentProps = {
	entityData: ServiceAgreementData;
};

type QuickInfoTone = "default" | "warning" | "destructive" | "success";

type QuickInfoBadge = {
	key: string;
	icon: ElementType;
	label: string;
	value: string;
	helper?: string;
	tone?: QuickInfoTone;
};

type InfoBlockProps = {
	label: string;
	value: ReactNode;
	helper?: ReactNode;
};

function InfoBlock({ label, value, helper }: InfoBlockProps) {
	return (
		<div className="space-y-1">
			<span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
				{label}
			</span>
			<div className="text-foreground text-sm font-medium">{value}</div>
			{helper ? <div className="text-muted-foreground text-xs">{helper}</div> : null}
		</div>
	);
}

function quickInfoBadgeClass(tone: QuickInfoTone = "default") {
	return cn(
		"inline-flex min-h-[3.25rem] items-center gap-3 rounded-full border border-border/60 bg-background px-4 py-2 transition-colors hover:border-primary/50 hover:bg-primary/5 dark:border-border/40",
		tone === "warning" &&
			"border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-300",
		tone === "destructive" &&
			"border-destructive/40 bg-destructive/10 text-destructive hover:border-destructive/60 hover:bg-destructive/15 dark:text-destructive",
		tone === "success" &&
			"border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-300"
	);
}

function safeParseJson(value: string): unknown {
	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
}

function normalizeServiceLevels(input: unknown): ServiceLevelDisplay[] {
	const raw = typeof input === "string" ? safeParseJson(input) : input;

	if (!Array.isArray(raw)) {
		return [];
	}

	return raw.reduce<ServiceLevelDisplay[]>((acc, item, index) => {
		if (typeof item === "string") {
			const label = item.trim();
			if (!label) {
				return acc;
			}

			acc.push({
				id: `${label}-${index}`,
				label,
			});
			return acc;
		}

		if (item && typeof item === "object") {
			const candidate = item as {
				id?: string | number;
				name?: string | null;
				description?: string | null;
				response_time?: string | number | null;
			};

			const label =
				candidate.name?.toString() ??
				candidate.description?.toString() ??
				`Service Level ${index + 1}`;

			acc.push({
				id: candidate.id?.toString() ?? `${label}-${index}`,
				label,
				responseTime: candidate.response_time?.toString(),
			});
		}

		return acc;
	}, []);
}

function formatShortId(id: string): string {
	return id.slice(0, SHORT_ID_LENGTH);
}

function formatBillingFrequency(value: string): string {
	return value.replaceAll("_", " ");
}

function buildContractSection(agreement: ServiceAgreementRecord): UnifiedAccordionSection {
	const contractValue = agreement.contract_value ?? 0;
	const hasContractValue = contractValue > 0;

	return {
		id: "contract-terms",
		title: "Contract Terms",
		icon: <FileSignature className="size-4" />,
		defaultOpen: true,
		content: (
			<UnifiedAccordionContent>
				<div className="grid gap-6 sm:grid-cols-2">
					<InfoBlock
						label="Start Date"
						value={
							agreement.start_date
								? formatDate(agreement.start_date, { preset: "medium" })
								: "Not set"
						}
					/>
					{agreement.end_date ? (
						<InfoBlock
							label="End Date"
							value={formatDate(agreement.end_date, { preset: "medium" })}
						/>
					) : null}
					{hasContractValue ? (
						<InfoBlock label="Contract Value" value={formatCurrency(contractValue)} />
					) : null}
					{agreement.payment_terms ? (
						<InfoBlock label="Payment Terms" value={agreement.payment_terms} />
					) : null}
				</div>
				{agreement.terms ? (
					<div className="mt-6 space-y-2">
						<span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
							Terms & Conditions
						</span>
						<p className="text-muted-foreground text-sm whitespace-pre-wrap">{agreement.terms}</p>
					</div>
				) : null}
			</UnifiedAccordionContent>
		),
	};
}

function buildServiceLevelsSection(levels: ServiceLevelDisplay[]): UnifiedAccordionSection | null {
	if (levels.length === 0) {
		return null;
	}

	return {
		id: "service-levels",
		title: "Service Levels",
		icon: <ShieldCheck className="size-4" />,
		count: levels.length,
		content: (
			<UnifiedAccordionContent>
				<div className="space-y-2">
					{levels.map((level) => (
						<div
							className="border-border/60 bg-background flex items-center gap-3 rounded-lg border px-4 py-3"
							key={level.id}
						>
							<CheckCircle2 className="text-success size-4" />
							<div className="flex flex-col">
								<span className="text-foreground text-sm font-medium">{level.label}</span>
								{level.responseTime ? (
									<span className="text-muted-foreground text-xs">
										Response: {level.responseTime}
									</span>
								) : null}
							</div>
						</div>
					))}
				</div>
			</UnifiedAccordionContent>
		),
	};
}

function buildRenewalSection(agreement: ServiceAgreementRecord): UnifiedAccordionSection | null {
	if (!(agreement.renewal_type || agreement.renewal_date || agreement.renewal_notice_days)) {
		return null;
	}

	return {
		id: "renewal",
		title: "Renewal",
		icon: <RefreshCw className="size-4" />,
		content: (
			<UnifiedAccordionContent>
				<div className="grid gap-6 sm:grid-cols-2">
					{agreement.renewal_type ? (
						<InfoBlock
							label="Renewal Type"
							value={String(agreement.renewal_type).replaceAll("_", " ")}
						/>
					) : null}
					{agreement.renewal_date ? (
						<InfoBlock
							label="Renewal Date"
							value={formatDate(agreement.renewal_date, { preset: "medium" })}
						/>
					) : null}
					{agreement.renewal_notice_days ? (
						<InfoBlock label="Notice Window" value={`${agreement.renewal_notice_days} days`} />
					) : null}
				</div>
			</UnifiedAccordionContent>
		),
	};
}

function buildCustomerSection(customer?: CustomerRecord | null): UnifiedAccordionSection | null {
	if (!customer) {
		return null;
	}

	return {
		id: "customer-details",
		title: "Customer Details",
		icon: <User className="size-4" />,
		content: (
			<UnifiedAccordionContent>
				<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
					<div className="grid flex-1 gap-6 sm:grid-cols-2">
						<InfoBlock
							label="Name"
							value={
								customer.display_name ||
								`${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
								"Unknown"
							}
						/>
						<InfoBlock label="Email" value={customer.email || "N/A"} />
					</div>
					<Button asChild size="sm" variant="ghost">
						<Link href={`/dashboard/customers/${customer.id}`}>View Full Profile</Link>
					</Button>
				</div>
			</UnifiedAccordionContent>
		),
	};
}

function buildInvoicesSection(invoices: InvoiceRecord[]): UnifiedAccordionSection | null {
	if (invoices.length === 0) {
		return null;
	}

	return {
		id: "generated-invoices",
		title: "Generated Invoices",
		icon: <Receipt className="size-4" />,
		count: invoices.length,
		content: (
			<UnifiedAccordionContent className="p-0">
				<div className="text-muted-foreground border-b px-6 py-4 text-sm">
					Invoices created from this service agreement.
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-muted/50 border-b">
							<tr>
								<th className="px-6 py-3 text-left text-sm font-medium">Invoice #</th>
								<th className="px-6 py-3 text-left text-sm font-medium">Title</th>
								<th className="px-6 py-3 text-left text-sm font-medium">Date</th>
								<th className="px-6 py-3 text-left text-sm font-medium">Total</th>
								<th className="px-6 py-3 text-left text-sm font-medium">Balance</th>
								<th className="px-6 py-3 text-left text-sm font-medium">Status</th>
								<th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
							</tr>
						</thead>
						<tbody>
							{invoices.map((invoice) => (
								<tr className="hover:bg-muted/30 border-b" key={invoice.id}>
									<td className="px-6 py-4 text-sm">
										#{invoice.invoice_number || formatShortId(invoice.id)}
									</td>
									<td className="px-6 py-4 text-sm">{invoice.title || "—"}</td>
									<td className="px-6 py-4 text-sm">
										{formatDate(invoice.created_at, { preset: "medium" })}
									</td>
									<td className="px-6 py-4 text-sm font-medium">
										{formatCurrency(invoice.total_amount)}
									</td>
									<td className="px-6 py-4 text-sm font-medium">
										{formatCurrency(invoice.balance_amount)}
									</td>
									<td className="px-6 py-4 text-sm">
										<Badge variant={invoice.status === "paid" ? "default" : "outline"}>
											{invoice.status || "pending"}
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
	};
}

function buildJobsSection(jobs: JobRecord[]): UnifiedAccordionSection | null {
	if (jobs.length === 0) {
		return null;
	}

	return {
		id: "generated-jobs",
		title: "Generated Jobs",
		icon: <Wrench className="size-4" />,
		count: jobs.length,
		content: (
			<UnifiedAccordionContent className="p-0">
				<div className="text-muted-foreground border-b px-6 py-4 text-sm">
					Jobs created from this service agreement.
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-muted/50 border-b">
							<tr>
								<th className="px-6 py-3 text-left text-sm font-medium">Job #</th>
								<th className="px-6 py-3 text-left text-sm font-medium">Title</th>
								<th className="px-6 py-3 text-left text-sm font-medium">Date</th>
								<th className="px-6 py-3 text-left text-sm font-medium">Status</th>
								<th className="px-6 py-3 text-left text-sm font-medium">Completed</th>
								<th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
							</tr>
						</thead>
						<tbody>
							{jobs.map((job) => (
								<tr className="hover:bg-muted/30 border-b" key={job.id}>
									<td className="px-6 py-4 text-sm">#{job.job_number || formatShortId(job.id)}</td>
									<td className="px-6 py-4 text-sm font-medium">{job.title || "—"}</td>
									<td className="px-6 py-4 text-sm">
										{formatDate(job.created_at, { preset: "medium" })}
									</td>
									<td className="px-6 py-4 text-sm">
										<Badge variant="outline">{job.status || "scheduled"}</Badge>
									</td>
									<td className="px-6 py-4 text-sm">
										{job.completed_at ? formatDate(job.completed_at, { preset: "medium" }) : "—"}
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
	};
}

function buildEquipmentSection(equipment: EquipmentRecord[]): UnifiedAccordionSection | null {
	if (equipment.length === 0) {
		return null;
	}

	return {
		id: "equipment-covered",
		title: "Equipment Covered",
		icon: <Package className="size-4" />,
		count: equipment.length,
		content: (
			<UnifiedAccordionContent className="p-0">
				<div className="text-muted-foreground border-b px-6 py-4 text-sm">
					Equipment included in this service agreement.
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-muted/50 border-b">
							<tr>
								<th className="px-6 py-3 text-left text-sm font-medium">Equipment #</th>
								<th className="px-6 py-3 text-left text-sm font-medium">Name</th>
								<th className="px-6 py-3 text-left text-sm font-medium">Type</th>
								<th className="px-6 py-3 text-left text-sm font-medium">Manufacturer</th>
								<th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
							</tr>
						</thead>
						<tbody>
							{equipment.map((item) => (
								<tr className="hover:bg-muted/30 border-b" key={item.id}>
									<td className="px-6 py-4 text-sm">
										#{item.equipment_number || formatShortId(item.id)}
									</td>
									<td className="px-6 py-4 text-sm font-medium">{item.name || "—"}</td>
									<td className="px-6 py-4 text-sm">{item.type || "—"}</td>
									<td className="px-6 py-4 text-sm">{item.manufacturer || "—"}</td>
									<td className="px-6 py-4 text-sm">
										<Link
											className="text-primary hover:underline"
											href={`/dashboard/work/equipment/${item.id}`}
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
	};
}

function createStartBadge(agreement: ServiceAgreementRecord): QuickInfoBadge | null {
	if (!agreement.start_date) {
		return null;
	}

	return {
		key: "start",
		icon: CalendarDays,
		label: "Starts",
		value: formatDate(agreement.start_date, { preset: "medium" }),
	};
}

function createRenewalBadge(agreement: ServiceAgreementRecord): QuickInfoBadge | null {
	const renewalDate = agreement.renewal_date || agreement.end_date;
	if (!renewalDate) {
		return null;
	}

	const date = new Date(renewalDate);
	if (Number.isNaN(date.getTime())) {
		return null;
	}

	const diffDays = Math.ceil((date.getTime() - Date.now()) / MS_PER_DAY);
	let helperText = "";
	let tone: QuickInfoTone = "default";

	if (diffDays < 0) {
		helperText = `${Math.abs(diffDays)} days overdue`;
		tone = "destructive";
	} else if (diffDays === 0) {
		helperText = "Renews today";
		tone = "warning";
	} else {
		helperText = `${diffDays} days remaining`;
		if (diffDays <= RENEWAL_SOON_THRESHOLD_DAYS) {
			tone = "warning";
		}
	}

	return {
		key: "renewal",
		icon: RefreshCw,
		label: "Renews",
		value: formatDate(date, { preset: "medium" }),
		helper: helperText,
		tone,
	};
}

function createContractValueBadge(agreement: ServiceAgreementRecord): QuickInfoBadge | null {
	const contractValue = agreement.contract_value ?? agreement.price ?? agreement.value ?? 0;
	if (contractValue <= 0) {
		return null;
	}

	return {
		key: "contract-value",
		icon: DollarSign,
		label: "Contract Value",
		value: formatCurrency(contractValue),
	};
}

function createBillingBadge(agreement: ServiceAgreementRecord): QuickInfoBadge | null {
	if (!agreement.billing_frequency) {
		return null;
	}

	return {
		key: "billing-frequency",
		icon: ShieldCheck,
		label: "Billing",
		value: formatBillingFrequency(String(agreement.billing_frequency)),
	};
}

function createInvoicesBadge(invoices: InvoiceRecord[]): QuickInfoBadge | null {
	if (invoices.length === 0) {
		return null;
	}

	const invoiceTotal = invoices.reduce((sum, invoice) => sum + (invoice.total_amount ?? 0), 0);
	const outstanding = invoices.reduce((sum, invoice) => sum + (invoice.balance_amount ?? 0), 0);

	return {
		key: "invoices",
		icon: Receipt,
		label: invoices.length === 1 ? "Invoice Generated" : "Invoices Generated",
		value: `${invoices.length}`,
		helper:
			outstanding > 0
				? `${formatCurrency(invoiceTotal)} • ${formatCurrency(outstanding)} due`
				: formatCurrency(invoiceTotal),
		tone: outstanding > 0 ? "warning" : "success",
	};
}

function createJobsBadge(jobs: JobRecord[]): QuickInfoBadge | null {
	if (jobs.length === 0) {
		return null;
	}

	const completedJobs = jobs.filter((job) => job.status === "completed").length;

	return {
		key: "jobs",
		icon: Wrench,
		label: jobs.length === 1 ? "Linked Job" : "Linked Jobs",
		value: `${jobs.length}`,
		helper: completedJobs > 0 ? `${completedJobs} completed` : "In progress",
	};
}

function createEquipmentBadge(equipment: EquipmentRecord[]): QuickInfoBadge | null {
	if (equipment.length === 0) {
		return null;
	}

	return {
		key: "equipment",
		icon: Package,
		label: equipment.length === 1 ? "Covered Asset" : "Covered Assets",
		value: `${equipment.length}`,
	};
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
		expired: {
			className: "bg-warning text-white",
			label: "Expired",
		},
		cancelled: {
			className: "bg-destructive text-white",
			label: "Cancelled",
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

export function ServiceAgreementPageContent({ entityData }: ServiceAgreementPageContentProps) {
	const {
		agreement,
		customer,
		property,
		generatedInvoices = [], // NEW
		generatedJobs = [], // NEW
		equipment = [], // NEW
		notes = [],
		activities = [],
		attachments = [],
	} = entityData;

	const agreementNumber =
		agreement.plan_number ||
		agreement.agreement_number ||
		agreement.agreementNumber ||
		(typeof agreement.id === "string"
			? `AG-${formatShortId(agreement.id).toUpperCase()}`
			: "Service Agreement");

	const headerBadges = useMemo(() => {
		const badges: ReactNode[] = [
			<Badge key="number" variant="outline">
				{agreementNumber}
			</Badge>,
			getStatusBadge(agreement.status || "draft", "status"),
		];

		if (agreement.billing_frequency) {
			badges.push(
				<Badge className="capitalize" key="billing" variant="outline">
					{formatBillingFrequency(String(agreement.billing_frequency))}
				</Badge>
			);
		}

		if (agreement.auto_renew) {
			badges.push(
				<Badge
					className="border-success/40 bg-success/10 text-success"
					key="auto-renew"
					variant="outline"
				>
					Auto-Renew
				</Badge>
			);
		}

		return badges;
	}, [agreementNumber, agreement.status, agreement.billing_frequency, agreement.auto_renew]);

	const quickInfoBadges = useMemo<QuickInfoBadge[]>(
		() =>
			[
				createStartBadge(agreement),
				createRenewalBadge(agreement),
				createContractValueBadge(agreement),
				createBillingBadge(agreement),
				createInvoicesBadge(generatedInvoices),
				createJobsBadge(generatedJobs),
				createEquipmentBadge(equipment),
			].filter(Boolean) as QuickInfoBadge[],
		[agreement, equipment, generatedInvoices, generatedJobs]
	);

	const quickLinkClassName =
		"border border-border/60 bg-background font-medium inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors hover:border-primary/50 hover:bg-primary/5";

	const customHeader = (
		<div className="w-full px-2 sm:px-0">
			<div className="bg-muted/40 mx-auto max-w-7xl rounded-xl shadow-sm">
				<div className="flex flex-col gap-4 p-4 sm:p-6">
					<div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
						<div className="flex flex-col gap-4">
							<div className="flex flex-wrap items-center gap-2">{headerBadges}</div>
							<div className="flex flex-col gap-2">
								<h1 className="text-2xl font-semibold sm:text-3xl">
									{agreement.name || agreement.title || `Agreement ${agreementNumber}`}
								</h1>
								{agreement.description ? (
									<p className="text-muted-foreground text-sm sm:text-base">
										{agreement.description}
									</p>
								) : null}
							</div>
						</div>
					</div>

					{(customer || property) && (
						<div className="flex flex-wrap items-center gap-2">
							{customer ? (
								<Link className={quickLinkClassName} href={`/dashboard/customers/${customer.id}`}>
									<User className="size-4" />
									{customer.display_name ||
										`${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
										"Unknown Customer"}
								</Link>
							) : null}
							{property ? (
								<Link
									className={quickLinkClassName}
									href={`/dashboard/work/properties/${property.id}`}
								>
									<MapPin className="size-4" />
									{property.address ||
										property.name ||
										[property.city, property.state].filter(Boolean).join(", ") ||
										"Property"}
								</Link>
							) : null}
						</div>
					)}

					{quickInfoBadges.length > 0 ? (
						<div className="flex flex-wrap items-center gap-2">
							{quickInfoBadges.map(({ key, icon: Icon, label, value, helper, tone }) => (
								<div className={quickInfoBadgeClass(tone)} key={key}>
									<Icon className="text-muted-foreground size-4" />
									<div className="flex flex-col">
										<span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
											{label}
										</span>
										<span className="text-foreground text-sm font-medium">{value}</span>
										{helper ? (
											<span className="text-muted-foreground text-xs">{helper}</span>
										) : null}
									</div>
								</div>
							))}
						</div>
					) : null}
				</div>
			</div>
		</div>
	);

	const serviceLevels = useMemo<ServiceLevelDisplay[]>(
		() => normalizeServiceLevels(agreement.service_levels),
		[agreement.service_levels]
	);

	const customSections = useMemo<UnifiedAccordionSection[]>(
		() =>
			[
				buildContractSection(agreement),
				buildServiceLevelsSection(serviceLevels),
				buildRenewalSection(agreement),
				buildCustomerSection(customer),
				buildInvoicesSection(generatedInvoices),
				buildJobsSection(generatedJobs),
				buildEquipmentSection(equipment),
			].filter(Boolean) as UnifiedAccordionSection[],
		[agreement, customer, equipment, generatedInvoices, generatedJobs, serviceLevels]
	);

	const relatedItems = useMemo<RelatedItem[]>(() => {
		const items: RelatedItem[] = [];

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

		return items;
	}, [customer, property]);

	return (
		<>
			<DetailPageContentLayout
				activities={activities}
				attachments={attachments}
				customHeader={customHeader}
				customSections={customSections}
				defaultOpenSection="contract-terms"
				notes={notes}
				relatedItems={relatedItems}
				showStandardSections={{
					activities: true,
					notes: true,
					attachments: true,
					relatedItems: true,
				}}
			/>

			{/* Archive Dialog */}
		</>
	);
}
