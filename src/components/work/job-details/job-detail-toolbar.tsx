"use client";

/**
 * Job Detail Toolbar - AppToolbar Actions
 *
 * Displays in AppToolbar for job detail pages:
 * - Quick actions (Invoice, Estimate, Clone)
 * - Ellipsis menu with Statistics, Export, Archive
 *
 * Design: Clean, compact, no button groups, outline variant
 */

import {
	Archive,
	BarChart3,
	Calendar,
	Copy,
	CreditCard,
	Download,
	FileText,
	Mail,
	MessageSquare,
	MoreVertical,
	Phone,
	Printer,
	Receipt,
	Share2,
	Tags,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { archiveJob } from "@/actions/jobs";
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
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useDialerStore } from "@/lib/stores/dialer-store";
import { JobStatisticsSheet } from "./job-statistics-sheet";
import { TagManagerDialog } from "./tags/tag-manager-dialog";

type JobDetailToolbarProps = {
	job?: any;
	customer?: any;
	metrics?: any;
	timeEntries?: any[];
	teamAssignments?: any[];
	invoices?: any[];
	payments?: any[];
	jobMaterials?: any[];
};

export function JobDetailToolbar({
	job,
	customer,
	metrics,
	timeEntries = [],
	teamAssignments = [],
	invoices = [],
	payments = [],
	jobMaterials = [],
}: JobDetailToolbarProps) {
	const pathname = usePathname();
	const router = useRouter();
	const { toast } = useToast();
	const openDialer = useDialerStore((state) => state.openDialer);
	const jobId = pathname?.split("/").pop();
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [isArchiving, setIsArchiving] = useState(false);
	const [isStatisticsOpen, setIsStatisticsOpen] = useState(false);
	const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

	// Calculate tag count
	const customerTags = (customer?.tags as string[]) || [];
	const jobTags =
		((job?.metadata?.tags || job?.custom_fields?.tags) as string[]) || [];
	const tagCount = customerTags.length + jobTags.length;

	// Helper to get customer name
	const getCustomerName = (cust: any) => {
		return (
			cust?.display_name ||
			`${cust?.first_name || ""} ${cust?.last_name || ""}`.trim()
		);
	};

	const handleArchive = async () => {
		if (!jobId) {
			toast.error("Job ID not found");
			return;
		}

		setIsArchiving(true);
		try {
			const result = await archiveJob(jobId);
			if (result.success) {
				toast.success("Job archived successfully");
				setIsArchiveDialogOpen(false);
				router.push("/dashboard/work");
				// Server Action handles revalidation automatically
			} else {
				toast.error(result.error || "Failed to archive job");
			}
		} catch (_error) {
			toast.error("Failed to archive job");
		} finally {
			setIsArchiving(false);
		}
	};

	const handleCall = () => {
		if (customer?.phone) {
			// Open the WebRTC dialer dropdown in app header with customer info pre-filled
			openDialer(customer.phone, customer.id, getCustomerName(customer));
		} else {
			toast.error("No phone number available");
		}
	};

	const handleText = () => {
		if (customer?.phone) {
			router.push(
				`/dashboard/communication/messages?phone=${customer.phone}&customerId=${customer.id}`,
			);
		} else {
			toast.error("No phone number available");
		}
	};

	const handleEmail = () => {
		if (customer?.email) {
			router.push(
				`/dashboard/communication/email?email=${customer.email}&customerId=${customer.id}`,
			);
		} else {
			toast.error("No email address available");
		}
	};

	const handleExport = () => {
		// Export job details to CSV
		const csvData = [
			["Field", "Value"],
			["Job Number", job?.job_number || ""],
			["Title", job?.title || ""],
			["Status", job?.status || ""],
			["Customer", customer?.display_name || ""],
			["Phone", customer?.phone || ""],
			["Email", customer?.email || ""],
			[
				"Created",
				job?.created_at ? new Date(job.created_at).toLocaleDateString() : "",
			],
			[
				"Total Revenue",
				metrics?.totalRevenue ? `$${metrics.totalRevenue.toFixed(2)}` : "$0.00",
			],
		];

		const csv = csvData
			.map((row) => row.map((cell) => `"${cell}"`).join(","))
			.join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `job-${job?.job_number || jobId}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
		toast.success("Job exported to CSV");
	};

	const handlePrint = () => {
		window.print();
		toast.success("Opening print dialog...");
	};

	return (
		<>
			<div className="flex items-center gap-1.5">
				{/* Primary Actions */}
				<TooltipProvider>
					{/* Schedule Appointment */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button asChild size="sm" variant="outline">
								<a href={`/dashboard/work/appointments/new?jobId=${jobId}`}>
									<Calendar />
									<span className="hidden md:inline">Schedule</span>
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Schedule appointment</p>
						</TooltipContent>
					</Tooltip>

					{/* Contact Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="sm" variant="outline">
								<Phone />
								<span className="hidden md:inline">Contact</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuLabel>Contact Customer</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								disabled={!customer?.phone}
								onClick={handleCall}
							>
								<Phone className="mr-2 size-3.5" />
								{customer?.phone ? `Call ${customer.phone}` : "No phone number"}
							</DropdownMenuItem>
							<DropdownMenuItem
								disabled={!customer?.phone}
								onClick={handleText}
							>
								<MessageSquare className="mr-2 size-3.5" />
								{customer?.phone ? "Send text message" : "No phone number"}
							</DropdownMenuItem>
							<DropdownMenuItem
								disabled={!customer?.email}
								onClick={handleEmail}
							>
								<Mail className="mr-2 size-3.5" />
								{customer?.email
									? `Email ${customer.email}`
									: "No email address"}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Payment */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button asChild size="sm" variant="outline">
								<a href={`/dashboard/work/payments/new?jobId=${jobId}`}>
									<CreditCard />
									<span className="hidden md:inline">Payment</span>
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Collect payment</p>
						</TooltipContent>
					</Tooltip>

					{/* Invoice */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button asChild size="sm" variant="outline">
								<a href={`/dashboard/work/invoices/new?jobId=${jobId}`}>
									<Receipt />
									<span className="hidden md:inline">Invoice</span>
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Create invoice</p>
						</TooltipContent>
					</Tooltip>

					{/* Estimate */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button asChild size="sm" variant="outline">
								<a href={`/dashboard/work/estimates/new?jobId=${jobId}`}>
									<FileText />
									<span className="hidden md:inline">Estimate</span>
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Create estimate</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				{/* Actions Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button size="sm" variant="outline">
							<MoreVertical />
							<span className="hidden md:inline">Actions</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						{/* Statistics */}
						{job && metrics && (
							<DropdownMenuItem onClick={() => setIsStatisticsOpen(true)}>
								<BarChart3 className="mr-2 size-3.5" />
								View Statistics
							</DropdownMenuItem>
						)}

						{/* Tags */}
						<DropdownMenuItem onClick={() => setIsTagDialogOpen(true)}>
							<Tags className="mr-2 size-3.5" />
							Manage Tags
							{tagCount > 0 && (
								<Badge className="ml-auto h-5 px-1.5" variant="secondary">
									{tagCount}
								</Badge>
							)}
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						{/* Clone */}
						<DropdownMenuItem
							onClick={() =>
								router.push(`/dashboard/work/new?cloneFrom=${jobId}`)
							}
						>
							<Copy className="mr-2 size-3.5" />
							Clone Job
						</DropdownMenuItem>

						{/* Export */}
						<DropdownMenuItem onClick={handleExport}>
							<Download className="mr-2 size-3.5" />
							Export to CSV
						</DropdownMenuItem>

						{/* Print */}
						<DropdownMenuItem onClick={handlePrint}>
							<Printer className="mr-2 size-3.5" />
							Print Details
						</DropdownMenuItem>

						{/* Share */}
						<DropdownMenuItem
							onClick={() => {
								navigator.clipboard.writeText(window.location.href);
								toast.success("Job link copied to clipboard");
							}}
						>
							<Share2 className="mr-2 size-3.5" />
							Share Link
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						{/* Archive */}
						<DropdownMenuItem
							className="text-destructive"
							onClick={() => setIsArchiveDialogOpen(true)}
						>
							<Archive className="mr-2 size-3.5" />
							Archive Job
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Archive Confirmation Dialog */}
			<Dialog onOpenChange={setIsArchiveDialogOpen} open={isArchiveDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Archive Job</DialogTitle>
						<DialogDescription>
							Are you sure you want to archive this job? Archived jobs can be
							restored within 90 days. Completed or invoiced jobs cannot be
							archived.
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
							onClick={handleArchive}
							variant="destructive"
						>
							{isArchiving ? "Archiving..." : "Archive Job"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Statistics Sheet */}
			{job && metrics && (
				<JobStatisticsSheet
					invoices={invoices}
					job={job}
					jobMaterials={jobMaterials}
					metrics={metrics}
					onOpenChange={setIsStatisticsOpen}
					open={isStatisticsOpen}
					payments={payments}
					teamAssignments={teamAssignments}
					timeEntries={timeEntries}
				/>
			)}

			{/* Tag Manager Dialog */}
			<TagManagerDialog
				customerId={customer?.id}
				customerTags={customerTags}
				jobId={job?.id}
				jobTags={jobTags}
				onOpenChange={setIsTagDialogOpen}
				onUpdate={() => {
					// Server Action handles revalidation automatically
				}}
				open={isTagDialogOpen}
			/>
		</>
	);
}
