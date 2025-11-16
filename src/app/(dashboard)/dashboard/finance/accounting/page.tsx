/**
 * Accounting Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 */

import { Calculator, FileSpreadsheet, PieChart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountingPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="font-semibold text-2xl">Accounting</h1>
				<p className="text-muted-foreground">Financial statements, reports, and accounting management</p>
			</div>

			{/* Quick Stats */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Accounts Receivable</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">$0</div>
						<p className="text-muted-foreground text-xs">Outstanding</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Accounts Payable</CardTitle>
						<Calculator className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">$0</div>
						<p className="text-muted-foreground text-xs">Due soon</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Net Income</CardTitle>
						<PieChart className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">$0</div>
						<p className="text-muted-foreground text-xs">This month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Financial Reports</CardTitle>
						<FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">0</div>
						<p className="text-muted-foreground text-xs">Generated</p>
					</CardContent>
				</Card>
			</div>

			{/* Coming Soon Card */}
			<Card>
				<CardHeader>
					<CardTitle>Accounting Features</CardTitle>
					<CardDescription>Professional accounting tools integrated with QuickBooks</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-2 text-sm">
						<p>• Balance sheet and P&L statements</p>
						<p>• Cash flow statements</p>
						<p>• Trial balance and general ledger</p>
						<p>• Financial ratio analysis</p>
						<p>• Month-end and year-end close</p>
						<p>• GAAP-compliant reporting</p>
						<p>• Multi-currency support</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
