"use client";

/**
 * Maintenance Plans Page - Seamless Datatable Layout
 */

import { Calendar, Download, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTablePageHeader } from "@/components/ui/datatable-page-header";
import { MaintenancePlansTable, type MaintenancePlan } from "@/components/work/maintenance-plans-table";

// Mock data - replace with real data from database
const mockPlans: MaintenancePlan[] = [
	{
		id: "1",
		planName: "HVAC Premium",
		customer: "Acme Corp",
		serviceType: "HVAC Maintenance",
		frequency: "Quarterly",
		nextVisit: "Feb 15, 2025",
		monthlyFee: 19900,
		status: "active",
	},
	{
		id: "2",
		planName: "Electrical Plus",
		customer: "Tech Solutions",
		serviceType: "Electrical Inspection",
		frequency: "Monthly",
		nextVisit: "Feb 1, 2025",
		monthlyFee: 14900,
		status: "active",
	},
	{
		id: "3",
		planName: "Plumbing Basic",
		customer: "Global Industries",
		serviceType: "Plumbing Check",
		frequency: "Bi-Annual",
		nextVisit: "Mar 10, 2025",
		monthlyFee: 7900,
		status: "pending",
	},
	{
		id: "4",
		planName: "Fire Safety Pro",
		customer: "Summit LLC",
		serviceType: "Fire System Inspection",
		frequency: "Annual",
		nextVisit: "Apr 5, 2025",
		monthlyFee: 24900,
		status: "active",
	},
	{
		id: "5",
		planName: "Comprehensive Care",
		customer: "Downtown Retail LLC",
		serviceType: "Multi-System Maintenance",
		frequency: "Monthly",
		nextVisit: "Feb 10, 2025",
		monthlyFee: 39900,
		status: "active",
	},
	{
		id: "6",
		planName: "Seasonal Check",
		customer: "Medical Plaza Group",
		serviceType: "HVAC Seasonal Service",
		frequency: "Bi-Annual",
		nextVisit: "Mar 1, 2025",
		monthlyFee: 12900,
		status: "active",
	},
];

function formatCurrency(cents: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(cents / 100);
}

export default function MaintenancePlansPage() {
	// Calculate stats from data
	const totalPlans = mockPlans.length;
	const activePlans = mockPlans.filter((p) => p.status === "active").length;
	const enrolledCustomers = 189; // Mock value
	const monthlyRevenue = mockPlans
		.filter((p) => p.status === "active")
		.reduce((sum, p) => sum + p.monthlyFee, 0);

	// Count visits this month (mock calculation)
	const visitsThisMonth = 45; // Mock value

	return (
		<div className="flex h-full flex-col">
			<DataTablePageHeader
				title="Maintenance Plans"
				description="Manage recurring maintenance contracts and schedules"
				actions={
					<>
						<Button size="sm" variant="outline">
							<Upload className="mr-2 size-4" />
							Import
						</Button>
						<Button size="sm" variant="outline">
							<Download className="mr-2 size-4" />
							Export
						</Button>
						<Button asChild size="sm">
							<Link href="/dashboard/work/maintenance-plans/new">
								<Plus className="mr-2 size-4" />
								Create Plan
							</Link>
						</Button>
					</>
				}
				stats={
					<div className="mt-4 grid gap-3 md:grid-cols-4">
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium">Active Plans</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{activePlans}</div>
								<p className="text-xs text-muted-foreground">
									{totalPlans - activePlans} pending
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium">Enrolled Customers</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{enrolledCustomers}</div>
								<p className="text-xs text-muted-foreground">
									76% of active customers
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium">This Month</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{visitsThisMonth}</div>
								<p className="text-xs text-muted-foreground">Scheduled visits</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</div>
								<p className="text-xs text-muted-foreground">Recurring revenue</p>
							</CardContent>
						</Card>
					</div>
				}
			/>

			<div className="flex-1 overflow-hidden">
				<MaintenancePlansTable plans={mockPlans} itemsPerPage={50} />
			</div>
		</div>
	);
}
