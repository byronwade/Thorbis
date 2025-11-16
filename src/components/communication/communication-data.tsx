import {
	CommunicationPageClient,
	type CommunicationRecord,
	type CompanyPhone,
} from "@/components/communication/communication-page-client";
import { CompanyGate } from "@/components/company/company-gate";
import { getActiveCompanyId, getUserCompanies } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type CommunicationQueryResult = Omit<CommunicationRecord, "customer"> & {
	customer: NonNullable<CommunicationRecord["customer"]>[] | null;
};

type PhoneNumberRow = Database["public"]["Tables"]["phone_numbers"]["Row"];

const COMMUNICATION_LIMIT = 200;

/**
 * Communication Data - Async Server Component
 *
 * Fetches communications and phone numbers data.
 * Streams in after shell renders.
 */
export async function CommunicationData() {
	const t1 = Date.now();
	const companyId = await getActiveCompanyId();
	console.log(`[PERF] getActiveCompanyId: ${Date.now() - t1}ms`);

	if (!companyId) {
		const companies = await getUserCompanies();
		return <CompanyGate context="communications" hasCompanies={(companies ?? []).length > 0} />;
	}

	const t2 = Date.now();
	const supabase = await createClient();
	console.log(`[PERF] createClient: ${Date.now() - t2}ms`);

	if (!supabase) {
		return <CompanyGate context="communications" hasCompanies={true} />;
	}

	const t3 = Date.now();
	const { data: communications = [] } = await supabase
		.from("communications")
		.select(
			`
        id,
        type,
        direction,
        status,
        priority,
        subject,
        body,
        created_at,
        read_at,
        from_address,
        to_address,
        customer_id,
        phone_number_id,
        call_duration,
        customer:customers(id, first_name, last_name),
        telnyx_call_control_id,
        telnyx_call_session_id,
        call_recording_url,
        provider_metadata
      `
		)
		.eq("company_id", companyId)
		.is("deleted_at", null)
		.order("created_at", { ascending: false })
		.limit(COMMUNICATION_LIMIT);
	console.log(`[PERF] communications query: ${Date.now() - t3}ms`);

	const t4 = Date.now();
	const { data: phoneNumbers = [] } = await supabase
		.from("phone_numbers")
		.select("id, phone_number, formatted_number, status")
		.eq("company_id", companyId)
		.is("deleted_at", null)
		.order("created_at", { ascending: false});
	console.log(`[PERF] phoneNumbers query: ${Date.now() - t4}ms`);

	const t5 = Date.now();
	const normalizedCommunications: CommunicationRecord[] = (communications as CommunicationQueryResult[]).map(
		(communication) => {
			const customer = Array.isArray(communication.customer)
				? (communication.customer[0] ?? null)
				: (communication.customer ?? null);

			return {
				...communication,
				customer,
			};
		}
	);

	const companyPhones: CompanyPhone[] = (phoneNumbers || [])
		.map((phone) => phone as PhoneNumberRow)
		.map((phone) => ({
			id: phone.id,
			number: phone.phone_number,
			label: phone.formatted_number || phone.phone_number,
			status: phone.status ?? "unknown",
		}));
	console.log(`[PERF] data transformation: ${Date.now() - t5}ms`);
	console.log(`[PERF] TOTAL CommunicationData: ${Date.now() - t1}ms`);

	return (
		<CommunicationPageClient
			communications={normalizedCommunications}
			companyId={companyId}
			companyPhones={companyPhones}
		/>
	);
}
