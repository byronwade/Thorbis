/**
 * Job Invoices Section
 * Displays list of invoices linked to this job
 */

"use client";

import { ChevronRight, Receipt } from "lucide-react";
import Link from "next/link";
import { updateEntityTags } from "@/actions/entity-tags";
import { EntityTags } from "@/components/shared/tags/entity-tags";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type JobInvoicesProps = {
	invoices: any[];
	jobId: string;
};

export function JobInvoices({ invoices, jobId }: JobInvoicesProps) {
	const formatCurrency = (amount: number | null | undefined): string => {
		if (amount === null || amount === undefined) {
			return "$0.00";
		}
		// Handle both cents and dollar amounts
		const value = amount > 1000 ? amount / 100 : amount;
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(value);
	};

	const formatDate = (dateString: string | null) => {
		if (!dateString) {
			return "—";
		}
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const getStatusVariant = (status: string) => {
		const statusMap: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
			draft: "outline",
			sent: "secondary",
			paid: "default",
			partial: "secondary",
			overdue: "destructive",
			cancelled: "destructive",
		};
		return statusMap[status] || "outline";
	};

	if (invoices.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Receipt className="mb-4 size-12 text-muted-foreground" />
				<h3 className="mb-2 font-semibold text-lg">No Invoices</h3>
				<p className="mb-4 text-muted-foreground text-sm">Create an invoice for this job to bill the customer.</p>
				<Button asChild size="sm">
					<Link href={`/dashboard/work/invoices/new?jobId=${jobId}`}>Create Invoice</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="overflow-x-auto rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Invoice #</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Balance</TableHead>
							<TableHead>Due Date</TableHead>
							<TableHead>Tags</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{invoices.map((invoice) => (
							<TableRow key={invoice.id}>
								<TableCell className="font-medium">#{invoice.invoice_number || invoice.id.slice(0, 8)}</TableCell>
								<TableCell>
									<Badge variant={getStatusVariant(invoice.status)}>{invoice.status || "draft"}</Badge>
								</TableCell>
								<TableCell>{formatCurrency(invoice.total_amount || invoice.total)}</TableCell>
								<TableCell>{formatCurrency(invoice.balance_amount || invoice.balance || 0)}</TableCell>
								<TableCell>{formatDate(invoice.due_date)}</TableCell>
								<TableCell className="max-w-[280px] align-top">
									<EntityTags
										entityId={invoice.id}
										entityType="invoice"
										onUpdateTags={(id, tags) => updateEntityTags("invoice", id, tags)}
										tags={Array.isArray(invoice?.metadata?.tags) ? (invoice.metadata.tags as any[]) : []}
									/>
								</TableCell>
								<TableCell className="text-right">
									<Button asChild size="sm" variant="ghost">
										<Link href={`/dashboard/work/invoices/${invoice.id}`}>
											View
											<ChevronRight className="ml-1 size-4" />
										</Link>
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Summary */}
			<div className="grid gap-4 md:grid-cols-3">
				<div className="rounded-md bg-muted/50 p-4">
					<p className="font-medium text-sm">Total Invoiced</p>
					<p className="mt-1 font-bold text-2xl">
						{formatCurrency(invoices.reduce((sum, inv) => sum + (inv.total_amount || inv.total || 0), 0))}
					</p>
				</div>
				<div className="rounded-md bg-muted/50 p-4">
					<p className="font-medium text-sm">Paid</p>
					<p className="mt-1 font-bold text-2xl">
						{formatCurrency(invoices.reduce((sum, inv) => sum + (inv.paid_amount || 0), 0))}
					</p>
				</div>
				<div className="rounded-md bg-muted/50 p-4">
					<p className="font-medium text-sm">Balance Due</p>
					<p className="mt-1 font-bold text-2xl">
						{formatCurrency(invoices.reduce((sum, inv) => sum + (inv.balance_amount || inv.balance || 0), 0))}
					</p>
				</div>
			</div>

			{/* Create New Button */}
			<Button asChild className="w-full" size="sm" variant="outline">
				<Link href={`/dashboard/work/invoices/new?jobId=${jobId}`}>Create New Invoice</Link>
			</Button>
		</div>
	);
}
