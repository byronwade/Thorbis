"use client";

/**
 * Service Agreements Page - Seamless Datatable Layout
 */

import { Download, FileText, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTablePageHeader } from "@/components/ui/datatable-page-header";
import { ServiceAgreementsTable, type ServiceAgreement } from "@/components/work/service-agreements-table";

// Mock data - replace with real data from database
const mockAgreements: ServiceAgreement[] = [
	{
		id: "1",
		agreementNumber: "SLA-2025-001",
		customer: "Acme Corp",
		type: "Service Level Agreement",
		startDate: "Jan 1, 2025",
		endDate: "Dec 31, 2025",
		value: 2500000,
		status: "active",
	},
	{
		id: "2",
		agreementNumber: "SLA-2025-002",
		customer: "Tech Solutions",
		type: "Extended Warranty",
		startDate: "Jan 5, 2025",
		endDate: "Jan 4, 2027",
		value: 1250000,
		status: "active",
	},
	{
		id: "3",
		agreementNumber: "SLA-2025-003",
		customer: "Global Industries",
		type: "Maintenance Contract",
		startDate: "Feb 1, 2025",
		endDate: "Jan 31, 2026",
		value: 1875000,
		status: "pending",
	},
	{
		id: "4",
		agreementNumber: "SLA-2025-004",
		customer: "Summit LLC",
		type: "Service Level Agreement",
		startDate: "Mar 1, 2025",
		endDate: "Feb 28, 2026",
		value: 3500000,
		status: "active",
	},
	{
		id: "5",
		agreementNumber: "SLA-2025-005",
		customer: "Downtown Retail LLC",
		type: "Support Contract",
		startDate: "Jan 15, 2025",
		endDate: "Jan 14, 2026",
		value: 950000,
		status: "active",
	},
];

function formatCurrency(cents: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(cents / 100);
}

export default function ServiceAgreementsPage() {
	// Calculate stats from data
	const totalAgreements = mockAgreements.length;
	const activeAgreements = mockAgreements.filter((a) => a.status === "active").length;
	const pendingSignatures = mockAgreements.filter((a) => a.status === "pending").length;
	const totalValue = mockAgreements
		.filter((a) => a.status === "active")
		.reduce((sum, a) => sum + a.value, 0);

	// Mock values
	const expiringSoon = 8; // Agreements expiring in next 30 days

	return (
		<div className="flex h-full flex-col">
			<DataTablePageHeader
				title="Service Agreements"
				description="Manage customer service contracts and warranties"
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
							<Link href="/dashboard/work/service-agreements/new">
								<Plus className="mr-2 size-4" />
								Create Agreement
							</Link>
						</Button>
					</>
				}
				stats={
					<div className="mt-4 grid gap-3 md:grid-cols-4">
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium">Active Agreements</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{activeAgreements}</div>
								<p className="text-xs text-muted-foreground">
									{totalAgreements - activeAgreements} pending or expired
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium">Pending Signatures</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{pendingSignatures}</div>
								<p className="text-xs text-muted-foreground">Awaiting customer</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{expiringSoon}</div>
								<p className="text-xs text-muted-foreground">Within 30 days</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium">Total Value</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
								<p className="text-xs text-muted-foreground">Annual contract value</p>
							</CardContent>
						</Card>
					</div>
				}
			/>

			<div className="flex-1 overflow-hidden">
				<ServiceAgreementsTable agreements={mockAgreements} itemsPerPage={50} />
			</div>
		</div>
	);
}
