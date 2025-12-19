"use client";

/**
 * PaymentsTable Component
 *
 * Full-width Gmail-style table for displaying payments.
 * Now uses GenericWorkTable with configuration for maximum reusability.
 *
 * Features:
 * - Full-width responsive layout
 * - Row selection with bulk actions
 * - Search and filtering
 * - Status badges
 * - Click to view payment details
 * - Archive with restore capability
 */

import { GenericWorkTable } from "@/components/work/generic";
import { paymentsTableConfig, type Payment } from "@/components/work/generic/configs/payments";

type PaymentsTableProps = {
	payments: Payment[];
	itemsPerPage?: number;
	onPaymentClick?: (payment: Payment) => void;
	showRefresh?: boolean;
	totalCount?: number;
	currentPage?: number;
};

export function PaymentsTable({
	payments,
	itemsPerPage = 50,
	onPaymentClick,
	showRefresh = false,
	totalCount,
	currentPage = 1,
}: PaymentsTableProps) {
	return (
		<GenericWorkTable
			config={paymentsTableConfig}
			data={payments}
			totalCount={totalCount}
			currentPage={currentPage}
			itemsPerPage={itemsPerPage}
			onRowClick={onPaymentClick}
			showRefresh={showRefresh}
		/>
	);
}

// Re-export type for backward compatibility
export type { Payment };
