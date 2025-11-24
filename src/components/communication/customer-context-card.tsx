"use client";

/**
 * Customer Context Card
 *
 * Shows customer context during email composition:
 * - Recent jobs (last 3)
 * - Recent invoices (last 3)
 * - Outstanding balance
 * - Last service date
 * - Quick actions (view profile, call, schedule)
 */

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
	AlertCircle,
	Briefcase,
	Calendar,
	ChevronDown,
	ChevronUp,
	DollarSign,
	FileText,
	Loader2,
	Phone,
	User,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { getCustomerDisplayName } from "@/lib/utils/customer-display";

interface CustomerContextCardProps {
	customerId: string;
	className?: string;
}

type CustomerData = {
	id: string;
	first_name: string | null;
	last_name: string | null;
	display_name: string | null;
	email: string | null;
	phone: string | null;
	company_name: string | null;
};

type Job = {
	id: string;
	title: string;
	status: string;
	total_amount: number | null;
	scheduled_start: string | null;
	created_at: string;
};

type Invoice = {
	id: string;
	invoice_number: string;
	status: string;
	total_amount: number;
	due_date: string | null;
	created_at: string;
};

export function CustomerContextCard({
	customerId,
	className,
}: CustomerContextCardProps) {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [customer, setCustomer] = useState<CustomerData | null>(null);
	const [recentJobs, setRecentJobs] = useState<Job[]>([]);
	const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
	const [outstandingBalance, setOutstandingBalance] = useState(0);
	const [lastServiceDate, setLastServiceDate] = useState<string | null>(null);

	useEffect(() => {
		const fetchCustomerContext = async () => {
			setLoading(true);
			setError(null);

			try {
				const supabase = createClient();

				// Use Promise.all to fetch data in parallel instead of sequentially
				const [customerResult, jobsResult, invoicesResult] = await Promise.all([
					// Fetch customer basic info
					supabase
						.from("customers")
						.select("id, first_name, last_name, display_name, email, phone, company_name")
						.eq("id", customerId)
						.single(),
					// Fetch recent jobs (last 3)
					supabase
						.from("jobs")
						.select("id, title, status, total_amount, scheduled_start, created_at")
						.eq("customer_id", customerId)
						.order("created_at", { ascending: false })
						.limit(3),
					// Fetch recent invoices (last 3)
					supabase
						.from("invoices")
						.select("id, invoice_number, status, total_amount, due_date, created_at")
						.eq("customer_id", customerId)
						.order("created_at", { ascending: false })
						.limit(3),
				]);

				// Handle customer data
				if (customerResult.error) throw customerResult.error;
				setCustomer(customerResult.data);

				// Handle jobs data
				if (jobsResult.error) throw jobsResult.error;
				const jobsData = jobsResult.data || [];
				setRecentJobs(jobsData);

				// Get last service date from jobs
				if (jobsData.length > 0) {
					const completedJob = jobsData.find(
						(j) => j.status === "completed" || j.status === "invoiced"
					);
					if (completedJob?.scheduled_start) {
						setLastServiceDate(completedJob.scheduled_start);
					}
				}

				// Handle invoices data
				if (invoicesResult.error) throw invoicesResult.error;
				const invoicesData = invoicesResult.data || [];
				setRecentInvoices(invoicesData);

				// Calculate outstanding balance (unpaid and overdue invoices)
				const unpaid = invoicesData
					.filter((inv) => inv.status === "sent" || inv.status === "overdue")
					.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
				setOutstandingBalance(unpaid);
			} catch (err) {
				console.error("Error fetching customer context:", err);
				setError("Failed to load customer information");
			} finally {
				setLoading(false);
			}
		};

		fetchCustomerContext();
	}, [customerId]);

	if (loading) {
		return (
			<Card className={className}>
				<CardHeader className="pb-3">
					<CardTitle className="text-sm flex items-center gap-2">
						<User className="h-4 w-4" />
						Customer Context
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error || !customer) {
		return (
			<Card className={className}>
				<CardHeader className="pb-3">
					<CardTitle className="text-sm flex items-center gap-2">
						<User className="h-4 w-4" />
						Customer Context
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>
							{error || "Customer not found"}
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	// Memoize customer name to avoid recalculating on every render
	const customerName = useMemo(
		() => getCustomerDisplayName(customer),
		[customer]
	);

	return (
		<Card className={className}>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<User className="h-4 w-4" />
						<CardTitle className="text-sm">{customerName}</CardTitle>
					</div>
					<Button
						variant="ghost"
						size="sm"
						className="h-6 w-6 p-0"
						onClick={() => setIsCollapsed(!isCollapsed)}
					>
						{isCollapsed ? (
							<ChevronDown className="h-4 w-4" />
						) : (
							<ChevronUp className="h-4 w-4" />
						)}
					</Button>
				</div>
				{customer.company_name && (
					<CardDescription className="text-xs">
						{customer.company_name}
					</CardDescription>
				)}
			</CardHeader>

			{!isCollapsed && (
				<CardContent className="space-y-4">
					{/* Outstanding Balance Alert */}
					{outstandingBalance > 0 && (
						<Alert>
							<DollarSign className="h-4 w-4" />
							<AlertDescription className="text-xs">
								Outstanding balance: {formatCurrency(outstandingBalance)}
							</AlertDescription>
						</Alert>
					)}

					{/* Last Service Date */}
					{lastServiceDate && (
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<Calendar className="h-3.5 w-3.5" />
							<span>Last service: {formatDate(lastServiceDate, "short")}</span>
						</div>
					)}

					{/* Recent Jobs */}
					{recentJobs.length > 0 && (
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<h4 className="text-xs font-semibold flex items-center gap-1.5">
									<Briefcase className="h-3.5 w-3.5" />
									Recent Jobs
								</h4>
								<Link
									href={`/dashboard/customers/${customerId}?tab=jobs`}
									className="text-xs text-primary hover:underline"
								>
									View All
								</Link>
							</div>
							<div className="space-y-1.5">
								{recentJobs.map((job) => (
									<Link
										key={job.id}
										href={`/dashboard/work/${job.id}`}
										className="block p-2 rounded-md hover:bg-muted/50 transition-colors"
									>
										<div className="flex items-start justify-between gap-2">
											<div className="flex-1 min-w-0">
												<p className="text-xs font-medium truncate">
													{job.title || "Untitled Job"}
												</p>
												<p className="text-xs text-muted-foreground">
													{formatDate(job.created_at, "short")}
												</p>
											</div>
											<div className="text-right shrink-0">
												<Badge variant="outline" className="text-xs h-5">
													{job.status}
												</Badge>
												{job.total_amount && (
													<p className="text-xs font-semibold mt-0.5">
														{formatCurrency(job.total_amount)}
													</p>
												)}
											</div>
										</div>
									</Link>
								))}
							</div>
						</div>
					)}

					{/* Recent Invoices */}
					{recentInvoices.length > 0 && (
						<>
							<Separator />
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<h4 className="text-xs font-semibold flex items-center gap-1.5">
										<FileText className="h-3.5 w-3.5" />
										Recent Invoices
									</h4>
									<Link
										href={`/dashboard/customers/${customerId}?tab=invoices`}
										className="text-xs text-primary hover:underline"
									>
										View All
									</Link>
								</div>
								<div className="space-y-1.5">
									{recentInvoices.map((invoice) => (
										<Link
											key={invoice.id}
											href={`/dashboard/work/invoices/${invoice.id}`}
											className="block p-2 rounded-md hover:bg-muted/50 transition-colors"
										>
											<div className="flex items-start justify-between gap-2">
												<div className="flex-1 min-w-0">
													<p className="text-xs font-medium">
														#{invoice.invoice_number}
													</p>
													<p className="text-xs text-muted-foreground">
														{invoice.due_date
															? `Due ${formatDate(invoice.due_date, "short")}`
															: formatDate(invoice.created_at, "short")}
													</p>
												</div>
												<div className="text-right shrink-0">
													<Badge
														variant={
															invoice.status === "paid"
																? "default"
																: invoice.status === "overdue"
																	? "destructive"
																	: "outline"
														}
														className="text-xs h-5"
													>
														{invoice.status}
													</Badge>
													<p className="text-xs font-semibold mt-0.5">
														{formatCurrency(invoice.total_amount)}
													</p>
												</div>
											</div>
										</Link>
									))}
								</div>
							</div>
						</>
					)}

					{/* Quick Actions */}
					<Separator />
					<div className="flex items-center gap-2">
						<Button asChild size="sm" variant="outline" className="flex-1 h-8 text-xs">
							<Link href={`/dashboard/customers/${customerId}`}>
								<User className="mr-1.5 h-3.5 w-3.5" />
								View Profile
							</Link>
						</Button>
						{customer.phone && (
							<Button asChild size="sm" variant="outline" className="flex-1 h-8 text-xs">
								<Link href={`tel:${customer.phone}`}>
									<Phone className="mr-1.5 h-3.5 w-3.5" />
									Call
								</Link>
							</Button>
						)}
						<Button asChild size="sm" variant="outline" className="flex-1 h-8 text-xs">
							<Link href={`/dashboard/schedule/new?customerId=${customerId}`}>
								<Calendar className="mr-1.5 h-3.5 w-3.5" />
								Schedule
							</Link>
						</Button>
					</div>

					{/* Empty States */}
					{recentJobs.length === 0 && recentInvoices.length === 0 && (
						<div className="text-center py-6">
							<p className="text-xs text-muted-foreground">
								No recent activity with this customer
							</p>
						</div>
					)}
				</CardContent>
			)}
		</Card>
	);
}
