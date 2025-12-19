/**
 * Contracts Table Configuration
 *
 * Configuration for GenericWorkTable to display contracts.
 * Replaces the standalone contracts-table.tsx component.
 */

import type { ColumnDef } from "@/components/ui/full-width-datatable";
import {
	ContractStatusBadge,
	ContractTypeBadge,
} from "@/components/ui/status-badge";
import { Archive, Download, Eye, FileSignature, RotateCcw, Send } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { GenericWorkTableConfig, RowActionHandlers } from "../types";

// =============================================================================
// TYPE DEFINITION
// =============================================================================

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

// =============================================================================
// COLUMN DEFINITIONS
// =============================================================================

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
				className="text-foreground hover:text-primary text-sm font-medium transition-colors hover:underline"
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
				<div className="truncate leading-tight font-medium">{contract.customer}</div>
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
				<div className="truncate text-sm leading-tight font-medium hover:underline">
					{contract.title}
				</div>
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
			<span className="text-muted-foreground text-sm leading-tight tabular-nums">
				{contract.date}
			</span>
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
			<span className="text-muted-foreground text-sm leading-tight tabular-nums">
				{contract.validUntil}
			</span>
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
];

// =============================================================================
// ROW ACTIONS
// =============================================================================

function buildRowActions(contract: Contract, handlers: RowActionHandlers) {
	const isArchived = Boolean(contract.archived_at || contract.deleted_at);

	if (isArchived) {
		return [
			{
				label: "View Contract",
				icon: Eye,
				href: `/dashboard/work/contracts/${contract.id}`,
			},
			{
				label: "Restore",
				icon: RotateCcw,
				onClick: () => handlers.openRestoreDialog(contract.id),
				separatorBefore: true,
			},
		];
	}

	const actions = [
		{
			label: "View Contract",
			icon: Eye,
			href: `/dashboard/work/contracts/${contract.id}`,
		},
	];

	// Only show send option for drafts
	if (contract.status === "draft") {
		actions.push({
			label: "Send for Signature",
			icon: Send,
			onClick: () => {
				toast.info("Send for signature functionality coming soon");
			},
		});
	}

	actions.push({
		label: "Download PDF",
		icon: Download,
		onClick: () => {
			toast.info("PDF download functionality coming soon");
		},
	});

	actions.push({
		label: "Archive",
		icon: Archive,
		onClick: () => handlers.openArchiveDialog(contract.id),
		variant: "destructive" as const,
		separatorBefore: true,
	});

	return actions;
}

// =============================================================================
// BULK ACTIONS
// =============================================================================

const bulkActions = [
	{
		label: "Send",
		icon: Send,
		onClick: async (selectedIds: Set<string>) => {
			toast.info(
				`Send functionality for ${selectedIds.size} contract${selectedIds.size > 1 ? "s" : ""} coming soon`
			);
		},
	},
	{
		label: "Export",
		icon: Download,
		onClick: async (selectedIds: Set<string>, items: Contract[]) => {
			const selectedContracts = items.filter((c) => selectedIds.has(c.id));
			const csvContent = [
				[
					"Contract #",
					"Customer",
					"Title",
					"Type",
					"Signer",
					"Created",
					"Valid Until",
					"Status",
				].join(","),
				...selectedContracts.map((c) =>
					[
						c.contractNumber,
						`"${c.customer}"`,
						`"${c.title}"`,
						c.contractType,
						c.signerName || "",
						c.date,
						c.validUntil,
						c.status,
					].join(",")
				),
			].join("\n");

			const blob = new Blob([csvContent], { type: "text/csv" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `contracts-export-${new Date().toISOString().split("T")[0]}.csv`;
			a.click();
			URL.revokeObjectURL(url);

			toast.success(`Exported ${selectedIds.size} contract${selectedIds.size > 1 ? "s" : ""}`);
		},
	},
];

// =============================================================================
// CONFIGURATION EXPORT
// =============================================================================

export const contractsTableConfig: GenericWorkTableConfig<Contract> = {
	entityType: "contracts",
	entityLabel: {
		singular: "Contract",
		plural: "Contracts",
	},
	columns,
	rowActions: buildRowActions,
	bulkActions,
	archive: {
		storeKey: "contracts",
		action: async (id: string) => {
			const { archiveContract } = await import("@/actions/contracts");
			return archiveContract(id);
		},
		restoreAction: async (id: string) => {
			const { restoreContract } = await import("@/actions/contracts");
			return restoreContract(id);
		},
	},
	emptyState: {
		icon: FileSignature,
		message: "No contracts found",
		actionLabel: "Create Contract",
		actionHref: "/dashboard/work/contracts/new",
	},
	navigation: {
		getDetailUrl: (contract) => `/dashboard/work/contracts/${contract.id}`,
		createUrl: "/dashboard/work/contracts/new",
	},
	search: {
		placeholder: "Search contracts by number, customer, title, or status...",
		filter: (contract, query) => {
			const searchStr = query.toLowerCase();
			return (
				contract.contractNumber.toLowerCase().includes(searchStr) ||
				contract.customer.toLowerCase().includes(searchStr) ||
				contract.title.toLowerCase().includes(searchStr) ||
				contract.status.toLowerCase().includes(searchStr) ||
				contract.contractType.toLowerCase().includes(searchStr) ||
				(contract.signerName?.toLowerCase().includes(searchStr) ?? false)
			);
		},
	},
	highlight: {
		condition: (contract) => contract.status === "signed",
		className: "bg-success/30 dark:bg-success/10",
	},
	serverPagination: true,
	itemsPerPage: 50,
};
