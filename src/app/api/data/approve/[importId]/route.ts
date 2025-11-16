/**
 * Approve Import API Route
 *
 * Admin endpoint to approve large imports
 */

import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: {
    importId: string;
  };
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const { importId } = context.params;
    const body = await request.json();
    const { approved, reason } = body;

    // Get active company ID
    const { getActiveCompanyId } = await import("@/lib/auth/company-context");
    const companyId = await getActiveCompanyId();

    if (!companyId) {
      return NextResponse.json(
        { error: "No active company found" },
        { status: 400 }
      );
    }

    // Check if user is admin (TODO: Implement proper role check)
    // For now, just check if user exists

    // Get import record
    const { data: importRecord, error: fetchError } = await supabase
      .from("data_imports")
      .select("*")
      .eq("id", importId)
      .eq("company_id", companyId)
      .single();

    if (fetchError || !importRecord) {
      return NextResponse.json({ error: "Import not found" }, { status: 404 });
    }

    if (!importRecord.requires_approval) {
      return NextResponse.json(
        { error: "This import does not require approval" },
        { status: 400 }
      );
    }

    if (importRecord.status !== "pending") {
      return NextResponse.json(
        { error: "Import is not pending approval" },
        { status: 400 }
      );
    }

    // Update import record
    const newStatus = approved ? "processing" : "rejected";
    const { error: updateError } = await supabase
      .from("data_imports")
      .update({
        status: newStatus,
        approved_by: user.id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", importId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update import" },
        { status: 500 }
      );
    }

    // TODO: If approved, trigger actual import processing

    return NextResponse.json({
      success: true,
      message: approved ? "Import approved and processing" : "Import rejected",
      importId,
      status: newStatus,
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
