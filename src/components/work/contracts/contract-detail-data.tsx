import { notFound, redirect } from "next/navigation";
import { ToolbarStatsProvider } from "@/components/layout/toolbar-stats-provider";
import type { StatCard } from "@/components/ui/stats-cards";
import type {
	AppointmentRecord,
	ContractPageEntityData,
	ContractRecord,
	CustomerRecord,
	PropertyRecord,
	RelatedEstimate,
	RelatedInvoice,
	RelatedJob,
} from "@/components/work/contracts/contract-page-content";
import { ContractPageContent } from "@/components/work/contracts/contract-page-content";
import { isActiveCompanyOnboardingComplete } from "@/lib/auth/company-context";
import { formatDate } from "@/lib/formatters";
import { getContractComplete } from "@/lib/queries/contracts";
import { createClient } from "@/lib/supabase/server";

type ContractDetailDataProps = {
	contractId: string;
};

function formatStatusLabel(status: string | null | undefined): string {
	if (!status) {
		return "Draft";
	}

	return status
		.toString()
		.split("_")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function formatStatDate(
	value: string | null | undefined,
	fallback: string,
): string {
	if (!value) {
		return fallback;
	}

	const formatted = formatDate(value, { preset: "short" });
	return formatted === "—" ? fallback : formatted;
}

function resolveCustomerName(
	customer: CustomerRecord | null,
	fallback: string,
): string {
	if (!customer) {
		return fallback;
	}

	if (customer.display_name) {
		return customer.display_name;
	}

	const fullName =
		`${customer.first_name || ""} ${customer.last_name || ""}`.trim();

	if (fullName) {
		return fullName;
	}

	return fallback;
}

/**
 * Contract Detail Data - Async Server Component
 *
 * Uses single optimized RPC query instead of N+1 pattern:
 * 1. Auth user check and onboarding check
 * 2. Contract with tags, estimate, invoice, and job data (single RPC call)
 * 3. Property and appointments (parallel)
 *
 * Streams in after shell renders (100-300ms).
 */
export async function ContractDetailData({
	contractId,
}: ContractDetailDataProps) {
	const supabase = await createClient();

	if (!supabase) {
		return notFound();
	}

	// Get authenticated user
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return notFound();
	}

	// Check if active company has completed onboarding
	const isOnboardingComplete = await isActiveCompanyOnboardingComplete();

	if (!isOnboardingComplete) {
		redirect("/dashboard/welcome");
	}

	// Get active company ID
	const { getActiveCompanyId } = await import("@/lib/auth/company-context");
	const activeCompanyId = await getActiveCompanyId();

	if (!activeCompanyId) {
		redirect("/dashboard/welcome");
	}

	// ✅ Load contract with tags via single RPC call
	const contractData = await getContractComplete(contractId, activeCompanyId);

	if (!contractData) {
		return notFound();
	}

	// Extract related entities from RPC response
	const estimate = contractData.estimate;
	const invoice = contractData.invoice;
	const job = contractData.job;

	// Get customer from estimate, invoice, or job
	const customer =
		estimate?.customer || invoice?.customer || job?.customer || null;
	const customerId =
		estimate?.customer?.id || invoice?.customer?.id || job?.customer?.id;

	// Fetch property (via job) and appointments for contract context
	const [{ data: property }, { data: appointments }] = await Promise.all([
		// Fetch property via job
		job?.id
			? supabase
					.from("jobs")
					.select("property_id, property:properties!property_id(*)")
					.eq("id", job.id)
					.single()
					.then((result) => ({
						data: result.data?.property
							? Array.isArray(result.data.property)
								? result.data.property[0]
								: result.data.property
							: null,
						error: result.error,
					}))
			: Promise.resolve({ data: null, error: null }),

		// Fetch appointments related to the job
		job?.id
			? supabase
					.from("appointments")
					.select("id, scheduled_start, scheduled_end, status, type")
					.eq("job_id", job.id)
					.is("deleted_at", null)
					.order("scheduled_start", { ascending: false })
					.limit(5)
			: Promise.resolve({ data: [], error: null }),
	]);

	// Transform contract data
	const normalizedCustomer = (customer ?? null) as CustomerRecord | null;
	const normalizedProperty = (property ?? null) as PropertyRecord | null;
	const normalizedEstimate = (estimate ?? null) as RelatedEstimate | null;
	const normalizedInvoice = (invoice ?? null) as RelatedInvoice | null;
	const normalizedJob = (job ?? null) as RelatedJob | null;
	const normalizedAppointments = (appointments ?? []) as AppointmentRecord[];

	const customerFallback =
		normalizedCustomer?.display_name ||
		`${normalizedCustomer?.first_name || ""} ${normalizedCustomer?.last_name || ""}`.trim() ||
		contractData.signer_email ||
		"Unknown Customer";

	const contract: ContractRecord & { contract_tags?: any[] } = {
		id: contractData.id,
		contractNumber: contractData.contract_number,
		title: contractData.title,
		description: contractData.description,
		customerName: resolveCustomerName(normalizedCustomer, customerFallback),
		customerId: customerId || null,
		status: contractData.status,
		contractType: contractData.contract_type,
		signerName: contractData.signer_name,
		signerEmail: contractData.signer_email,
		signerTitle: contractData.signer_title,
		signerCompany: contractData.signer_company,
		signedAt: contractData.signed_at,
		sentAt: contractData.sent_at,
		viewedAt: contractData.viewed_at,
		createdAt: contractData.created_at,
		validFrom: contractData.valid_from,
		validUntil: contractData.valid_until,
		ipAddress: contractData.ip_address,
		content: contractData.content,
		terms: contractData.terms,
		notes: contractData.notes,
		contract_tags: contractData.contract_tags || [],
	};

	const entityData: ContractPageEntityData = {
		contract,
		customer: normalizedCustomer,
		property: normalizedProperty,
		estimate: normalizedEstimate,
		invoice: normalizedInvoice,
		job: normalizedJob,
		appointments: normalizedAppointments,
	};

	const linkedRecordsCount = [
		normalizedEstimate,
		normalizedInvoice,
		normalizedJob,
	].filter(Boolean).length;

	const stats: StatCard[] = [
		{
			label: "Status",
			value: formatStatusLabel(contract.status ?? null),
		},
		{
			label: "Sent",
			value: formatStatDate(contract.sentAt, "Not sent"),
		},
		{
			label: "Signed",
			value: formatStatDate(contract.signedAt, "Pending"),
		},
		{
			label: "Valid Until",
			value: formatStatDate(contract.validUntil, "No expiry"),
		},
		{
			label: "Linked Records",
			value: linkedRecordsCount,
		},
	];

	return (
		<ToolbarStatsProvider stats={stats}>
			<ContractPageContent entityData={entityData} />
		</ToolbarStatsProvider>
	);
}
