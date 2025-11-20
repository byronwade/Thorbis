"use client";

import {
	Archive,
	CheckCircle,
	Download,
	Eye,
	Link2Off,
	MoreHorizontal,
	Receipt,
	Send,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { bulkArchive } from "@/actions/archive";
import { unlinkEstimateFromJob } from "@/actions/estimates";
import { ArchiveConfirmDialog } from "@/components/ui/archive-confirm-dialog";
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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	type BulkAction,
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { EstimateStatusBadge } from "@/components/ui/status-badge";
import { TablePresets } from "@/lib/datatable/table-presets";
import { formatCurrency, formatDate } from "@/lib/formatters";

type Estimate = {
	id: string;
	estimate_number: string;
	title?: string;
	total_amount: number;
	status: string;
	created_at: string;
	valid_until?: string | null;
};

type JobEstimatesTableProps = {
	estimates: Estimate[];
};

export function JobEstimatesTable({ estimates }: JobEstimatesTableProps) {
	const router = useRouter();
	const [showArchiveDialog, setShowArchiveDialog] = useState(false);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [isArchiving, setIsArchiving] = useState(false);
	const [unlinkEstimateId, setUnlinkEstimateId] = useState<string | null>(null);
	const [isUnlinking, setIsUnlinking] = useState(false);

	const formatCurrencyCents = useCallback(
		(cents: number) =>
			formatCurrency(cents, {
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			}),
		[],
	);

	const handleArchive = useCallback(async () => {
		if (selectedIds.size === 0) {
			return;
		}

		setIsArchiving(true);
		try {
			const result = await bulkArchive(Array.from(selectedIds), "estimate");

			if (result.success && result.data) {
				toast.success(
					`Successfully archived ${result.data.archived} estimate${result.data.archived === 1 ? "" : "s"}`,
				);
				setShowArchiveDialog(false);
				setSelectedIds(new Set());
				// Soft navigation - Server Component refetches with revalidatePath()
				router.refresh();
			} else {
				toast.error("Failed to archive estimates");
			}
		} catch (_error) {
			toast.error("Failed to archive estimates");
		} finally {
			setIsArchiving(false);
		}
	}, [selectedIds]);

	const handleUnlinkEstimate = useCallback(async () => {
		if (!unlinkEstimateId) {
			return;
		}

		setIsUnlinking(true);
		try {
			const result = await unlinkEstimateFromJob(unlinkEstimateId);

			if (result.success) {
				toast.success("Estimate unlinked from job");
				setUnlinkEstimateId(null);
				// Soft navigation - Server Component refetches with revalidatePath()
				router.refresh();
			} else {
				toast.error(result.error || "Failed to unlink estimate");
			}
		} catch (_error) {
			toast.error("Failed to unlink estimate");
		} finally {
			setIsUnlinking(false);
		}
	}, [unlinkEstimateId]);

	const columns: ColumnDef<Estimate>[] = useMemo(
		() => [
			{
				key: "estimate_number",
				header: "Estimate #",
				width: "w-40",
				shrink: true,
				render: (estimate) => (
					<Link
						className="text-foreground hover:text-primary truncate text-xs font-medium transition-colors hover:underline"
						href={`/dashboard/work/estimates/${estimate.id}`}
						title={estimate.estimate_number}
					>
						{estimate.estimate_number}
					</Link>
				),
			},
			{
				key: "title",
				header: "Title",
				width: "flex-1",
				render: (estimate) => (
					<Link
						className="block min-w-0"
						href={`/dashboard/work/estimates/${estimate.id}`}
						onClick={(e) => e.stopPropagation()}
						title={estimate.title || undefined}
					>
						<span className="text-foreground truncate text-xs leading-tight font-medium hover:underline">
							{estimate.title || "—"}
						</span>
					</Link>
				),
			},
			{
				key: "status",
				header: "Status",
				width: "w-32",
				shrink: true,
				render: (estimate) => <EstimateStatusBadge status={estimate.status} />,
			},
			{
				key: "total_amount",
				header: "Amount",
				width: "w-36",
				shrink: true,
				align: "right",
				render: (estimate) => (
					<span className="text-xs font-semibold tabular-nums">
						{formatCurrencyCents(estimate.total_amount)}
					</span>
				),
			},
			{
				key: "valid_until",
				header: "Valid Until",
				width: "w-36",
				shrink: true,
				hideOnMobile: true,
				render: (estimate) => (
					<span className="text-muted-foreground text-xs tabular-nums">
						{estimate.valid_until
							? formatDate(estimate.valid_until, "short")
							: "—"}
					</span>
				),
			},
			{
				key: "actions",
				header: "",
				width: "w-12",
				shrink: true,
				align: "right",
				render: (estimate) => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button className="size-8 p-0" size="sm" variant="ghost">
								<MoreHorizontal className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuItem asChild className="cursor-pointer">
								<Link href={`/dashboard/work/estimates/${estimate.id}`}>
									<Eye className="mr-2 size-4" />
									View Details
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className="cursor-pointer">
								<Download className="mr-2 size-4" />
								Download PDF
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="cursor-pointer">
								<Send className="mr-2 size-4" />
								Send to Customer
							</DropdownMenuItem>
							<DropdownMenuItem className="cursor-pointer">
								<CheckCircle className="mr-2 size-4" />
								Convert to Invoice
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-destructive focus:text-destructive cursor-pointer"
								onClick={() => setUnlinkEstimateId(estimate.id)}
							>
								<Link2Off className="mr-2 size-4" />
								Unlink from Job
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				),
			},
		],
		[formatCurrencyCents],
	);

	const bulkActions: BulkAction[] = useMemo(
		() => [
			{
				label: "Archive Selected",
				icon: <Archive className="h-4 w-4" />,
				variant: "destructive",
				onClick: (selectedIds: Set<string>) => {
					setSelectedIds(selectedIds);
					setShowArchiveDialog(true);
				},
			},
		],
		[],
	);

	return (
		<>
			<FullWidthDataTable
				{...TablePresets.compact()}
				bulkActions={bulkActions}
				columns={columns}
				data={estimates}
				emptyIcon={<Receipt className="text-muted-foreground/50 size-12" />}
				emptyMessage="No estimates found for this job"
				getItemId={(estimate) => estimate.id}
				noPadding={true}
				searchFilter={(estimate, query) => {
					const searchLower = query.toLowerCase();
					return (
						estimate.estimate_number?.toLowerCase().includes(searchLower) ||
						estimate.title?.toLowerCase().includes(searchLower) ||
						estimate.status?.toLowerCase().includes(searchLower)
					);
				}}
				searchPlaceholder="Search estimates..."
			/>

			<ArchiveConfirmDialog
				entityType="estimate"
				isLoading={isArchiving}
				itemCount={selectedIds.size}
				onConfirm={handleArchive}
				onOpenChange={setShowArchiveDialog}
				open={showArchiveDialog}
			/>

			{/* Unlink Confirmation Dialog */}
			<Dialog
				onOpenChange={(open) => !open && setUnlinkEstimateId(null)}
				open={unlinkEstimateId !== null}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Unlink Estimate from Job?</DialogTitle>
						<DialogDescription>
							This will remove the job association from this estimate. The
							estimate will remain in the system but will no longer appear on
							this job's page.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							disabled={isUnlinking}
							onClick={() => setUnlinkEstimateId(null)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={isUnlinking}
							onClick={handleUnlinkEstimate}
							variant="destructive"
						>
							{isUnlinking ? "Unlinking..." : "Unlink Estimate"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
