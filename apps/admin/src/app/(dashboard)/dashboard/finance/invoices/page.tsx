import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";
import { createWebClient } from "@/lib/supabase/web-client";
import { getAdminSession } from "@/lib/auth/session";
import { formatCurrencyFromDollars } from "@stratos/shared/utils/formatting";

/**
 * Finance Invoices Page
 *
 * View all invoices across the platform.
 */
async function InvoicesData() {
	const session = await getAdminSession();
	if (!session) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">Unauthorized</p>
			</div>
		);
	}

	try {
		const webDb = createWebClient();

		const { data: invoices } = await webDb
			.from("invoices")
			.select("id, invoice_number, total_amount, status, due_date, created_at, company_id, companies!inner(name)")
			.order("created_at", { ascending: false })
			.limit(100);

		if (!invoices || invoices.length === 0) {
			return (
				<div className="text-center py-8 text-muted-foreground">
					<FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
					<p>No invoices found</p>
				</div>
			);
		}

		const totalAmount = invoices.reduce((sum, inv) => sum + ((inv.total_amount as number) || 0), 0);
		const paidCount = invoices.filter((inv) => inv.status === "paid").length;
		const unpaidCount = invoices.filter((inv) => inv.status === "unpaid").length;

		return (
			<div className="space-y-6">
				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card>
						<CardContent className="p-6">
							<p className="text-sm text-muted-foreground mb-2">Total Invoices</p>
							<p className="text-2xl font-bold">{invoices.length}</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<p className="text-sm text-muted-foreground mb-2">Total Amount</p>
							<p className="text-2xl font-bold">
								{formatCurrencyFromDollars(totalAmount / 100, { decimals: 0 })}
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<p className="text-sm text-muted-foreground mb-2">Paid / Unpaid</p>
							<p className="text-2xl font-bold">
								{paidCount} / {unpaidCount}
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Invoices List */}
				<Card>
					<CardContent className="p-6">
						<h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
						<div className="space-y-2">
							{invoices.slice(0, 20).map((invoice) => (
								<div
									key={invoice.id}
									className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
								>
									<div>
										<p className="font-medium">#{invoice.invoice_number}</p>
										<p className="text-sm text-muted-foreground">
											{(invoice.companies as any)?.name || "Unknown Company"}
										</p>
									</div>
									<div className="text-right">
										<p className="font-bold">
											{formatCurrencyFromDollars(((invoice.total_amount as number) || 0) / 100)}
										</p>
										<p className="text-xs text-muted-foreground capitalize">{invoice.status}</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		);
	} catch (error) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
				<p className="text-sm text-destructive">
					Failed to load invoices: {error instanceof Error ? error.message : "Unknown error"}
				</p>
			</div>
		);
	}
}

export default function InvoicesPage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
				<p className="text-muted-foreground text-sm">View all invoices across the platform</p>
			</div>
			<Suspense fallback={<InvoicesSkeleton />}>
				<InvoicesData />
			</Suspense>
		</div>
	);
}

function InvoicesSkeleton() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{Array.from({ length: 3 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<Skeleton className="h-4 w-24 mb-2" />
							<Skeleton className="h-8 w-16" />
						</CardContent>
					</Card>
				))}
			</div>
			<Card>
				<CardContent className="p-6">
					<Skeleton className="h-6 w-48 mb-4" />
					<div className="space-y-2">
						{Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-16 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

