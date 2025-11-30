import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign } from "lucide-react";
import { createWebClient } from "@/lib/supabase/web-client";
import { getAdminSession } from "@/lib/auth/session";
import { formatCurrencyFromDollars } from "@stratos/shared/utils/formatting";

/**
 * Finance Payments Page
 *
 * View all payments across the platform.
 */
async function PaymentsData() {
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

		const { data: payments } = await webDb
			.from("payments")
			.select("id, amount, status, payment_method, created_at, company_id, companies!inner(name)")
			.order("created_at", { ascending: false })
			.limit(100);

		if (!payments || payments.length === 0) {
			return (
				<div className="text-center py-8 text-muted-foreground">
					<DollarSign className="h-12 w-12 mx-auto mb-2 opacity-20" />
					<p>No payments found</p>
				</div>
			);
		}

		const totalAmount = payments
			.filter((p) => p.status === "completed")
			.reduce((sum, p) => sum + ((p.amount as number) || 0), 0);
		const completedCount = payments.filter((p) => p.status === "completed").length;
		const failedCount = payments.filter((p) => p.status === "failed").length;

		return (
			<div className="space-y-6">
				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card>
						<CardContent className="p-6">
							<p className="text-sm text-muted-foreground mb-2">Total Payments</p>
							<p className="text-2xl font-bold">{payments.length}</p>
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
							<p className="text-sm text-muted-foreground mb-2">Completed / Failed</p>
							<p className="text-2xl font-bold">
								{completedCount} / {failedCount}
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Payments List */}
				<Card>
					<CardContent className="p-6">
						<h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
						<div className="space-y-2">
							{payments.slice(0, 20).map((payment) => (
								<div
									key={payment.id}
									className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
								>
									<div>
										<p className="font-medium">
											{formatCurrencyFromDollars(((payment.amount as number) || 0) / 100)}
										</p>
										<p className="text-sm text-muted-foreground">
											{(payment.companies as any)?.name || "Unknown Company"}
										</p>
									</div>
									<div className="text-right">
										<p className="text-sm font-medium capitalize">{payment.status}</p>
										<p className="text-xs text-muted-foreground">
											{new Date(payment.created_at).toLocaleDateString()}
										</p>
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
					Failed to load payments: {error instanceof Error ? error.message : "Unknown error"}
				</p>
			</div>
		);
	}
}

export default function PaymentsPage() {
	return (
		<div className="flex flex-col">
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Payments</h1>
				<p className="text-muted-foreground text-sm">View all payments across the platform</p>
			</div>
			<Suspense fallback={<PaymentsSkeleton />}>
				<PaymentsData />
			</Suspense>
		</div>
	);
}

function PaymentsSkeleton() {
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

