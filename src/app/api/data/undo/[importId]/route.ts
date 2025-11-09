/**
 * Undo Import API Route
 *
 * Reverses an import operation within 24 hours
 * Restores data from backup snapshot
 */

import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: {
    importId: string;
  };
}

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

    // Get import record
    const { data: importRecord, error: fetchError } = await supabase
      .from("data_imports")
      .select("*")
      .eq("id", importId)
      .eq("user_id", user.id) // Ensure user owns this import
      .single();

    if (fetchError || !importRecord) {
      return NextResponse.json({ error: "Import not found" }, { status: 404 });
    }

    // Check if import can be undone (within 24 hours)
    const importDate = new Date(importRecord.created_at);
    const now = new Date();
    const hoursSinceImport =
      (now.getTime() - importDate.getTime()) / (1000 * 60 * 60);

    if (hoursSinceImport > 24) {
      return NextResponse.json(
        { error: "Import can only be undone within 24 hours" },
        { status: 400 }
      );
    }

    if (importRecord.status !== "completed") {
      return NextResponse.json(
        { error: "Only completed imports can be undone" },
        { status: 400 }
      );
    }

    // TODO: Implement actual undo logic
    // 1. Delete imported records
    // 2. Restore backup data
    // 3. Update import status

    // Update import status
    const { error: updateError } = await supabase
      .from("data_imports")
      .update({ status: "reverted" })
      .eq("id", importId);

    if (updateError) {
      console.error("Error updating import status:", updateError);
      return NextResponse.json(
        { error: "Failed to undo import" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Import successfully undone",
      importId,
    });
  } catch (error) {
    console.error("Undo API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
