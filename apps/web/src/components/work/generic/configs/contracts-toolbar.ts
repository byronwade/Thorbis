/**
 * Contracts Detail Toolbar Configuration
 *
 * Configuration for GenericDetailToolbar on contract detail pages.
 * Replaces the standalone contract-detail-toolbar-actions.tsx component.
 */

import { Copy, Download, Mail } from "lucide-react";
import { toast } from "sonner";
import type { GenericDetailToolbarConfig, ToolbarActionConfig } from "../types";

// =============================================================================
// TYPE DEFINITION
// =============================================================================

export type ContractForToolbar = {
	id: string;
	status?: string;
	contractNumber?: string;
};

// =============================================================================
// PRIMARY ACTIONS
// =============================================================================

const primaryActions: ToolbarActionConfig<ContractForToolbar>[] = [
	{
		id: "send",
		label: "Send",
		icon: Mail,
		type: "button",
		tooltip: "Send for signature",
		onClick: async (contract) => {
			toast.info("Send for signature functionality coming soon");
		},
		showWhen: (contract) => contract.status === "draft",
	},
	{
		id: "download-pdf",
		label: "PDF",
		icon: Download,
		type: "button",
		tooltip: "Download PDF",
		onClick: async (contract) => {
			toast.info("PDF download functionality coming soon");
		},
	},
	{
		id: "duplicate",
		label: "Copy",
		icon: Copy,
		type: "link",
		tooltip: "Duplicate contract",
		href: (contract) => `/dashboard/work/contracts/new?cloneFrom=${contract.id}`,
	},
];

// =============================================================================
// MORE ACTIONS (DROPDOWN)
// =============================================================================

const moreActions: ToolbarActionConfig<ContractForToolbar>[] = [];

// =============================================================================
// CONFIGURATION EXPORT
// =============================================================================

export const contractsToolbarConfig: GenericDetailToolbarConfig<ContractForToolbar> = {
	entityType: "contract",
	showStatusDropdown: true,
	primaryActions,
	moreActions,
	archive: {
		action: async (id: string) => {
			const { archiveContract } = await import("@/actions/contracts");
			return archiveContract(id);
		},
		redirectUrl: "/dashboard/work/contracts",
	},
	showImportExport: true,
	importExportDataType: "contracts",
};
