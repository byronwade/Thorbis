/**
 * Purchase Order Page Content
 *
 * Comprehensive purchase order details with collapsible sections
 * Matches job, customer, appointment, team member detail page patterns
 *
 * Sections:
 * - PO Information (number, vendor, dates, priority)
 * - Line Items (materials/items being ordered)
 * - Job Details (if linked to a job)
 * - Delivery Information (address, expected date, tracking)
 * - Activity Log (PO history and changes)
 */

"use client";

import {
	Activity,
	AlertCircle,
	Archive,
	CheckCircle2,
	ChevronRight,
	Clock,
	DollarSign,
	Download,
	FileCheck,
	FileText,
	Mail,
	MapPin,
	MoreVertical,
	Paperclip,
	Pencil,
	Printer,
	User,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast as sonnerToast } from "sonner";
import {
	archivePurchaseOrder,
	updatePurchaseOrderVendor,
} from "@/actions/purchase-orders";
import { VendorSelect } from "@/components/inventory/vendor-select";
import { ActivityLogSection } from "@/components/layout/standard-sections/activity-log-section";
import { AttachmentsSection } from "@/components/layout/standard-sections/attachments-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
	UnifiedAccordion,
	UnifiedAccordionContent,
} from "@/components/ui/unified-accordion";
import { useToast } from "@/hooks/use-toast";

export type PurchaseOrderData = {
	purchaseOrder: any;
	job?: any;
	estimate?: any; // NEW: source estimate
	invoice?: any; // NEW: related invoice
	lineItems?: any[];
	activities?: any[];
	attachments?: any[];
	requestedByUser?: any;
	approvedByUser?: any;
};

export type PurchaseOrderPageContentProps = {
	entityData: PurchaseOrderData;
	metrics: any;
};

const _defaultAccordionSections = ["line-items"];

export function PurchaseOrderPageContent({
	entityData,
	metrics,
}: PurchaseOrderPageContentProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [_hasChanges, _setHasChanges] = useState(false);
	const [_isSaving, _setIsSaving] = useState(false);
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);

	const {
		purchaseOrder: po,
		job,
		estimate, // NEW
		invoice, // NEW
		lineItems = [],
		activities = [],
		attachments = [],
		requestedByUser,
		approvedByUser,
	} = entityData;

	const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<string>(
		po.status || "draft",
	);
	const [statusUpdateNotes, setStatusUpdateNotes] = useState("");
	const [isUpdatingStatus, _setIsUpdatingStatus] = useState(false);
	const [isEditingVendor, setIsEditingVendor] = useState(false);
	const [selectedVendorId, setSelectedVendorId] = useState<string | undefined>(
		po.vendor_id,
	);
	const [selectedVendor, setSelectedVendor] = useState<any>(null);
	const [isUpdatingVendor, setIsUpdatingVendor] = useState(false);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [_openSection, _setOpenSection] = useState<string | null>("line-items");

	const handleArchivePurchaseOrder = async () => {
		setIsArchiving(true);
		try {
			const result = await archivePurchaseOrder(po.id);
			if (result.success) {
				sonnerToast.success("Purchase order archived successfully");
				setIsArchiveDialogOpen(false);
				window.location.href = "/dashboard/work/purchase-orders";
			} else {
				sonnerToast.error(result.error || "Failed to archive purchase order");
			}
		} catch (_error) {
			sonnerToast.error("Failed to archive purchase order");
		} finally {
			setIsArchiving(false);
		}
	};

	// Prepare unified accordion sections
	const accordionSections: any[] = [
		// Line Items
		{
			id: "line-items",
			title: "Line Items",
			count: lineItems.length,
			defaultOpen: true,
			content: (
				<UnifiedAccordionContent>
					{lineItems.length > 0 ? (
						<div className="-mx-4 overflow-x-auto sm:mx-0">
							<Table>
								<TableHeader className="sticky top-0 bg-background">
									<TableRow>
										<TableHead className="min-w-[200px]">Description</TableHead>
										<TableHead className="w-24 text-right">Ordered</TableHead>
										{(po.status === "partially_received" ||
											po.status === "received" ||
											lineItems.some(
												(item: any) => item.received_quantity > 0,
											)) && (
											<TableHead className="w-24 text-right">
												Received
											</TableHead>
										)}
										<TableHead className="w-32 text-right">
											Unit Price
										</TableHead>
										<TableHead className="w-32 text-right">Total</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{lineItems.map((item: any) => {
										const receivedQty = item.received_quantity || 0;
										const orderedQty = item.quantity || 0;
										const isFullyReceived = receivedQty >= orderedQty;
										const isPartiallyReceived =
											receivedQty > 0 && receivedQty < orderedQty;

										return (
											<TableRow key={item.id}>
												<TableCell className="font-medium">
													<div className="flex items-center gap-2">
														{item.description}
														{isFullyReceived && (
															<CheckCircle2
																aria-label="Fully received"
																className="size-4 text-success"
															/>
														)}
														{isPartiallyReceived && (
															<Clock
																aria-label="Partially received"
																className="size-4 text-warning"
															/>
														)}
													</div>
												</TableCell>
												<TableCell className="text-right">
													{orderedQty}
												</TableCell>
												{(po.status === "partially_received" ||
													po.status === "received" ||
													receivedQty > 0) && (
													<TableCell className="text-right">
														<span
															className={
																isFullyReceived
																	? "font-semibold text-success"
																	: isPartiallyReceived
																		? "text-warning"
																		: ""
															}
														>
															{receivedQty}
														</span>
														{isPartiallyReceived && (
															<span className="ml-1 text-muted-foreground text-xs">
																({orderedQty - receivedQty} remaining)
															</span>
														)}
													</TableCell>
												)}
												<TableCell className="text-right">
													{new Intl.NumberFormat("en-US", {
														style: "currency",
														currency: "USD",
													}).format((item.unit_price || 0) / 100)}
												</TableCell>
												<TableCell className="text-right font-semibold">
													{new Intl.NumberFormat("en-US", {
														style: "currency",
														currency: "USD",
													}).format(
														(orderedQty * (item.unit_price || 0)) / 100,
													)}
												</TableCell>
											</TableRow>
										);
									})}
									{/* Total Row */}
									<TableRow className="border-t-2 bg-muted/50">
										<TableCell
											className="text-right font-semibold"
											colSpan={
												po.status === "partially_received" ||
												po.status === "received" ||
												lineItems.some(
													(item: any) => item.received_quantity > 0,
												)
													? 4
													: 3
											}
										>
											Total
										</TableCell>
										<TableCell className="text-right font-bold text-lg">
											{new Intl.NumberFormat("en-US", {
												style: "currency",
												currency: "USD",
											}).format(
												lineItems.reduce(
													(sum: number, item: any) =>
														sum + (item.quantity || 0) * (item.unit_price || 0),
													0,
												) / 100,
											)}
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
					) : (
						<div className="flex h-64 items-center justify-center">
							<div className="text-center">
								<FileText className="mx-auto size-12 text-muted-foreground/50" />
								<p className="mt-4 text-muted-foreground text-sm">
									No line items yet
								</p>
								<p className="text-muted-foreground text-xs">
									Add items to this purchase order
								</p>
							</div>
						</div>
					)}
				</UnifiedAccordionContent>
			),
		},
	];

	// Add Job Details section if job exists
	if (job) {
		accordionSections.push({
			id: "job-details",
			title: "Related Job",
			icon: <Wrench className="size-4" />,
			content: (
				<UnifiedAccordionContent>
					<div className="space-y-3">
						<div>
							<Label className="text-xs">Job Number</Label>
							<Link
								className="block font-medium text-primary text-sm hover:underline"
								href={`/dashboard/work/${job.id}`}
							>
								#{job.job_number}
							</Link>
						</div>
						<div>
							<Label className="text-xs">Title</Label>
							<p className="text-sm">{job.title}</p>
						</div>
						<div>
							<Label className="text-xs">Status</Label>
							<Badge variant="outline">{job.status}</Badge>
						</div>
					</div>
				</UnifiedAccordionContent>
			),
		});
	}

	// NEW: Add Source Estimate section if exists
	if (estimate) {
		accordionSections.push({
			id: "source-estimate",
			title: "Source Estimate",
			icon: <FileText className="size-4" />,
			content: (
				<UnifiedAccordionContent>
					<div className="space-y-3">
						<div>
							<Label className="text-xs">Estimate Number</Label>
							<Link
								className="block font-medium text-primary text-sm hover:underline"
								href={`/dashboard/work/estimates/${estimate.id}`}
							>
								#{estimate.estimate_number || estimate.id.slice(0, 8)}
							</Link>
						</div>
						<div>
							<Label className="text-xs">Title</Label>
							<p className="text-sm">{estimate.title}</p>
						</div>
						<div>
							<Label className="text-xs">Total Amount</Label>
							<p className="font-medium text-sm">
								{new Intl.NumberFormat("en-US", {
									style: "currency",
									currency: "USD",
								}).format((estimate.total_amount || 0) / 100)}
							</p>
						</div>
						<div>
							<Label className="text-xs">Status</Label>
							<Badge variant="outline">{estimate.status}</Badge>
						</div>
					</div>
				</UnifiedAccordionContent>
			),
		});
	}

	// NEW: Add Related Invoice section if exists
	if (invoice) {
		accordionSections.push({
			id: "related-invoice",
			title: "Related Invoice",
			icon: <FileCheck className="size-4" />,
			content: (
				<UnifiedAccordionContent>
					<div className="space-y-3">
						<div>
							<Label className="text-xs">Invoice Number</Label>
							<Link
								className="block font-medium text-primary text-sm hover:underline"
								href={`/dashboard/work/invoices/${invoice.id}`}
							>
								#{invoice.invoice_number || invoice.id.slice(0, 8)}
							</Link>
						</div>
						<div>
							<Label className="text-xs">Title</Label>
							<p className="text-sm">{invoice.title}</p>
						</div>
						<div>
							<Label className="text-xs">Total Amount</Label>
							<p className="font-medium text-sm">
								{new Intl.NumberFormat("en-US", {
									style: "currency",
									currency: "USD",
								}).format((invoice.total_amount || 0) / 100)}
							</p>
						</div>
						<div>
							<Label className="text-xs">Status</Label>
							<Badge
								variant={invoice.status === "paid" ? "default" : "outline"}
							>
								{invoice.status}
							</Badge>
						</div>
					</div>
				</UnifiedAccordionContent>
			),
		});
	}

	// Add Delivery section if applicable
	if (po.delivery_address || po.tracking_number) {
		accordionSections.push({
			id: "delivery",
			title: "Delivery Details",
			icon: <MapPin className="size-4" />,
			content: (
				<UnifiedAccordionContent>
					<div className="space-y-3">
						{po.delivery_address && (
							<div>
								<Label className="text-xs">Delivery Address</Label>
								<p className="whitespace-pre-line text-sm">
									{po.delivery_address}
								</p>
							</div>
						)}
						{po.tracking_number && (
							<div>
								<Label className="text-xs">Tracking Number</Label>
								<div className="flex items-center gap-2">
									<p className="font-mono text-sm">{po.tracking_number}</p>
									<Button
										asChild
										className="h-6 px-2"
										size="sm"
										variant="ghost"
									>
										<a
											href={`https://www.google.com/search?q=${encodeURIComponent(po.tracking_number)}`}
											rel="noopener noreferrer"
											target="_blank"
										>
											Track
										</a>
									</Button>
								</div>
							</div>
						)}
					</div>
				</UnifiedAccordionContent>
			),
		});
	}

	// Add Attachments section
	accordionSections.push({
		id: "attachments",
		title: "Attachments",
		icon: <Paperclip className="size-4" />,
		count: attachments.length,
		content: (
			<UnifiedAccordionContent>
				{attachments.length > 0 ? (
					<div className="space-y-2">
						{attachments.map((attachment: any) => (
							<div
								className="flex items-center justify-between rounded-lg border p-2"
								key={attachment.id}
							>
								<div className="flex items-center gap-2">
									<FileText className="size-4 text-muted-foreground" />
									<div>
										<p className="font-medium text-sm">
											{attachment.original_file_name || attachment.file_name}
										</p>
										<p className="text-muted-foreground text-xs">
											{attachment.file_size
												? `${(attachment.file_size / 1024).toFixed(1)} KB`
												: ""}
											{attachment.category && ` • ${attachment.category}`}
										</p>
									</div>
								</div>
								<Button asChild size="sm" variant="ghost">
									<a
										href={attachment.storage_url}
										rel="noopener noreferrer"
										target="_blank"
									>
										<Download className="size-4" />
									</a>
								</Button>
							</div>
						))}
					</div>
				) : (
					<p className="text-center text-muted-foreground text-sm">
						No attachments yet
					</p>
				)}
			</UnifiedAccordionContent>
		),
	});

	// Add Notes section if applicable
	if (po.notes || po.internal_notes) {
		accordionSections.push({
			id: "notes",
			title: "Notes",
			icon: <FileText className="size-4" />,
			content: (
				<UnifiedAccordionContent>
					<div className="space-y-4">
						{po.notes && (
							<div>
								<Label className="text-xs">Public Notes</Label>
								<p className="mt-1 whitespace-pre-wrap text-sm">{po.notes}</p>
							</div>
						)}
						{po.internal_notes && (
							<div>
								<Label className="text-xs">Internal Notes</Label>
								<p className="mt-1 whitespace-pre-wrap text-muted-foreground text-sm">
									{po.internal_notes}
								</p>
							</div>
						)}
					</div>
				</UnifiedAccordionContent>
			),
		});
	}

	// Add Documents section (renamed from attachments to avoid duplicate key)
	accordionSections.push({
		id: "documents",
		title: "Documents",
		icon: <Paperclip className="size-4" />,
		count: attachments.length,
		content: <AttachmentsSection attachments={attachments} />,
	});

	// Add Activity section
	accordionSections.push({
		id: "activity",
		title: "Activity",
		icon: <Activity className="size-4" />,
		count: activities.length,
		content: <ActivityLogSection activities={activities} />,
	});

	return (
		<div className="flex-1">
			<div className="w-full">
				<div className="flex flex-col gap-6">
					{/* Desktop Title and Actions */}
					<div className="hidden flex-row items-center justify-between lg:flex">
						<div className="flex flex-row items-center gap-2">
							<h1 className="font-semibold text-2xl">{po.title}</h1>
						</div>
						<div className="flex h-min gap-2">
							{/* Print PO */}
							<Button
								onClick={() => window.print()}
								size="sm"
								variant="outline"
							>
								<Printer className="mr-2 size-4" />
								Print
							</Button>

							{/* Email Vendor */}
							{po.vendor_email && (
								<Button asChild size="sm" variant="outline">
									<a
										href={`mailto:${po.vendor_email}?subject=Purchase Order ${po.po_number || po.poNumber}`}
									>
										<Mail className="mr-2 size-4" />
										Email Vendor
									</a>
								</Button>
							)}

							{/* Status Update Dropdown */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button size="sm" variant="outline">
										<MoreVertical className="size-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										onClick={() => {
											setSelectedStatus("pending_approval");
											setStatusUpdateDialogOpen(true);
										}}
									>
										Request Approval
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											setSelectedStatus("approved");
											setStatusUpdateDialogOpen(true);
										}}
									>
										Approve
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											setSelectedStatus("ordered");
											setStatusUpdateDialogOpen(true);
										}}
									>
										Mark as Ordered
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											setSelectedStatus("partially_received");
											setStatusUpdateDialogOpen(true);
										}}
									>
										Partially Received
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											setSelectedStatus("received");
											setStatusUpdateDialogOpen(true);
										}}
									>
										Mark as Received
									</DropdownMenuItem>
									<DropdownMenuItem
										className="text-destructive"
										onClick={() => {
											setSelectedStatus("cancelled");
											setStatusUpdateDialogOpen(true);
										}}
									>
										Cancel PO
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => setIsArchiveDialogOpen(true)}
									>
										<Archive className="mr-2 size-4" />
										Archive
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* Main Card Container */}
					<div className="rounded-md bg-muted/50 shadow-sm">
						<div className="flex flex-col gap-4 overflow-hidden p-4 sm:p-6 md:flex-row">
							{/* Left Side - Status Preview */}
							<div className="flex flex-col gap-3">
								<div className="aspect-[16/10] w-full md:w-[320px] lg:w-[400px]">
									<div className="flex size-full w-full flex-none justify-center overflow-hidden rounded-lg border border-border border-solid p-0">
										<div className="w-full">
											{/* Status Header */}
											<div className="w-full border-border border-b border-solid p-3">
												<div className="flex items-center gap-2">
													{po.status === "received" ? (
														<CheckCircle2 className="size-4 text-success" />
													) : po.status === "cancelled" ? (
														<AlertCircle className="size-4 text-destructive" />
													) : (
														<Clock className="size-4 text-warning" />
													)}
													<h3 className="font-medium text-sm">
														{po.status
															?.replace("_", " ")
															.replace(/\b\w/g, (l: string) =>
																l.toUpperCase(),
															) || "Draft"}
													</h3>
												</div>
											</div>
											{/* Content */}
											<div className="flex h-[calc(100%-45px)] flex-col p-3">
												<div className="space-y-3">
													<div>
														<p className="text-muted-foreground text-xs">
															PO Number
														</p>
														<p className="font-medium text-sm">
															{po.po_number || po.poNumber}
														</p>
													</div>
													{po.vendor && (
														<div>
															<p className="text-muted-foreground text-xs">
																Vendor
															</p>
															<p className="font-medium text-sm">{po.vendor}</p>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Mobile Title and Actions */}
								<div className="flex h-min flex-wrap gap-2 lg:hidden">
									{/* Print PO */}
									<Button
										className="min-w-[96px] flex-1"
										onClick={() => window.print()}
										size="sm"
										variant="outline"
									>
										<Printer className="mr-2 size-4" />
										Print
									</Button>

									{/* Email Vendor */}
									{po.vendor_email && (
										<Button
											asChild
											className="min-w-[96px] flex-1"
											size="sm"
											variant="outline"
										>
											<a
												href={`mailto:${po.vendor_email}?subject=Purchase Order ${po.po_number || po.poNumber}`}
											>
												<Mail className="mr-2 size-4" />
												Email
											</a>
										</Button>
									)}

									{/* Status Update Dropdown */}
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button size="sm" variant="outline">
												<MoreVertical className="size-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={() => {
													setSelectedStatus("pending_approval");
													setStatusUpdateDialogOpen(true);
												}}
											>
												Request Approval
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => {
													setSelectedStatus("approved");
													setStatusUpdateDialogOpen(true);
												}}
											>
												Approve
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => {
													setSelectedStatus("ordered");
													setStatusUpdateDialogOpen(true);
												}}
											>
												Mark as Ordered
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => {
													setSelectedStatus("partially_received");
													setStatusUpdateDialogOpen(true);
												}}
											>
												Partially Received
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => {
													setSelectedStatus("received");
													setStatusUpdateDialogOpen(true);
												}}
											>
												Mark as Received
											</DropdownMenuItem>
											<DropdownMenuItem
												className="text-destructive"
												onClick={() => {
													setSelectedStatus("cancelled");
													setStatusUpdateDialogOpen(true);
												}}
											>
												Cancel PO
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => setIsArchiveDialogOpen(true)}
											>
												<Archive className="mr-2 size-4" />
												Archive
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>

							{/* Right Side - Metadata Grid */}
							<div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-6">
								<div className="grid grid-cols-2 gap-4 md:grid-cols-4 [&>div]:flex-[0_1_auto]">
									{/* Created Date */}
									<div className="flex flex-col gap-1">
										<span className="text-muted-foreground text-xs">
											Created
										</span>
										<div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm [&>*]:text-ellipsis">
											<User className="size-4 flex-none text-muted-foreground" />
											<span className="-ml-px shrink truncate text-sm">
												{requestedByUser?.name ||
													requestedByUser?.email ||
													"Unknown"}
											</span>
											<span className="flex-none text-muted-foreground text-xs tabular-nums">
												{new Date(po.created_at).toLocaleDateString()}
											</span>
										</div>
									</div>

									{/* Status */}
									<div className="flex flex-col gap-1">
										<span className="text-muted-foreground text-xs">
											Status
										</span>
										<div className="-ml-[3px] flex h-5 items-center gap-1 whitespace-nowrap text-sm [&>*]:text-ellipsis">
											<span className="flex size-4 items-center justify-center">
												<span
													className={`size-2.5 flex-none rounded-full ${
														po.status === "received"
															? "bg-success"
															: po.status === "cancelled"
																? "bg-destructive"
																: "bg-warning"
													}`}
												/>
											</span>
											<span className="text-sm">
												{po.status
													?.replace("_", " ")
													.replace(/\b\w/g, (l: string) => l.toUpperCase()) ||
													"Draft"}
											</span>
											{po.priority && (
												<Badge className="ml-1" variant="outline">
													{po.priority}
												</Badge>
											)}
										</div>
									</div>

									{/* Expected Delivery */}
									{po.expected_delivery && (
										<div className="flex flex-col gap-1">
											<span className="text-muted-foreground text-xs">
												Expected Delivery
											</span>
											<div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm tabular-nums [&>*]:text-ellipsis">
												<Clock className="size-4 flex-none text-muted-foreground" />
												<span className="font-medium text-sm">
													{new Date(po.expected_delivery).toLocaleDateString()}
												</span>
												{po.actual_delivery && (
													<span className="text-muted-foreground text-xs">
														{new Date(po.actual_delivery).toLocaleDateString()}
													</span>
												)}
											</div>
										</div>
									)}

									{/* Total Amount */}
									<div className="flex flex-col gap-1">
										<span className="text-muted-foreground text-xs">Total</span>
										<div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm [&>*]:text-ellipsis">
											<DollarSign className="size-4 flex-none text-muted-foreground" />
											<span className="font-medium text-sm">
												{new Intl.NumberFormat("en-US", {
													style: "currency",
													currency: "USD",
												}).format((po.total_amount || 0) / 100)}
											</span>
										</div>
									</div>
								</div>

								{/* Vendor Section */}
								<div className="flex flex-col gap-1">
									<span className="text-muted-foreground text-xs">Vendor</span>
									<div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm [&>*]:text-ellipsis">
										{!isEditingVendor && (
											<>
												<User className="size-4 flex-none text-muted-foreground" />
												{po.vendor ? (
													<>
														<span className="font-medium text-sm">
															{po.vendor}
														</span>
														<Button
															className="h-6 px-2"
															onClick={() => setIsEditingVendor(true)}
															size="sm"
															variant="ghost"
														>
															<Pencil className="mr-1 size-3" />
															Change
														</Button>
													</>
												) : (
													<Button
														className="h-6"
														onClick={() => setIsEditingVendor(true)}
														size="sm"
														variant="outline"
													>
														Assign Vendor
													</Button>
												)}
											</>
										)}
										{isEditingVendor && (
											<div className="flex w-full items-center gap-2">
												<VendorSelect
													className="flex-1"
													onValueChange={(vendorId, vendor) => {
														setSelectedVendorId(vendorId);
														setSelectedVendor(vendor);
													}}
													placeholder="Select vendor..."
													value={selectedVendorId}
												/>
												<Button
													className="h-6"
													disabled={isUpdatingVendor || !selectedVendorId}
													onClick={async () => {
														if (!selectedVendorId) {
															toast.error("Please select a vendor");
															return;
														}

														setIsUpdatingVendor(true);
														try {
															const vendorName =
																selectedVendor?.display_name ||
																selectedVendor?.name ||
																po.vendor;
															const vendorEmail =
																selectedVendor?.email || po.vendor_email;
															const vendorPhone =
																selectedVendor?.phone || po.vendor_phone;

															const result = await updatePurchaseOrderVendor(
																po.id,
																selectedVendorId,
																vendorName,
																vendorEmail,
																vendorPhone,
															);

															if (result.success) {
																toast.success(
																	`Vendor changed to ${vendorName}`,
																);
																setIsEditingVendor(false);
																// Server Action handles revalidation automatically
															} else {
																throw new Error(
																	result.error || "Failed to update vendor",
																);
															}
														} catch (error) {
															toast.error(
																error instanceof Error
																	? error.message
																	: "Failed to update vendor",
															);
														} finally {
															setIsUpdatingVendor(false);
														}
													}}
													size="sm"
												>
													{isUpdatingVendor ? "Saving..." : "Save"}
												</Button>
												<Button
													className="h-6"
													disabled={isUpdatingVendor}
													onClick={() => {
														setIsEditingVendor(false);
														setSelectedVendorId(po.vendor_id);
														setSelectedVendor(null);
													}}
													size="sm"
													variant="ghost"
												>
													Cancel
												</Button>
											</div>
										)}
									</div>
								</div>

								{/* Job Reference */}
								{po.job_id && (
									<div className="flex flex-col gap-1">
										<span className="text-muted-foreground text-xs">
											Related Job
										</span>
										<div className="flex h-5 items-center gap-2 whitespace-nowrap text-sm [&>*]:text-ellipsis">
											<FileCheck className="size-4 flex-none text-muted-foreground" />
											<span className="font-medium text-sm">
												Job #{po.job_id}
											</span>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Collapsible Footer - Outside columns */}
						<div className="rounded-b" data-orientation="vertical">
							<div
								data-orientation="vertical"
								data-state={isDetailsOpen ? "open" : "closed"}
							>
								<button
									className="ease flex h-12 w-full cursor-pointer items-center justify-between border-0 border-border border-t bg-transparent px-4 transition-all duration-200 hover:bg-muted/50 disabled:text-muted-foreground"
									data-radix-collection-item=""
									onClick={() => setIsDetailsOpen(!isDetailsOpen)}
									type="button"
								>
									<span className="flex w-full items-center gap-2">
										<ChevronRight
											className={`size-4 transition-transform duration-200 ease-[ease] ${
												isDetailsOpen ? "rotate-90" : ""
											}`}
										/>
										<span className="flex w-full items-center gap-2">
											<span className="font-medium text-sm">
												Purchase Order Details
											</span>
										</span>
									</span>
								</button>
								<div
									className="slide-in-from-top-2 animate-in overflow-hidden duration-200 will-change-[height] data-[state=closed]:animate-content-close data-[state=closed]:animate-out data-[state=open]:animate-content-open"
									data-state={isDetailsOpen ? "open" : "closed"}
									hidden={!isDetailsOpen}
									role="region"
								>
									<div className="space-y-4 border-t p-4 sm:p-6">
										{/* PO Number */}
										<div>
											<Label className="text-muted-foreground text-xs">
												PO Number
											</Label>
											<p className="mt-1 font-medium text-sm">
												{po.po_number || po.poNumber}
											</p>
										</div>

										{/* Delivery Address */}
										{po.delivery_address && (
											<div>
												<Label className="text-muted-foreground text-xs">
													Delivery Address
												</Label>
												<p className="mt-1 whitespace-pre-line text-sm">
													{po.delivery_address}
												</p>
											</div>
										)}

										{/* Tracking Number */}
										{po.tracking_number && (
											<div>
												<Label className="text-muted-foreground text-xs">
													Tracking Number
												</Label>
												<div className="mt-1 flex items-center gap-2">
													<p className="font-mono text-sm">
														{po.tracking_number}
													</p>
													<Button
														asChild
														className="h-6 px-2"
														size="sm"
														variant="ghost"
													>
														<a
															href={`https://www.google.com/search?q=${encodeURIComponent(po.tracking_number)}`}
															rel="noopener noreferrer"
															target="_blank"
														>
															Track
														</a>
													</Button>
												</div>
											</div>
										)}

										{/* Notes */}
										{po.notes && (
											<div>
												<Label className="text-muted-foreground text-xs">
													Public Notes
												</Label>
												<p className="mt-1 whitespace-pre-wrap text-sm">
													{po.notes}
												</p>
											</div>
										)}

										{/* Internal Notes */}
										{po.internal_notes && (
											<div>
												<Label className="text-muted-foreground text-xs">
													Internal Notes
												</Label>
												<p className="mt-1 whitespace-pre-wrap text-muted-foreground text-sm">
													{po.internal_notes}
												</p>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Unified Accordion Section */}
					<UnifiedAccordion
						defaultOpenSection="line-items"
						sections={accordionSections}
					/>
				</div>
			</div>

			{/* Status Update Dialog */}
			<Dialog
				onOpenChange={setStatusUpdateDialogOpen}
				open={statusUpdateDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Update Purchase Order Status</DialogTitle>
						<DialogDescription>
							Update the status of this purchase order to{" "}
							{selectedStatus.replace("_", " ")}.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div>
							<Label>New Status</Label>
							<div className="mt-2">
								<Badge variant="default">
									{selectedStatus
										.replace("_", " ")
										.replace(/\b\w/g, (l: string) => l.toUpperCase())}
								</Badge>
							</div>
						</div>
						<div>
							<Label htmlFor="status-notes">Notes (Optional)</Label>
							<Textarea
								className="mt-2"
								id="status-notes"
								onChange={(e) => setStatusUpdateNotes(e.target.value)}
								placeholder="Add any notes about this status change..."
								value={statusUpdateNotes}
							/>
						</div>
					</div>
					<DialogFooter className="flex-col gap-2 sm:flex-row">
						<Button
							className="w-full sm:w-auto"
							onClick={() => {
								setStatusUpdateDialogOpen(false);
								setStatusUpdateNotes("");
							}}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							className="w-full sm:w-auto"
							disabled={isUpdatingStatus}
							onClick={async () => {
								// TODO: Implement status update logic
								toast.success(
									`Status changed to ${selectedStatus.replace("_", " ")}`,
								);
								setStatusUpdateDialogOpen(false);
								setStatusUpdateNotes("");
							}}
						>
							{isUpdatingStatus ? "Updating..." : "Update Status"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Archive Dialog */}
			<Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Archive Purchase Order?</DialogTitle>
						<DialogDescription>
							This will archive the purchase order. You can restore it from the
							archive within 90 days.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							disabled={isArchiving}
							onClick={() => setIsArchiveDialogOpen(false)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={isArchiving}
							onClick={handleArchivePurchaseOrder}
							variant="destructive"
						>
							{isArchiving ? "Archiving..." : "Archive Purchase Order"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
