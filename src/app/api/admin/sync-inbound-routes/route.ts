import { NextResponse } from "next/server";
import { syncInboundRoutesToResendAction } from "@/actions/email-actions";

export async function POST() {
  try {
    const result = await syncInboundRoutesToResendAction();
    
    return NextResponse.json({
      success: result.success,
      synced: result.synced,
      errors: result.errors,
      message: result.success 
        ? `Successfully synced ${result.synced} routes to Resend`
        : `Synced ${result.synced} routes with ${result.errors.length} errors`,
    });
  } catch (error) {
    console.error("Error syncing inbound routes:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}




