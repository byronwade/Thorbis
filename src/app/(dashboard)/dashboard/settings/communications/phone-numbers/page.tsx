/**
 * Phone Numbers Management Page
 *
 * Comprehensive phone number management:
 * - List all company phone numbers
 * - Search and purchase new numbers
 * - Port existing numbers (8-step wizard)
 * - Configure routing and features
 * - View usage metrics and costs
 */

import { Suspense } from "react";
import { AppToolbar } from "@/components/layout/app-toolbar";
import {
  type PhoneNumberRecord,
  PhoneNumbersList,
} from "@/components/telnyx/phone-numbers-list";
import { PhoneNumbersToolbar } from "@/components/telnyx/phone-numbers-toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { requireActiveCompany } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Phone Numbers | Communications Settings",
  description:
    "Manage your company phone numbers, purchase new numbers, and port existing ones",
};

export default async function PhoneNumbersPage() {
  const companyId = await requireActiveCompany();
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data: phoneNumbersRaw = [] } = await supabase
    .from("phone_numbers")
    .select(
      `
        id,
        phone_number,
        formatted_number,
        area_code,
        number_type,
        status,
        features,
        incoming_calls_count,
        outgoing_calls_count,
        sms_sent_count,
        sms_received_count,
        monthly_cost,
        voicemail_enabled,
        created_at,
        metadata,
        porting_request_id
      `
    )
    .eq("company_id", companyId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const phoneNumbers = (phoneNumbersRaw ?? []).map(mapPhoneNumberRow);

  return (
    <div className="flex h-full flex-col">
      {/* Page Header */}
      <AppToolbar config={{ show: true, title: "Phone Numbers" }} />

      {/* Secondary Toolbar with Actions */}
      <Suspense fallback={<Skeleton className="h-16 w-full" />}>
        <PhoneNumbersToolbar companyId={companyId} />
      </Suspense>

      {/* Phone Numbers List */}
      <div className="flex-1 overflow-auto">
        <Suspense fallback={<PhoneNumbersListSkeleton />}>
          <PhoneNumbersList numbers={phoneNumbers} />
        </Suspense>
      </div>
    </div>
  );
}

function PhoneNumbersListSkeleton() {
  return (
    <div className="space-y-4 p-6">
      {[...Array(5)].map((_, i) => (
        <Skeleton className="h-20 w-full" key={i} />
      ))}
    </div>
  );
}

function mapPhoneNumberRow(row: any): PhoneNumberRecord {
  return {
    id: row.id,
    phoneNumber: row.phone_number,
    formattedNumber:
      row.formatted_number || formatDisplayPhoneNumber(row.phone_number ?? ""),
    areaCode: row.area_code,
    numberType: row.number_type,
    status: row.status,
    features: Array.isArray(row.features) ? row.features : [],
    incomingCallsCount: row.incoming_calls_count ?? 0,
    outgoingCallsCount: row.outgoing_calls_count ?? 0,
    smsSentCount: row.sms_sent_count ?? 0,
    smsReceivedCount: row.sms_received_count ?? 0,
    monthlyCost: row.monthly_cost,
    routingRule: row.metadata?.routing_rule ?? null,
    voicemailEnabled: row.voicemail_enabled,
    createdAt: row.created_at,
    portingStatus: row.metadata?.porting_status ?? null,
    portingEta: row.metadata?.porting_eta ?? null,
    metadata: row.metadata ?? null,
  };
}

function formatDisplayPhoneNumber(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phoneNumber || "Unknown";
}
