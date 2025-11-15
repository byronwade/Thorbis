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
import { createClient } from "@/lib/supabase/server";

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
  fallback: string
): string {
  if (!value) {
    return fallback;
  }

  const formatted = formatDate(value, { preset: "short" });
  return formatted === "—" ? fallback : formatted;
}

function resolveCustomerName(
  customer: CustomerRecord | null,
  fallback: string
): string {
  if (!customer) {
    return fallback;
  }

  if (customer.display_name) {
    return customer.display_name;
  }

  const fullName = `${customer.first_name || ""} ${
    customer.last_name || ""
  }`.trim();

  if (fullName) {
    return fullName;
  }

  return fallback;
}

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params in Next.js 16+
  const { id } = await params;

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

  // Fetch contract with all related data
  const { data: contractRaw, error: contractError } = await supabase
    .from("contracts")
    .select(`
      *,
      estimate:estimates!estimate_id(
        id,
        estimate_number,
        title,
        customer_id,
        customer:customers!customer_id(*)
      ),
      invoice:invoices!invoice_id(
        id,
        invoice_number,
        title,
        customer_id,
        customer:customers!customer_id(*)
      ),
      job:jobs!job_id(
        id,
        job_number,
        title,
        customer_id,
        customer:customers!customer_id(*)
      )
    `)
    .eq("id", id)
    .eq("company_id", activeCompanyId)
    .is("deleted_at", null)
    .single();

  if (contractError || !contractRaw) {
    return notFound();
  }

  // Get customer from estimate, invoice, or job
  const estimate = Array.isArray(contractRaw.estimate)
    ? contractRaw.estimate[0]
    : contractRaw.estimate;
  const invoice = Array.isArray(contractRaw.invoice)
    ? contractRaw.invoice[0]
    : contractRaw.invoice;
  const job = Array.isArray(contractRaw.job)
    ? contractRaw.job[0]
    : contractRaw.job;

  const customer = estimate?.customer
    ? Array.isArray(estimate.customer)
      ? estimate.customer[0]
      : estimate.customer
    : invoice?.customer
      ? Array.isArray(invoice.customer)
        ? invoice.customer[0]
        : invoice.customer
      : job?.customer
        ? Array.isArray(job.customer)
          ? job.customer[0]
          : job.customer
        : null;

  const customerId =
    estimate?.customer_id || invoice?.customer_id || job?.customer_id;

  // NEW: Fetch property (via job) and appointments for contract context
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
          .from("schedules")
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
    `${normalizedCustomer?.first_name || ""} ${
      normalizedCustomer?.last_name || ""
    }`.trim() ||
    contractRaw.signer_email ||
    "Unknown Customer";

  const contract: ContractRecord = {
    id: contractRaw.id,
    contractNumber: contractRaw.contract_number,
    title: contractRaw.title,
    description: contractRaw.description,
    customerName: resolveCustomerName(normalizedCustomer, customerFallback),
    customerId: customerId || null,
    status: contractRaw.status,
    contractType: contractRaw.contract_type,
    signerName: contractRaw.signer_name,
    signerEmail: contractRaw.signer_email,
    signerTitle: contractRaw.signer_title,
    signerCompany: contractRaw.signer_company,
    signedAt: contractRaw.signed_at,
    sentAt: contractRaw.sent_at,
    viewedAt: contractRaw.viewed_at,
    createdAt: contractRaw.created_at,
    validFrom: contractRaw.valid_from,
    validUntil: contractRaw.expires_at || contractRaw.valid_until,
    ipAddress: contractRaw.signer_ip_address,
    content: contractRaw.content,
    terms: contractRaw.terms,
    notes: contractRaw.notes,
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
      <div className="flex h-full w-full flex-col overflow-auto">
        <div className="mx-auto w-full max-w-7xl">
          <ContractPageContent entityData={entityData} />
        </div>
      </div>
    </ToolbarStatsProvider>
  );
}
