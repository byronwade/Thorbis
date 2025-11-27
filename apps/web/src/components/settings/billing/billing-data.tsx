import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
	Mail,
	MessageSquare,
	Phone,
	PhoneIncoming,
	PhoneOutgoing,
	Bot,
	Mic,
	HardDrive,
	Cpu,
	DollarSign,
	TrendingUp,
	Calendar,
} from "lucide-react";
import {
	PRICING_CONFIG,
	formatCentsToDollars,
	getCurrentMonthYear,
} from "@/lib/billing/pricing";

// ============================================
// Data Fetching
// ============================================

const getBillingData = cache(async (companyId: string, monthYear: string) => {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("billing_usage")
		.select("*")
		.eq("company_id", companyId)
		.eq("month_year", monthYear)
		.single();

	if (error && error.code !== "PGRST116") {
		console.error("[Billing] Failed to fetch billing data:", error.message);
	}

	return data;
});

const getBillingHistory = cache(async (companyId: string, months: number = 6) => {
	const supabase = await createClient();

	// Generate list of month-year strings
	const monthYears: string[] = [];
	const now = new Date();
	for (let i = 0; i < months; i++) {
		const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
		monthYears.push(
			`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
		);
	}

	const { data, error } = await supabase
		.from("billing_usage")
		.select("month_year, grand_total_cents, total_billable_cost_cents")
		.eq("company_id", companyId)
		.in("month_year", monthYears)
		.order("month_year", { ascending: true });

	if (error) {
		console.error("[Billing] Failed to fetch billing history:", error.message);
		return [];
	}

	return data || [];
});

// ============================================
// Components
// ============================================

interface UsageItemProps {
	icon: React.ElementType;
	label: string;
	quantity: number;
	unit: string;
	cost: number;
	providerPrice: string;
	customerPrice: string;
}

function UsageItem({
	icon: Icon,
	label,
	quantity,
	unit,
	cost,
	providerPrice,
	customerPrice,
}: UsageItemProps) {
	return (
		<div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
			<div className="flex items-center gap-3">
				<div className="p-2 rounded-lg bg-muted">
					<Icon className="h-4 w-4 text-muted-foreground" />
				</div>
				<div>
					<p className="font-medium">{label}</p>
					<p className="text-xs text-muted-foreground">
						{customerPrice}/{unit}
					</p>
				</div>
			</div>
			<div className="text-right">
				<p className="font-semibold">{formatCentsToDollars(cost)}</p>
				<p className="text-xs text-muted-foreground">
					{quantity.toLocaleString()} {unit}
					{quantity !== 1 ? "s" : ""}
				</p>
			</div>
		</div>
	);
}

function BillingSkeleton() {
	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-3">
				{[1, 2, 3].map((i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<div className="animate-pulse space-y-3">
								<div className="h-4 w-24 bg-muted rounded" />
								<div className="h-8 w-32 bg-muted rounded" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}

function EmptyBillingState() {
	return (
		<Card>
			<CardContent className="flex flex-col items-center justify-center py-12">
				<DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
				<h3 className="text-lg font-semibold mb-2">No Usage This Month</h3>
				<p className="text-muted-foreground text-center max-w-md">
					Your usage-based charges will appear here as you use communication,
					AI, and storage features.
				</p>
			</CardContent>
		</Card>
	);
}

// ============================================
// Main Component
// ============================================

export async function BillingData() {
	const user = await getCurrentUser();
	if (!user?.company_id) {
		return <EmptyBillingState />;
	}

	const currentMonth = getCurrentMonthYear();
	const [billing, history] = await Promise.all([
		getBillingData(user.company_id, currentMonth),
		getBillingHistory(user.company_id, 6),
	]);

	if (!billing) {
		return <EmptyBillingState />;
	}

	const monthName = new Date(
		parseInt(currentMonth.split("-")[0]),
		parseInt(currentMonth.split("-")[1]) - 1,
	).toLocaleString("default", { month: "long", year: "numeric" });

	return (
		<div className="space-y-6">
			{/* Summary Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-2 text-muted-foreground mb-2">
							<Calendar className="h-4 w-4" />
							<span className="text-sm">Current Period</span>
						</div>
						<p className="text-2xl font-bold">{monthName}</p>
						<p className="text-xs text-muted-foreground mt-1">
							Last updated:{" "}
							{billing.last_aggregated_at
								? new Date(billing.last_aggregated_at).toLocaleString()
								: "Never"}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-2 text-muted-foreground mb-2">
							<DollarSign className="h-4 w-4" />
							<span className="text-sm">Base Fee</span>
						</div>
						<p className="text-2xl font-bold">
							{formatCentsToDollars(billing.base_fee_cents)}
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							Unlimited users & core features
						</p>
					</CardContent>
				</Card>

				<Card className="bg-primary text-primary-foreground">
					<CardContent className="p-6">
						<div className="flex items-center gap-2 opacity-80 mb-2">
							<TrendingUp className="h-4 w-4" />
							<span className="text-sm">Total Due</span>
						</div>
						<p className="text-2xl font-bold">
							{formatCentsToDollars(billing.grand_total_cents)}
						</p>
						<p className="text-xs opacity-80 mt-1">
							Base {formatCentsToDollars(billing.base_fee_cents)} + Usage{" "}
							{formatCentsToDollars(billing.total_billable_cost_cents)}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Usage Breakdown */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Communications */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<Phone className="h-5 w-5" />
							Communications
						</CardTitle>
						<CardDescription>
							Email, SMS, and voice call usage
						</CardDescription>
					</CardHeader>
					<CardContent>
						<UsageItem
							icon={Mail}
							label="Emails Sent"
							quantity={billing.emails_sent}
							unit="email"
							cost={billing.billable_cost_emails_cents}
							providerPrice="$0.0001"
							customerPrice="$0.0003"
						/>
						<UsageItem
							icon={MessageSquare}
							label="SMS Messages"
							quantity={billing.sms_sent}
							unit="message"
							cost={billing.billable_cost_sms_cents}
							providerPrice="$0.008"
							customerPrice="$0.024"
						/>
						<UsageItem
							icon={PhoneIncoming}
							label="Inbound Calls"
							quantity={billing.call_minutes_inbound}
							unit="minute"
							cost={billing.billable_cost_calls_inbound_cents}
							providerPrice="$0.004"
							customerPrice="$0.012"
						/>
						<UsageItem
							icon={PhoneOutgoing}
							label="Outbound Calls"
							quantity={billing.call_minutes_outbound}
							unit="minute"
							cost={billing.billable_cost_calls_outbound_cents}
							providerPrice="$0.01"
							customerPrice="$0.03"
						/>

						<div className="mt-4 pt-4 border-t flex justify-between">
							<span className="text-muted-foreground">Subtotal</span>
							<span className="font-semibold">
								{formatCentsToDollars(
									billing.billable_cost_emails_cents +
										billing.billable_cost_sms_cents +
										billing.billable_cost_calls_inbound_cents +
										billing.billable_cost_calls_outbound_cents,
								)}
							</span>
						</div>
					</CardContent>
				</Card>

				{/* AI & Infrastructure */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<Bot className="h-5 w-5" />
							AI & Infrastructure
						</CardTitle>
						<CardDescription>
							AI assistant, storage, and automation
						</CardDescription>
					</CardHeader>
					<CardContent>
						<UsageItem
							icon={Bot}
							label="AI Chats"
							quantity={billing.ai_chats}
							unit="chat"
							cost={billing.billable_cost_ai_chats_cents}
							providerPrice="$0.05"
							customerPrice="$0.15"
						/>
						<UsageItem
							icon={Mic}
							label="AI Phone Answering"
							quantity={billing.ai_phone_minutes}
							unit="minute"
							cost={billing.billable_cost_ai_phone_cents}
							providerPrice="$0.06"
							customerPrice="$0.18"
						/>
						<UsageItem
							icon={HardDrive}
							label="Storage"
							quantity={Math.round((billing.storage_bytes / 1073741824) * 100) / 100}
							unit="GB"
							cost={billing.billable_cost_storage_cents}
							providerPrice="$0.09"
							customerPrice="$0.27"
						/>
						<UsageItem
							icon={Cpu}
							label="Automation"
							quantity={Math.ceil(billing.automation_executions / 100000 * 100) / 100}
							unit="unit"
							cost={billing.billable_cost_automation_cents}
							providerPrice="$3.00"
							customerPrice="$9.00"
						/>

						<div className="mt-4 pt-4 border-t flex justify-between">
							<span className="text-muted-foreground">Subtotal</span>
							<span className="font-semibold">
								{formatCentsToDollars(
									billing.billable_cost_ai_chats_cents +
										billing.billable_cost_ai_phone_cents +
										billing.billable_cost_storage_cents +
										billing.billable_cost_automation_cents,
								)}
							</span>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Cost Savings */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Provider Cost vs Your Price</CardTitle>
					<CardDescription>
						We charge 3x provider cost (200% markup) - transparent pricing
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<span>Provider Cost</span>
							<span className="text-muted-foreground">
								{formatCentsToDollars(billing.total_provider_cost_cents)}
							</span>
						</div>
						<div className="flex justify-between items-center">
							<span>Your Usage Price (3x)</span>
							<span className="font-semibold">
								{formatCentsToDollars(billing.total_billable_cost_cents)}
							</span>
						</div>
						<Progress
							value={
								billing.total_billable_cost_cents > 0
									? (billing.total_provider_cost_cents /
											billing.total_billable_cost_cents) *
										100
									: 0
							}
							className="h-2"
						/>
						<p className="text-xs text-muted-foreground">
							Our markup covers infrastructure, support, and platform features.
							No hidden fees.
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Billing History */}
			{history.length > 1 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Billing History</CardTitle>
						<CardDescription>Your monthly totals</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{history.map((month) => {
								const [year, monthNum] = month.month_year.split("-");
								const monthName = new Date(
									parseInt(year),
									parseInt(monthNum) - 1,
								).toLocaleString("default", { month: "short", year: "numeric" });

								return (
									<div
										key={month.month_year}
										className="flex justify-between items-center py-2 border-b border-border/50 last:border-0"
									>
										<span>{monthName}</span>
										<div className="flex items-center gap-3">
											<span className="text-xs text-muted-foreground">
												Usage: {formatCentsToDollars(month.total_billable_cost_cents)}
											</span>
											<Badge variant="outline">
												{formatCentsToDollars(month.grand_total_cents)}
											</Badge>
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
