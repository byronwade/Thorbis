"use client";

import {
	Archive,
	CreditCard,
	Download,
	Edit,
	Eye,
	Link2Off,
	MoreHorizontal,
	Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { bulkArchive } from "@/actions/archive";
import { unlinkPaymentFromJob } from "@/actions/payments";
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
import { TablePresets } from "@/lib/datatable/table-presets";
import { formatCurrency, formatDate } from "@/lib/formatters";

type Payment = {
	id: string;
	amount: number; // in cents
	payment_method?: string;
	reference_number?: string;
	notes?: string;
	created_at: string;
	payment_date?: string;
};

type JobPaymentsTableProps = {
	payments: Payment[];
	onDeletePayment?: (
		paymentId: string,
	) => Promise<{ success: boolean; error?: string }>;
};

export function JobPaymentsTable({
	payments,
	onDeletePayment,
}: JobPaymentsTableProps) {
	const router = useRouter();
	const [deletePaymentId, setDeletePaymentId] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showArchiveDialog, setShowArchiveDialog] = useState(false);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [isArchiving, setIsArchiving] = useState(false);
	const [unlinkPaymentId, setUnlinkPaymentId] = useState<string | null>(null);
	const [isUnlinking, setIsUnlinking] = useState(false);

	const formatCurrencyCents = useCallback(
		(cents: number) =>
			formatCurrency(cents, {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}),
		[],
	);

	const handleArchive = useCallback(async () => {
		if (selectedIds.size === 0) {
			return;
		}

		setIsArchiving(true);
		try {
			const result = await bulkArchive(Array.from(selectedIds), "payment");

			if (result.success && result.data) {
				toast.success(
					`Successfully archived ${result.data.archived} payment${result.data.archived === 1 ? "" : "s"}`,
				);
				setShowArchiveDialog(false);
				setSelectedIds(new Set());
				router.refresh();
			} else {
				toast.error("Failed to archive payments");
			}
		} catch (_error) {
			toast.error("Failed to archive payments");
		} finally {
			setIsArchiving(false);
		}
	}, [selectedIds, router]);

	const handleUnlinkPayment = useCallback(async () => {
		if (!unlinkPaymentId) {
			return;
		}

		setIsUnlinking(true);
		try {
			const result = await unlinkPaymentFromJob(unlinkPaymentId);

			if (result.success) {
				toast.success("Payment unlinked from job");
				setUnlinkPaymentId(null);
				router.refresh();
			} else {
				toast.error(result.error || "Failed to unlink payment");
			}
		} catch (_error) {
			toast.error("Failed to unlink payment");
		} finally {
			setIsUnlinking(false);
		}
	}, [unlinkPaymentId, router]);

	const handleDeletePayment = useCallback(async () => {
		if (!deletePaymentId || !onDeletePayment) {
			return;
		}

		setIsDeleting(true);
		try {
			const result = await onDeletePayment(deletePaymentId);

			if (result.success) {
				toast.success("Payment deleted");
				setDeletePaymentId(null);
				// Refresh to show updated list
				router.refresh();
			} else {
				toast.error(result.error || "Failed to delete payment");
			}
		} catch (_error) {
			toast.error("Failed to delete payment");
		} finally {
			setIsDeleting(false);
		}
	}, [deletePaymentId, onDeletePayment, router]);

	const getPaymentMethodDisplay = useCallback((method?: string) => {
		if (!method) return "—";
		// Convert snake_case or kebab-case to Title Case
		return method
			.split(/[-_]/)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}, []);

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

	const columns: ColumnDef<Payment>[] = useMemo(
		() => [
			{
				key: "payment_date",
				header: "Date",
				width: "w-32",
				shrink: true,
				render: (payment) => (
					<span className="text-xs font-medium">
						{formatDate(payment.payment_date || payment.created_at, "short")}
					</span>
				),
			},
			{
				key: "amount",
				header: "Amount",
				width: "w-32",
				shrink: true,
				align: "right",
				render: (payment) => (
					<span className="font-semibold">
						{formatCurrencyCents(payment.amount)}
					</span>
				),
			},
			{
				key: "payment_method",
				header: "Method",
				width: "w-32",
				shrink: true,
				hideOnMobile: true,
				render: (payment) => (
					<span className="text-xs">
						{getPaymentMethodDisplay(payment.payment_method)}
					</span>
				),
			},
			{
				key: "reference_number",
				header: "Reference",
				width: "w-36",
				shrink: true,
				hideOnMobile: true,
				render: (payment) => (
					<span className="text-muted-foreground font-mono text-xs">
						{payment.reference_number || "—"}
					</span>
				),
			},
			{
				key: "notes",
				header: "Notes",
				render: (payment) => (
					<span className="text-muted-foreground line-clamp-1 text-xs">
						{payment.notes || "—"}
					</span>
				),
			},
			{
				key: "actions",
				header: "",
				width: "w-12",
				shrink: true,
				align: "right",
				render: (payment) => {
					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className="size-8 p-0" size="sm" variant="ghost">
									<MoreHorizontal className="size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem className="cursor-pointer">
									<Eye className="mr-2 size-4" />
									View Details
								</DropdownMenuItem>
								<DropdownMenuItem className="cursor-pointer">
									<Download className="mr-2 size-4" />
									Download Receipt
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="cursor-pointer">
									<Edit className="mr-2 size-4" />
									Edit Payment
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive focus:text-destructive cursor-pointer"
									onClick={() => setUnlinkPaymentId(payment.id)}
								>
									<Link2Off className="mr-2 size-4" />
									Unlink from Job
								</DropdownMenuItem>
								{onDeletePayment && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="text-destructive focus:text-destructive cursor-pointer"
											onClick={() => setDeletePaymentId(payment.id)}
										>
											<Trash2 className="mr-2 size-4" />
											Delete Payment
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
		],
		[formatCurrencyCents, getPaymentMethodDisplay, onDeletePayment],
	);

	return (
		<>
			<FullWidthDataTable
				{...TablePresets.compact()}
				bulkActions={bulkActions}
				columns={columns}
				data={payments}
				emptyIcon={<CreditCard className="text-muted-foreground/50 size-12" />}
				emptyMessage="No payments found for this job"
				getItemId={(payment) => payment.id}
				noPadding={true}
				searchFilter={(payment, query) => {
					const searchLower = query.toLowerCase();
					return (
						payment.reference_number?.toLowerCase().includes(searchLower) ||
						payment.payment_method?.toLowerCase().includes(searchLower) ||
						payment.notes?.toLowerCase().includes(searchLower) ||
						formatCurrencyCents(payment.amount)
							.toLowerCase()
							.includes(searchLower)
					);
				}}
				searchPlaceholder="Search payments..."
			/>

			<ArchiveConfirmDialog
				entityType="payment"
				isLoading={isArchiving}
				itemCount={selectedIds.size}
				onConfirm={handleArchive}
				onOpenChange={setShowArchiveDialog}
				open={showArchiveDialog}
			/>

			{/* Unlink Confirmation Dialog */}
			<Dialog
				onOpenChange={(open) => !open && setUnlinkPaymentId(null)}
				open={unlinkPaymentId !== null}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Unlink Payment from Job?</DialogTitle>
						<DialogDescription>
							This will remove the job association from this payment. The
							payment will remain in the system but will no longer appear on
							this job's page.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							disabled={isUnlinking}
							onClick={() => setUnlinkPaymentId(null)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={isUnlinking}
							onClick={handleUnlinkPayment}
							variant="destructive"
						>
							{isUnlinking ? "Unlinking..." : "Unlink Payment"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			{onDeletePayment && (
				<Dialog
					onOpenChange={(open) => !open && setDeletePaymentId(null)}
					open={deletePaymentId !== null}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Delete Payment?</DialogTitle>
							<DialogDescription>
								This will permanently delete this payment record. This action
								cannot be undone. Are you sure you want to continue?
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button
								disabled={isDeleting}
								onClick={() => setDeletePaymentId(null)}
								variant="outline"
							>
								Cancel
							</Button>
							<Button
								disabled={isDeleting}
								onClick={handleDeletePayment}
								variant="destructive"
							>
								{isDeleting ? "Deleting..." : "Delete Payment"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
