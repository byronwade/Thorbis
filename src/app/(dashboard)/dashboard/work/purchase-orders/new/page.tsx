/**
 * New Purchase Order Page
 *
 * Create a new purchase order
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function NewPurchaseOrderPage() {
  const supabase = await createClient();

  if (!supabase) {
    return redirect("/dashboard/work/purchase-orders");
  }

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Get active company
  const { getActiveCompanyId } = await import("@/lib/auth/company-context");
  const activeCompanyId = await getActiveCompanyId();

  if (!activeCompanyId) {
    return redirect("/dashboard/welcome");
  }

  // Verify user access
  const { data: teamMember } = await supabase
    .from("team_members")
    .select("company_id")
    .eq("user_id", user.id)
    .eq("company_id", activeCompanyId)
    .eq("status", "active")
    .maybeSingle();

  if (!teamMember) {
    return redirect("/dashboard/work/purchase-orders");
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">New Purchase Order</h1>
      </div>

      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Purchase order creation form will be implemented here.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          This page needs the vendors table relationship configured in Supabase.
        </p>
      </div>
    </div>
  );
}
