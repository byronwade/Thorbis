import {
  CommunicationPageClient,
  type CommunicationRecord,
} from "@/components/communication/communication-page-client";
import { requireActiveCompany } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

type CommunicationQueryResult = Omit<CommunicationRecord, "customer"> & {
  customer: Array<NonNullable<CommunicationRecord["customer"]>> | null;
};

export default async function CommunicationPage() {
  const companyId = await requireActiveCompany();
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

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
        call_duration,
        customer:customers(id, first_name, last_name)
      `
    )
    .eq("company_id", companyId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(200);

  const normalizedCommunications: CommunicationRecord[] = (
    communications as CommunicationQueryResult[]
  ).map((communication) => {
    const customer = Array.isArray(communication.customer)
      ? communication.customer[0] ?? null
      : communication.customer ?? null;

    return {
      ...communication,
      customer,
    };
  });

  return (
    <CommunicationPageClient communications={normalizedCommunications} />
  );
}
