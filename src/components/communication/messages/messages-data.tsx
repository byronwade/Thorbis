import { notFound } from "next/navigation";
import type { CompanyPhone } from "@/components/communication/communication-page-client";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import {
	fetchSmsConversation,
	fetchSmsThreads,
} from "@/lib/communications/sms";
import { createClient } from "@/lib/supabase/server";
import {
	type DirectoryCustomer,
	type DirectoryJob,
	MessagesPageClient,
} from "./messages-page-client";

export async function MessagesData() {
	const supabase = await createClient();
	if (!supabase) {
		return notFound();
	}

	const companyId = await getActiveCompanyId();
	if (!companyId) {
		return notFound();
	}

	const [threads, companyPhonesResult, customersResult, jobsResult] =
		await Promise.all([
			fetchSmsThreads(supabase, companyId),
			supabase
				.from("phone_numbers")
				.select("id, phone_number, formatted_number, status")
				.eq("company_id", companyId)
				.is("deleted_at", null)
				.order("created_at", { ascending: false }),
			supabase
				.from("customers")
				.select("id, first_name, last_name, phone, email, company_name")
				.eq("company_id", companyId)
				.is("deleted_at", null)
				.order("updated_at", { ascending: false })
				.limit(200),
			supabase
				.from("jobs")
				.select("id, job_number, title, status")
				.eq("company_id", companyId)
				.is("deleted_at", null)
				.order("updated_at", { ascending: false })
				.limit(100),
		]);

	const companyPhones: CompanyPhone[] = (companyPhonesResult.data || []).map(
		(phone) => ({
			id: phone.id,
			number: phone.phone_number,
			label: phone.formatted_number || phone.phone_number,
			status: phone.status ?? "active",
		}),
	);

	const customers: DirectoryCustomer[] = (customersResult.data || []).map(
		(customer) => ({
			id: customer.id,
			name:
				`${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim() ||
				"Unknown",
			phone: customer.phone || "",
			email: customer.email || "",
			company: customer.company_name || "",
		}),
	);

	const jobs: DirectoryJob[] = (jobsResult.data || []).map((job) => ({
		id: job.id,
		jobNumber: job.job_number,
		title: job.title,
		status: job.status,
	}));

	const initialThreadId = threads[0]?.id ?? null;
	const initialConversation = initialThreadId
		? await fetchSmsConversation(supabase, companyId, initialThreadId)
		: [];

	return (
		<MessagesPageClient
			companyId={companyId}
			companyPhones={companyPhones}
			customers={customers}
			initialConversation={initialConversation}
			initialThreadId={initialThreadId}
			jobs={jobs}
			threads={threads}
		/>
	);
}
