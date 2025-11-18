import { notFound } from "next/navigation";
import { ContractsKanban } from "@/components/work/contracts-kanban";
import {
	type Contract,
	ContractsTable,
} from "@/components/work/contracts-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { getCurrentUser } from "@/lib/auth/session";
import {
	CONTRACTS_PAGE_SIZE,
	type ContractQueryResult,
	getContractsPageData,
} from "@/lib/queries/contracts";

type RelatedCustomer = {
	display_name: string | null;
	first_name: string | null;
	last_name: string | null;
	company_name: string | null;
	email: string | null;
};

const formatDate = (value?: string | null) =>
	value
		? new Date(value).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			})
		: "";

const resolveRelation = <T,>(
	relation: T | T[] | null | undefined,
): T | null => {
	if (!relation) {
		return null;
	}
	return Array.isArray(relation) ? (relation[0] ?? null) : relation;
};

const getCustomerLabel = (
	customer: RelatedCustomer | null,
	fallbackName?: string | null,
	fallbackEmail?: string | null,
) => {
	if (customer?.display_name) {
		return customer.display_name;
	}

	const fullName =
		`${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`.trim();
	if (fullName) {
		return fullName;
	}

	if (customer?.company_name) {
		return customer.company_name;
	}

	if (customer?.email) {
		return customer.email;
	}

	return fallbackName || fallbackEmail || "Unknown";
};

/**
 * ContractsData - Async Server Component
 *
 * Fetches and displays contracts data.
 * This streams in after the stats render.
 */
export async function ContractsData({
	searchParams,
}: {
	searchParams?: { page?: string };
}) {
	const [user, activeCompanyId] = await Promise.all([
		getCurrentUser(),
		getActiveCompanyId(),
	]);

	if (!user) {
		return notFound();
	}

	if (!activeCompanyId) {
		return notFound();
	}

	const currentPage = Number(searchParams?.page) || 1;
	const { contracts: contractsRaw, totalCount } = await getContractsPageData(
		currentPage,
		CONTRACTS_PAGE_SIZE,
		activeCompanyId,
	);

	const contracts: Contract[] = (contractsRaw ?? []).map(
		(contract: ContractQueryResult) => {
			const invoiceCustomer = resolveRelation(
				contract.invoice?.customer,
			) as RelatedCustomer | null;
			const estimateCustomer = resolveRelation(
				contract.estimate?.customer,
			) as RelatedCustomer | null;
			const jobCustomer = resolveRelation(
				contract.job?.customer,
			) as RelatedCustomer | null;

			const resolvedCustomer =
				invoiceCustomer ?? estimateCustomer ?? jobCustomer ?? null;
			const expiresAt =
				(contract as { expires_at?: string | null }).expires_at ??
				contract.valid_until;

			return {
				id: contract.id,
				contractNumber: contract.contract_number,
				customer: getCustomerLabel(
					resolvedCustomer,
					contract.signer_name,
					contract.signer_email,
				),
				title: contract.title,
				date: formatDate(contract.created_at),
				validUntil: formatDate(expiresAt),
				status: (contract.status as Contract["status"]) || "draft",
				contractType:
					(contract.contract_type as Contract["contractType"]) || "custom",
				signerName: contract.signer_name || null,
				archived_at: contract.archived_at ?? null,
				deleted_at: contract.deleted_at ?? null,
			};
		},
	);

	return (
		<WorkDataView
			kanban={<ContractsKanban contracts={contracts} />}
			section="contracts"
			table={
				<ContractsTable
					contracts={contracts}
					currentPage={currentPage}
					itemsPerPage={CONTRACTS_PAGE_SIZE}
					totalCount={totalCount}
				/>
			}
		/>
	);
}
