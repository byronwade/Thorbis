"use client";

/**
 * ContractsTable Component
 *
 * Full-width Gmail-style table for displaying contracts.
 * Now uses GenericWorkTable with configuration for maximum reusability.
 *
 * Features:
 * - Full-width responsive layout
 * - Row selection with bulk actions
 * - Search and filtering
 * - Status badges
 * - Signed contract highlighting
 * - Archive with restore capability
 */

import { GenericWorkTable } from "@/components/work/generic";
import { contractsTableConfig, type Contract } from "@/components/work/generic/configs/contracts";

type ContractsTableProps = {
	contracts: Contract[];
	itemsPerPage?: number;
	currentPage?: number;
	totalCount?: number;
	onContractClick?: (contract: Contract) => void;
	showRefresh?: boolean;
};

export function ContractsTable({
	contracts,
	itemsPerPage = 50,
	currentPage = 1,
	totalCount,
	onContractClick,
	showRefresh = false,
}: ContractsTableProps) {
	return (
		<GenericWorkTable
			config={contractsTableConfig}
			data={contracts}
			totalCount={totalCount}
			currentPage={currentPage}
			itemsPerPage={itemsPerPage}
			onRowClick={onContractClick}
			showRefresh={showRefresh}
		/>
	);
}

// Re-export type for backward compatibility
export type { Contract };
