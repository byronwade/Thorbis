"use client";

import { Archive, Download, Eye, FileSignature, MoreHorizontal, Plus, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type BulkAction, type ColumnDef, FullWidthDataTable } from "@/components/ui/full-width-datatable";
import { ContractStatusBadge, ContractTypeBadge } from "@/components/ui/status-badge";
import { useArchiveStore } from "@/lib/stores/archive-store";

export type Contract = {
	id: string;
	contractNumber: string;
	customer: string;
	title: string;
	date: string;
	validUntil: string;
	status: "draft" | "sent" | "viewed" | "signed" | "rejected" | "expired";
	contractType: "service" | "maintenance" | "custom";
	signerName: string | null;
	archived_at?: string | null;
	deleted_at?: string | null;
};

export function ContractsTable({ contracts, itemsPerPage = 50 }: { contracts: Contract[]; itemsPerPage?: number }) {
	// Archive filter state
	const archiveFilter = useArchiveStore((state) => state.filters.contracts);

	// State for archive confirmation dialogs
	const [isSingleArchiveOpen, setIsSingleArchiveOpen] = useState(false);
	const [isBulkArchiveOpen, setIsBulkArchiveOpen] = useState(false);
	const [contractToArchive, setContractToArchive] = useState<string | null>(null);
	const [selectedContractIds, setSelectedContractIds] = useState<Set<string>>(new Set());

	// Filter contracts based on archive status
	const filteredContracts = contracts.filter((contract) => {
		const isArchived = Boolean(contract.archived_at || contract.deleted_at);
		if (archiveFilter === "active") {
			return !isArchived;
		}
		if (archiveFilter === "archived") {
			return isArchived;
		}
		return true; // "all"
	});

	const columns: ColumnDef<Contract>[] = [
		{
			key: "contractNumber",
			header: "Contract #",
			width: "w-36",
			shrink: true,
			sortable: true,
			hideable: false,
			render: (contract) => (
				<Link
					className="font-medium text-foreground text-sm transition-colors hover:text-primary hover:underline"
					href={`/dashboard/work/contracts/${contract.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					{contract.contractNumber}
				</Link>
			),
		},
		{
			key: "customer",
			header: "Customer",
			width: "w-48",
			shrink: true,
			sortable: true,
			hideable: false, // CRITICAL: Customer essential for quick identification
			render: (contract) => (
				<div className="min-w-0">
					<div className="truncate font-medium leading-tight">{contract.customer}</div>
				</div>
			),
		},
		{
			key: "title",
			header: "Title",
			width: "flex-1",
			sortable: true,
			hideable: false,
			render: (contract) => (
				<Link
					className="block min-w-0"
					href={`/dashboard/work/contracts/${contract.id}`}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="truncate font-medium text-sm leading-tight hover:underline">{contract.title}</div>
				</Link>
			),
		},
		{
			key: "contractType",
			header: "Type",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			sortable: true,
			hideable: true,
			render: (contract) => <ContractTypeBadge type={contract.contractType} />,
		},
		{
			key: "signerName",
			header: "Signer",
			width: "w-40",
			shrink: true,
			hideOnMobile: true,
			sortable: true,
			hideable: true,
			render: (contract) => (
				<span className="text-muted-foreground text-sm leading-tight">
					{contract.signerName || <span className="text-muted-foreground">Not assigned</span>}
				</span>
			),
		},
		{
			key: "date",
			header: "Created",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			sortable: true,
			hideable: true,
			render: (contract) => (
				<span className="text-muted-foreground text-sm tabular-nums leading-tight">{contract.date}</span>
			),
		},
		{
			key: "validUntil",
			header: "Valid Until",
			width: "w-32",
			shrink: true,
			hideOnMobile: true,
			sortable: true,
			hideable: true,
			render: (contract) => (
				<span className="text-muted-foreground text-sm tabular-nums leading-tight">{contract.validUntil}</span>
			),
		},
		{
			key: "status",
			header: "Status",
			width: "w-28",
			shrink: true,
			sortable: true,
			hideable: false, // CRITICAL: Status key for action items
			render: (contract) => <ContractStatusBadge status={contract.status} />,
		},
		{
			key: "actions",
			header: "",
			width: "w-10",
			shrink: true,
			sortable: false,
			hideable: false,
			render: (contract) => (
				<div data-no-row-click>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="icon" variant="ghost">
								<MoreHorizontal className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<Eye className="mr-2 size-4" />
								View Contract
							</DropdownMenuItem>
							{contract.status === "draft" && (
								<DropdownMenuItem>
									<Send className="mr-2 size-4" />
									Send for Signature
								</DropdownMenuItem>
							)}
							<DropdownMenuItem>
								<Download className="mr-2 size-4" />
								Download PDF
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-destructive"
								onClick={() => {
									setContractToArchive(contract.id);
									setIsSingleArchiveOpen(true);
								}}
							>
								<Archive className="mr-2 size-4" />
								Archive Contract
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			),
		},
	];

	const bulkActions: BulkAction[] = [
		{
			label: "Send",
			icon: <Send className="h-4 w-4" />,
			onClick: (_selectedIds) => {},
		},
		{
			label: "Download",
			icon: <Download className="h-4 w-4" />,
			onClick: (_selectedIds) => {},
		},
		{
			label: "Archive Selected",
			icon: <Archive className="h-4 w-4" />,
			onClick: async (selectedIds) => {
				setSelectedContractIds(selectedIds);
				setIsBulkArchiveOpen(true);
			},
			variant: "destructive",
		},
	];

	const searchFilter = (contract: Contract, query: string) => {
		const searchStr = query.toLowerCase();
		return (
			contract.contractNumber.toLowerCase().includes(searchStr) ||
			contract.customer.toLowerCase().includes(searchStr) ||
			contract.title.toLowerCase().includes(searchStr) ||
			contract.status.toLowerCase().includes(searchStr) ||
			contract.contractType.toLowerCase().includes(searchStr) ||
			(contract.signerName?.toLowerCase().includes(searchStr) ?? false)
		);
	};

	return (
		<>
			<FullWidthDataTable
				bulkActions={bulkActions}
				columns={columns}
				data={filteredContracts}
				emptyAction={
					<Button onClick={() => (window.location.href = "/dashboard/work/contracts/new")} size="sm">
						<Plus className="mr-2 size-4" />
						Create Contract
					</Button>
				}
				emptyIcon={<FileSignature className="h-8 w-8 text-muted-foreground" />}
				emptyMessage="No contracts found"
				enableSelection={true}
				entity="contracts"
				getHighlightClass={() => "bg-success/30 dark:bg-success/10"}
				getItemId={(contract) => contract.id}
				isArchived={(contract) => Boolean(contract.archived_at || contract.deleted_at)}
				isHighlighted={(contract) => contract.status === "signed"}
				itemsPerPage={itemsPerPage}
				onRefresh={() => window.location.reload()}
				onRowClick={(contract) => (window.location.href = `/dashboard/work/contracts/${contract.id}`)}
				searchFilter={searchFilter}
				searchPlaceholder="Search contracts by number, customer, title, or status..."
				showArchived={archiveFilter !== "active"}
				showRefresh={false}
			/>

			{/* Single Contract Archive Dialog */}
			<AlertDialog onOpenChange={setIsSingleArchiveOpen} open={isSingleArchiveOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Archive Contract?</AlertDialogTitle>
						<AlertDialogDescription>
							This contract will be archived and can be restored within 90 days. After 90 days, it will be permanently
							deleted.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={async () => {
								if (contractToArchive) {
									window.location.reload();
								}
							}}
						>
							Archive
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Bulk Archive Dialog */}
			<AlertDialog onOpenChange={setIsBulkArchiveOpen} open={isBulkArchiveOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Archive {selectedContractIds.size} Contract(s)?</AlertDialogTitle>
						<AlertDialogDescription>
							These contracts will be archived and can be restored within 90 days. After 90 days, they will be
							permanently deleted.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={async () => {
								// TODO: Implement bulk archive action
								for (const _contractId of selectedContractIds) {
								}
								window.location.reload();
							}}
						>
							Archive All
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
