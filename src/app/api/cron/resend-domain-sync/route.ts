import { NextResponse } from "next/server";
import { getResendDomain } from "@/lib/email/resend-domains";
import { createServiceSupabaseClient } from "@/lib/supabase/service-client";

export async function GET() {
	const supabase = await createServiceSupabaseClient();
	const { data: domains } = await supabase
		.from("communication_email_domains")
		.select("*")
		.in("status", ["pending", "verifying"]);

	if (!domains || domains.length === 0) {
		return NextResponse.json({ updated: 0 });
	}

	let updated = 0;
	for (const domain of domains) {
		if (!domain.resend_domain_id) {
			continue;
		}
		const result = await getResendDomain(domain.resend_domain_id);
		if (!result.success) {
			continue;
		}

		await supabase
			.from("communication_email_domains")
			.update({
				status: result.data.status,
				dns_records: result.data.records || [],
				last_synced_at: new Date().toISOString(),
				last_verified_at:
					result.data.status === "verified"
						? new Date().toISOString()
						: domain.last_verified_at,
			})
			.eq("id", domain.id);
		updated += 1;
	}

	return NextResponse.json({ updated });
}
