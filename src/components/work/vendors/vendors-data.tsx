import { notFound } from "next/navigation";
import { type Vendor, VendorTable } from "@/components/inventory/vendor-table";
import { WorkDataView } from "@/components/work/work-data-view";
import { getActiveCompanyId } from "@/lib/auth/company-context";
import { createClient } from "@/lib/supabase/server";

export async function VendorsData() {
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

  const { data: vendorsRaw, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("company_id", activeCompanyId)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch vendors: ${error.message}`);
  }

  // biome-ignore lint/suspicious/noExplicitAny: Supabase query result type
  const vendors: Vendor[] = (vendorsRaw || []).map((vendor: any) => ({
    id: vendor.id,
    name: vendor.name,
    display_name: vendor.display_name,
    vendor_number: vendor.vendor_number,
    email: vendor.email,
    phone: vendor.phone,
    category: vendor.category,
    status: vendor.status,
    created_at: vendor.created_at,
  }));

  return (
    <WorkDataView
      kanban={
        <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          Vendor pipeline view coming soon. Switch back to table mode to manage
          vendors.
        </div>
      }
      section="vendors"
      table={
        <VendorTable basePath="/dashboard/work/vendors" vendors={vendors} />
      }
    />
  );
}
