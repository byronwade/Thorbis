import { notFound } from "next/navigation";
import { ContractsKanban } from "@/components/work/contracts-kanban";
import { type Contract, ContractsTable } from "@/components/work/contracts-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

/**
 * ContractsData - Async Server Component
 *
 * Fetches and displays contracts data.
 * This streams in after the stats render.
 */
export async function ContractsData() {
	const supabase = await createClient();

	if (!supabase) {
		return notFound();
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return notFound();
	}

	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		return notFound();
	}

	// Fetch contracts from database
	const { data: contractsRaw, error } = await supabase
		.from("contracts")
		.select("*")
		.eq("company_id", activeCompanyId)
		.order("created_at", { ascending: false });

	if (error) {
	}

	let contracts: Contract[] = [];

	// Only process if we have data
	if (!error && contractsRaw) {
		// Fetch customers separately if we have customer IDs
		const customerIds = Array.from(new Set(contractsRaw.map((c: any) => c.customer_id).filter(Boolean)));

		const customersMap = new Map<string, any>();
		if (customerIds.length > 0) {
			const { data: customersData } = await supabase
				.from("customers")
				.select("id, display_name, first_name, last_name, email")
				.in("id", customerIds);

			if (customersData) {
				customersData.forEach((customer) => {
					customersMap.set(customer.id, customer);
				});
			}
		}

		// Transform data for table component
		contracts = contractsRaw.map((contract: any) => {
			const customer = contract.customer_id ? customersMap.get(contract.customer_id) : null;

			return {
				id: contract.id,
				contractNumber: contract.contract_number,
				customer:
					customer?.display_name ||
					`${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() ||
					customer?.email ||
					contract.signer_email ||
					contract.signer_name ||
					"Unknown",
				title: contract.title,
				date: new Date(contract.created_at).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				}),
				validUntil: contract.expires_at
					? new Date(contract.expires_at).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})
					: "",
				status: contract.status as "signed" | "sent" | "draft" | "viewed" | "expired",
				contractType: contract.contract_type || "custom",
				signerName: contract.signer_name || null,
				archived_at: contract.archived_at,
				deleted_at: contract.deleted_at,
			};
		});
	}

	return (
		<WorkDataView
			kanban={<ContractsKanban contracts={contracts} />}
			section="contracts"
			table={<ContractsTable contracts={contracts} itemsPerPage={50} />}
		/>
	);
}
