"use client";

/**
 * Invoices Page - Seamless Datatable Layout with inline statistics
 */

import { InvoicesTable, type Invoice } from "@/components/work/invoices-table";
import { StatsCards, type StatCard } from "@/components/ui/stats-cards";

// Mock data - replace with real data from database
const mockInvoices: Invoice[] = [
	{
		id: "1",
		invoiceNumber: "INV-2025-001",
		customer: "Acme Corp",
		date: "Jan 15, 2025",
		dueDate: "Feb 14, 2025",
		amount: 250_000,
		status: "paid",
	},
	{
		id: "2",
		invoiceNumber: "INV-2025-002",
		customer: "Tech Solutions",
		date: "Jan 18, 2025",
		dueDate: "Feb 17, 2025",
		amount: 375_000,
		status: "pending",
	},
	{
		id: "3",
		invoiceNumber: "INV-2025-003",
		customer: "Global Industries",
		date: "Jan 20, 2025",
		dueDate: "Feb 19, 2025",
		amount: 120_000,
		status: "draft",
	},
	{
		id: "4",
		invoiceNumber: "INV-2025-004",
		customer: "Summit LLC",
		date: "Jan 22, 2025",
		dueDate: "Feb 21, 2025",
		amount: 580_000,
		status: "pending",
	},
	{
		id: "5",
		invoiceNumber: "INV-2025-005",
		customer: "Mountain View Co",
		date: "Jan 10, 2025",
		dueDate: "Feb 9, 2025",
		amount: 100_000,
		status: "overdue",
	},
	{
		id: "6",
		invoiceNumber: "INV-2025-006",
		customer: "Pacific Corp",
		date: "Jan 25, 2025",
		dueDate: "Feb 24, 2025",
		amount: 425_000,
		status: "paid",
	},
	{
		id: "7",
		invoiceNumber: "INV-2025-007",
		customer: "Downtown Services",
		date: "Jan 28, 2025",
		dueDate: "Feb 27, 2025",
		amount: 195_000,
		status: "pending",
	},
];

// Invoice statistics data
const invoiceStats: StatCard[] = [
	{
		label: "Total Invoiced",
		value: "$20.45M",
		change: 8.2,
		changeLabel: "vs last month",
	},
	{
		label: "Paid",
		value: "$6.75M",
		change: 12.5,
		changeLabel: "vs last month",
	},
	{
		label: "Pending",
		value: "$11.8M",
		change: 3.4,
		changeLabel: "vs last month",
	},
	{
		label: "Overdue",
		value: "$1.0M",
		change: -15.3,
		changeLabel: "vs last month",
	},
	{
		label: "This Month",
		value: 7,
		change: 16.7,
		changeLabel: "vs last month",
	},
];

export default function InvoicesPage() {
	return (
		<>
			{/* Statistics - Full width, no padding */}
			<StatsCards stats={invoiceStats} />

			{/* Full-width seamless table (no padding) */}
			<div>
				<InvoicesTable invoices={mockInvoices} itemsPerPage={50} />
			</div>
		</>
	);
}
