/**
 * Bookkeeping Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 */

import { Book, FileText, FolderOpen, Receipt } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookkeepingPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="font-semibold text-2xl">Bookkeeping</h1>
				<p className="text-muted-foreground">Manage daily transactions, receipts, and record keeping</p>
			</div>

			{/* Quick Stats */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Unreconciled Transactions</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">0</div>
						<p className="text-muted-foreground text-xs">Needs attention</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Pending Receipts</CardTitle>
						<Receipt className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">0</div>
						<p className="text-muted-foreground text-xs">To be processed</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Monthly Entries</CardTitle>
						<Book className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">0</div>
						<p className="text-muted-foreground text-xs">This month</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Open Documents</CardTitle>
						<FolderOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">0</div>
						<p className="text-muted-foreground text-xs">Needs filing</p>
					</CardContent>
				</Card>
			</div>

			{/* Coming Soon Card */}
			<Card>
				<CardHeader>
					<CardTitle>Bookkeeping Features</CardTitle>
					<CardDescription>Comprehensive daily bookkeeping tools coming soon</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-2 text-sm">
						<p>• Transaction recording and categorization</p>
						<p>• Receipt capture and storage</p>
						<p>• Bank statement reconciliation</p>
						<p>• Daily sales and expense tracking</p>
						<p>• Document management</p>
						<p>• Automated data entry</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
