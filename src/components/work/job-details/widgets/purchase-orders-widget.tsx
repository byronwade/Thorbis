/**
 * Purchase Orders Widget - Server Component
 *
 * Displays purchase orders related to the job with status tracking, vendor info, and delivery dates.
 * Critical for procurement and job cost tracking.
 *
 * Performance optimizations:
 * - Server Component by default
 * - Static content rendered on server
 * - Minimal JavaScript to client
 */

import {
	AlertCircle,
	CheckCircle2,
	ExternalLink,
	FileText,
	Package,
	Truck,
	XCircle,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Job } from "@/lib/db/schema";
import { formatCurrency, formatDate } from "@/lib/formatters";

type PurchaseOrdersWidgetProps = {
	job: Job;
};

// Mock purchase order type (in production, fetch from purchase_orders table)
type PurchaseOrder = {
	id: string;
	poNumber: string;
	vendor: string;
	status:
		| "draft"
		| "sent"
		| "confirmed"
		| "shipped"
		| "delivered"
		| "cancelled";
	orderDate: Date;
	expectedDelivery?: Date;
	actualDelivery?: Date;
	totalAmount: number;
	itemCount: number;
	notes?: string;
	trackingNumber?: string;
};

export function PurchaseOrdersWidget({ job }: PurchaseOrdersWidgetProps) {
	// Mock purchase orders (in production, fetch from database)
	const purchaseOrders: PurchaseOrder[] = [
		{
			id: "1",
			poNumber: "PO-2025-0042",
			vendor: "HVAC Supply Co.",
			status: "delivered",
			orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
			expectedDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
			actualDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
			totalAmount: 4237.5,
			itemCount: 5,
			trackingNumber: "1Z999AA1234567890",
		},
		{
			id: "2",
			poNumber: "PO-2025-0043",
			vendor: "Tech Distributors",
			status: "shipped",
			orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
			expectedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
			totalAmount: 335.0,
			itemCount: 2,
			trackingNumber: "1Z999AA9876543210",
			notes: "Signature required on delivery",
		},
		{
			id: "3",
			poNumber: "PO-2025-0044",
			vendor: "HVAC Supply Co.",
			status: "sent",
			orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
			expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
			totalAmount: 85.0,
			itemCount: 1,
			notes: "Back-ordered item",
		},
	];

	const statusConfig = {
		draft: {
			label: "Draft",
			icon: FileText,
			color: "text-muted-foreground",
			bgColor: "bg-muted dark:bg-foreground",
			variant: "outline" as const,
		},
		sent: {
			label: "Sent",
			icon: FileText,
			color: "text-primary",
			bgColor: "bg-primary dark:bg-primary",
			variant: "secondary" as const,
		},
		confirmed: {
			label: "Confirmed",
			icon: CheckCircle2,
			color: "text-success",
			bgColor: "bg-success dark:bg-success",
			variant: "default" as const,
		},
		shipped: {
			label: "Shipped",
			icon: Truck,
			color: "text-accent-foreground",
			bgColor: "bg-accent dark:bg-accent",
			variant: "secondary" as const,
		},
		delivered: {
			label: "Delivered",
			icon: CheckCircle2,
			color: "text-success",
			bgColor: "bg-success dark:bg-success",
			variant: "default" as const,
		},
		cancelled: {
			label: "Cancelled",
			icon: XCircle,
			color: "text-destructive",
			bgColor: "bg-destructive dark:bg-destructive",
			variant: "destructive" as const,
		},
	};

	// Calculate totals and progress
	const totalAmount = purchaseOrders.reduce(
		(sum, po) => sum + po.totalAmount,
		0,
	);
	const deliveredOrders = purchaseOrders.filter(
		(po) => po.status === "delivered",
	).length;
	const totalOrders = purchaseOrders.length;
	const progressPercentage =
		totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

	function getDaysUntil(date?: Date): string {
		if (!date) {
			return "";
		}
		const diffMs = date.getTime() - Date.now();
		const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

		if (diffDays < 0) {
			return `${Math.abs(diffDays)}d overdue`;
		}
		if (diffDays === 0) {
			return "today";
		}
		if (diffDays === 1) {
			return "tomorrow";
		}
		return `in ${diffDays}d`;
	}

	if (purchaseOrders.length === 0) {
		return (
			<div className="flex min-h-[200px] items-center justify-center text-center">
				<div>
					<Package className="text-muted-foreground mx-auto mb-2 size-8 opacity-50" />
					<p className="text-muted-foreground mb-2 text-sm">
						No purchase orders yet
					</p>
					<Button asChild size="sm" variant="outline">
						<Link href={`/dashboard/work/purchase-orders?jobId=${job.id}`}>
							<FileText className="mr-2 size-4" />
							Create Purchase Order
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h4 className="text-sm font-semibold">Purchase Orders</h4>
				<Badge className="text-xs" variant="secondary">
					{deliveredOrders}/{totalOrders} delivered
				</Badge>
			</div>

			{/* Progress */}
			<div className="space-y-2">
				<div className="flex items-center justify-between text-xs">
					<span className="text-muted-foreground">Delivery Progress</span>
					<span className="font-medium">{Math.round(progressPercentage)}%</span>
				</div>
				<Progress className="h-2" value={progressPercentage} />
			</div>

			{/* Total Amount */}
			<div className="from-primary/5 to-primary/10 rounded-lg bg-gradient-to-br p-3">
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground text-sm">Total PO Amount</span>
					<span className="text-lg font-bold">
						{formatCurrency(totalAmount)}
					</span>
				</div>
			</div>

			<Separator />

			{/* Purchase Orders List */}
			<div className="space-y-3">
				{purchaseOrders.map((po) => {
					const config = statusConfig[po.status];
					const Icon = config.icon;
					const isOverdue =
						po.expectedDelivery &&
						po.expectedDelivery.getTime() < Date.now() &&
						po.status !== "delivered";

					return (
						<div className="space-y-2 rounded-lg border p-3" key={po.id}>
							{/* PO Header */}
							<div className="flex items-start justify-between gap-2">
								<div className="flex items-start gap-2">
									<div className={`rounded-full p-1.5 ${config.bgColor}`}>
										<Icon className={`size-4 ${config.color}`} />
									</div>
									<div>
										<h5 className="font-mono text-sm font-semibold">
											{po.poNumber}
										</h5>
										<p className="text-muted-foreground text-xs">{po.vendor}</p>
									</div>
								</div>
								<Badge className="text-xs" variant={config.variant}>
									{config.label}
								</Badge>
							</div>

							{/* PO Details */}
							<div className="ml-10 space-y-1.5 text-xs">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Order Date:</span>
									<span className="font-medium">
										{formatDate(po.orderDate)}
									</span>
								</div>

								{po.expectedDelivery && (
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Expected Delivery:
										</span>
										<div className="flex items-center gap-1.5">
											<span
												className={`font-medium ${isOverdue ? "text-destructive" : ""}`}
											>
												{formatDate(po.expectedDelivery)}
											</span>
											{!po.actualDelivery && (
												<Badge
													className="text-xs"
													variant={isOverdue ? "destructive" : "outline"}
												>
													{getDaysUntil(po.expectedDelivery)}
												</Badge>
											)}
										</div>
									</div>
								)}

								{po.actualDelivery && (
									<div className="flex justify-between">
										<span className="text-muted-foreground">Delivered:</span>
										<span className="text-success font-medium">
											{formatDate(po.actualDelivery)}
										</span>
									</div>
								)}

								<div className="flex justify-between">
									<span className="text-muted-foreground">Items:</span>
									<span className="font-medium">{po.itemCount}</span>
								</div>

								<div className="flex justify-between border-t pt-1.5">
									<span className="text-muted-foreground">Amount:</span>
									<span className="font-semibold">
										{formatCurrency(po.totalAmount)}
									</span>
								</div>

								{/* Tracking Number */}
								{po.trackingNumber && (
									<div className="bg-muted mt-2 rounded p-2">
										<div className="flex items-center justify-between">
											<span className="text-muted-foreground">Tracking:</span>
											<a
												className="text-primary flex items-center gap-1 font-mono font-medium hover:underline"
												href={`https://www.ups.com/track?tracknum=${po.trackingNumber}`}
												rel="noopener noreferrer"
												target="_blank"
											>
												{po.trackingNumber}
												<ExternalLink className="size-3" />
											</a>
										</div>
									</div>
								)}

								{/* Notes */}
								{po.notes && (
									<div className="border-warning bg-warning dark:bg-warning/30 mt-2 rounded border-l-2 p-2">
										<p className="text-warning dark:text-warning text-xs">
											{po.notes}
										</p>
									</div>
								)}

								{/* Overdue Warning */}
								{isOverdue && (
									<div className="border-destructive bg-destructive dark:bg-destructive/30 mt-2 flex items-start gap-1.5 rounded border-l-2 p-2">
										<AlertCircle className="text-destructive mt-0.5 size-3 shrink-0" />
										<p className="text-destructive dark:text-destructive text-xs">
											Delivery overdue. Contact vendor for status update.
										</p>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{/* Summary Alert */}
			{purchaseOrders.some(
				(po) =>
					po.expectedDelivery &&
					po.expectedDelivery.getTime() < Date.now() &&
					po.status !== "delivered",
			) && (
				<>
					<Separator />
					<div className="border-destructive bg-destructive dark:bg-destructive/30 flex items-start gap-2 rounded-lg border-l-4 p-3">
						<AlertCircle className="text-destructive mt-0.5 size-4 shrink-0" />
						<div>
							<p className="text-destructive dark:text-destructive text-sm font-medium">
								Overdue Orders
							</p>
							<p className="text-destructive dark:text-destructive text-xs">
								Some purchase orders are overdue. Follow up with vendors to
								avoid job delays.
							</p>
						</div>
					</div>
				</>
			)}

			{/* Actions */}
			<Separator />
			<div className="space-y-2">
				<Button asChild className="w-full" size="sm" variant="outline">
					<Link href={`/dashboard/work/purchase-orders?jobId=${job.id}`}>
						<Package className="mr-2 size-4" />
						Manage Purchase Orders
					</Link>
				</Button>
				<Button asChild className="w-full" size="sm" variant="outline">
					<Link href={"/dashboard/inventory/vendors"}>View Vendors</Link>
				</Button>
			</div>

			{/* Quick Stats */}
			<div className="bg-muted grid grid-cols-3 gap-2 rounded-lg p-3 text-xs">
				<div className="space-y-1 text-center">
					<p className="text-muted-foreground">Total POs</p>
					<p className="font-semibold">{totalOrders}</p>
				</div>
				<div className="space-y-1 text-center">
					<p className="text-muted-foreground">In Transit</p>
					<p className="font-semibold">
						{purchaseOrders.filter((po) => po.status === "shipped").length}
					</p>
				</div>
				<div className="space-y-1 text-center">
					<p className="text-muted-foreground">Pending</p>
					<p className="font-semibold">
						{
							purchaseOrders.filter(
								(po) => po.status === "sent" || po.status === "confirmed",
							).length
						}
					</p>
				</div>
			</div>
		</div>
	);
}
