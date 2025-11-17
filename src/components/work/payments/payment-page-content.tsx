/**
 * Payment Page Content
 *
 * Comprehensive payment details with collapsible sections
 * Matches job and customer detail page patterns
 */

"use client";

import {
	Building2,
	Calendar,
	CreditCard,
	DollarSign,
	FileText,
	Receipt,
	RefreshCw,
	User,
} from "lucide-react";
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

export type PaymentData = {
	payment: any;
	customer?: any;
	invoice?: any;
	job?: any;
	paymentPlanSchedule?: any; // NEW
	financingProvider?: any; // NEW
	notes?: any[];
	activities?: any[];
	attachments?: any[];
};

export type PaymentPageContentProps = {
	entityData: PaymentData;
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

function getPaymentMethodLabel(method: string): string {
	const labels: Record<string, string> = {
		cash: "Cash",
		check: "Check",
		credit_card: "Credit Card",
		debit_card: "Debit Card",
		ach: "ACH",
		wire: "Wire Transfer",
		venmo: "Venmo",
		paypal: "PayPal",
		other: "Other",
	};
	return labels[method] || method;
}

function getStatusBadge(status: string, key?: string) {
	const variants: Record<string, { className: string; label: string }> = {
		pending: {
			className: "bg-warning text-warning dark:bg-warning/20 dark:text-warning",
			label: "Pending",
		},
		processing: {
			className: "bg-primary text-primary dark:bg-primary/20 dark:text-primary",
			label: "Processing",
		},
		completed: {
			className: "bg-success text-white",
			label: "Completed",
		},
		failed: {
			className: "bg-destructive text-white",
			label: "Failed",
		},
		refunded: {
			className: "bg-warning text-white",
			label: "Refunded",
		},
		partially_refunded: {
			className: "bg-warning text-warning dark:bg-warning/20 dark:text-warning",
			label: "Partially Refunded",
		},
		cancelled: {
			className: "bg-secondary0 text-white",
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

export function PaymentPageContent({ entityData }: PaymentPageContentProps) {
	const {
		payment,
		customer,
		invoice,
		job,
		paymentPlanSchedule, // NEW
		financingProvider, // NEW
		notes = [],
		activities = [],
		attachments = [],
	} = entityData;

	const headerBadges = [
		getStatusBadge(payment.status || "pending", "status"),
		<Badge key="method" variant="outline">
			{getPaymentMethodLabel(payment.payment_method || "other")}
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
									Payment {payment.payment_number || payment.id.slice(0, 8)}
								</h1>
								<p className="text-muted-foreground text-sm sm:text-base">
									{formatCurrency(payment.amount)}
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
				id: "payment-details",
				title: "Payment Details",
				icon: <CreditCard className="size-4" />,
				defaultOpen: true,
				content: (
					<UnifiedAccordionContent>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<Label>Payment Number</Label>
								<Input readOnly value={payment.payment_number || payment.id.slice(0, 8)} />
							</div>
							<div>
								<Label>Amount</Label>
								<Input readOnly value={formatCurrency(payment.amount)} />
							</div>
							<div>
								<Label>Payment Method</Label>
								<Input readOnly value={getPaymentMethodLabel(payment.payment_method || "other")} />
							</div>
							<div>
								<Label>Status</Label>
								<div>{getStatusBadge(payment.status || "pending")}</div>
							</div>
							{payment.processed_at && (
								<div>
									<Label>Processed At</Label>
									<Input readOnly value={new Date(payment.processed_at).toLocaleString()} />
								</div>
							)}
							{payment.completed_at && (
								<div>
									<Label>Completed At</Label>
									<Input readOnly value={new Date(payment.completed_at).toLocaleString()} />
								</div>
							)}
							{payment.reference_number && (
								<div>
									<Label>Reference Number</Label>
									<Input readOnly value={payment.reference_number} />
								</div>
							)}
							{payment.check_number && (
								<div>
									<Label>Check Number</Label>
									<Input readOnly value={payment.check_number} />
								</div>
							)}
							{payment.card_last4 && (
								<div>
									<Label>Card</Label>
									<Input
										readOnly
										value={`${payment.card_brand || "Card"} •••• ${payment.card_last4}`}
									/>
								</div>
							)}
						</div>
					</UnifiedAccordionContent>
				),
			},
		];

		if (payment.processor_name || payment.processor_transaction_id) {
			sections.push({
				id: "processor-info",
				title: "Processor Information",
				icon: <Building2 className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="grid gap-4 md:grid-cols-2">
							{payment.processor_name && (
								<div>
									<Label>Processor</Label>
									<Input readOnly value={payment.processor_name} />
								</div>
							)}
							{payment.processor_transaction_id && (
								<div>
									<Label>Transaction ID</Label>
									<Input readOnly value={payment.processor_transaction_id} />
								</div>
							)}
							{payment.processor_fee !== null && payment.processor_fee !== undefined && (
								<div>
									<Label>Processor Fee</Label>
									<Input readOnly value={formatCurrency(payment.processor_fee)} />
								</div>
							)}
							{payment.net_amount !== null && payment.net_amount !== undefined && (
								<div>
									<Label>Net Amount</Label>
									<Input readOnly value={formatCurrency(payment.net_amount)} />
								</div>
							)}
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		if (payment.refunded_amount > 0) {
			sections.push({
				id: "refunds",
				title: "Refunds",
				icon: <RefreshCw className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="space-y-3">
							<div>
								<Label>Refunded Amount</Label>
								<p className="text-sm font-semibold">{formatCurrency(payment.refunded_amount)}</p>
							</div>
							{payment.refund_reason && (
								<div>
									<Label>Refund Reason</Label>
									<p className="text-sm">{payment.refund_reason}</p>
								</div>
							)}
							{payment.refunded_at && (
								<div>
									<Label>Refunded At</Label>
									<p className="text-sm">{new Date(payment.refunded_at).toLocaleString()}</p>
								</div>
							)}
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

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
								<div>
									<Label>Phone</Label>
									<p className="text-sm">{customer.phone || "N/A"}</p>
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

		if (invoice) {
			sections.push({
				id: "invoice-details",
				title: "Related Invoice",
				icon: <Receipt className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
							<div className="grid flex-1 gap-4 md:grid-cols-2">
								<div>
									<Label>Invoice Number</Label>
									<p className="text-sm">#{invoice.invoice_number || invoice.id.slice(0, 8)}</p>
								</div>
								<div>
									<Label>Invoice Amount</Label>
									<p className="text-sm">{formatCurrency(invoice.total_amount)}</p>
								</div>
								<div>
									<Label>Status</Label>
									<Badge variant="outline">{invoice.status || "N/A"}</Badge>
								</div>
							</div>
							<Button asChild size="sm" variant="ghost">
								<Link href={`/dashboard/work/invoices/${invoice.id}`}>View Invoice</Link>
							</Button>
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		if (job) {
			sections.push({
				id: "job-details",
				title: "Related Job",
				icon: <FileText className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
							<div className="grid flex-1 gap-4 md:grid-cols-2">
								<div>
									<Label>Job Number</Label>
									<p className="text-sm">#{job.job_number || job.id.slice(0, 8)}</p>
								</div>
								<div>
									<Label>Title</Label>
									<p className="text-sm">{job.title || "N/A"}</p>
								</div>
							</div>
							<Button asChild size="sm" variant="ghost">
								<Link href={`/dashboard/work/${job.id}`}>View Job</Link>
							</Button>
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		// NEW: Payment Plan Schedule Section
		if (paymentPlanSchedule) {
			const plan = Array.isArray(paymentPlanSchedule.payment_plan)
				? paymentPlanSchedule.payment_plan[0]
				: paymentPlanSchedule.payment_plan;

			sections.push({
				id: "payment-plan",
				title: "Payment Plan",
				icon: <Calendar className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="space-y-4">
							<div className="bg-card rounded-lg border p-4">
								<Label className="mb-2 block text-xs">Plan Details</Label>
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">Plan Name:</span>
										<span className="text-sm font-medium">{plan?.name || "Payment Plan"}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">Total Amount:</span>
										<span className="text-sm font-medium">
											{formatCurrency(plan?.total_amount)}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">Total Payments:</span>
										<span className="text-sm font-medium">{plan?.number_of_payments || 0}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">This Payment:</span>
										<span className="text-sm font-medium">
											#{paymentPlanSchedule.installment_number} of {plan?.number_of_payments}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm">Due Date:</span>
										<span className="text-sm font-medium">
											{paymentPlanSchedule.due_date
												? new Date(paymentPlanSchedule.due_date).toLocaleDateString()
												: "-"}
										</span>
									</div>
								</div>
							</div>
							{plan?.invoice && (
								<Button asChild className="w-full" variant="outline">
									<Link href={`/dashboard/work/invoices/${plan.invoice.id}`}>
										View Related Invoice #{plan.invoice.invoice_number}
									</Link>
								</Button>
							)}
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		// NEW: Financing Provider Section
		if (financingProvider) {
			sections.push({
				id: "financing",
				title: "Financing Provider",
				icon: <DollarSign className="size-4" />,
				content: (
					<UnifiedAccordionContent>
						<div className="bg-card rounded-lg border p-4">
							<div className="space-y-3">
								<div>
									<Label className="text-xs">Provider Name</Label>
									<p className="text-sm font-medium">{financingProvider.name}</p>
								</div>
								<div>
									<Label className="text-xs">Type</Label>
									<Badge className="capitalize" variant="outline">
										{financingProvider.provider_type}
									</Badge>
								</div>
								{financingProvider.contact_email && (
									<div>
										<Label className="text-xs">Contact Email</Label>
										<a
											className="text-primary block text-sm hover:underline"
											href={`mailto:${financingProvider.contact_email}`}
										>
											{financingProvider.contact_email}
										</a>
									</div>
								)}
								{financingProvider.contact_phone && (
									<div>
										<Label className="text-xs">Contact Phone</Label>
										<a
											className="text-primary block text-sm hover:underline"
											href={`tel:${financingProvider.contact_phone}`}
										>
											{financingProvider.contact_phone}
										</a>
									</div>
								)}
							</div>
						</div>
					</UnifiedAccordionContent>
				),
			});
		}

		return sections;
	}, [payment, customer, invoice, job, paymentPlanSchedule, financingProvider]);

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

		if (invoice) {
			items.push({
				id: `invoice-${invoice.id}`,
				type: "invoice",
				title: `Invoice #${invoice.invoice_number || invoice.id.slice(0, 8)}`,
				subtitle: formatCurrency(invoice.total_amount),
				href: `/dashboard/work/invoices/${invoice.id}`,
				badge: invoice.status ? { label: invoice.status, variant: "outline" as const } : undefined,
			});
		}

		if (job) {
			items.push({
				id: `job-${job.id}`,
				type: "job",
				title: job.title || `Job #${job.job_number || job.id.slice(0, 8)}`,
				subtitle: job.status,
				href: `/dashboard/work/${job.id}`,
				badge: job.status ? { label: job.status, variant: "outline" as const } : undefined,
			});
		}

		return items;
	}, [customer, invoice, job]);

	return (
		<DetailPageContentLayout
			activities={activities}
			attachments={attachments}
			customHeader={customHeader}
			customSections={customSections}
			defaultOpenSection="payment-details"
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
