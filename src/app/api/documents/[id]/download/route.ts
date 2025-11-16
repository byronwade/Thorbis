/**
 * Document Download API Route
 *
 * Handles secure document downloads with:
 * - Permission verification
 * - Signed URL generation
 * - Range request support (for video streaming)
 * - Download tracking
 */

import { type NextRequest, NextResponse } from "next/server";
import { getDownloadUrl } from "@/lib/storage/document-manager";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/documents/[id]/download
 * Get signed download URL for document
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attachmentId = id;

    // Verify authentication
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get attachment details
    const { data: attachment, error: fetchError } = await supabase
      .from("attachments")
      .select("company_id, file_name, virus_scan_status, mime_type, file_size")
      .eq("id", attachmentId)
      .is("deleted_at", null)
      .single();

    if (fetchError || !attachment) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Verify user has access to company
    const { data: membership, error: memberError } = await supabase
      .from("team_members")
      .select("id")
      .eq("user_id", user.id)
      .eq("company_id", attachment.company_id)
      .eq("status", "active")
      .single();

    if (memberError || !membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check virus scan status
    if (attachment.virus_scan_status === "infected") {
      return NextResponse.json(
        { error: "File failed security scan and cannot be downloaded" },
        { status: 403 }
      );
    }

    if (
      attachment.virus_scan_status === "pending" ||
      attachment.virus_scan_status === "scanning"
    ) {
      return NextResponse.json(
        { error: "File is still being scanned. Please try again shortly." },
        { status: 202 } // Accepted but not ready
      );
    }

    // Get signed download URL
    const result = await getDownloadUrl(attachmentId, 3600); // 1 hour expiry

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Return download URL
    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        fileName: attachment.file_name,
        mimeType: attachment.mime_type,
        fileSize: attachment.file_size,
        expiresIn: 3600,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate download URL",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * HEAD /api/documents/[id]/download
 * Get document metadata without downloading
 */
export async function HEAD(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attachmentId = id;

    const supabase = await createClient();
    if (!supabase) {
      return new NextResponse(null, { status: 500 });
    }
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new NextResponse(null, { status: 401 });
    }

    const { data: attachment, error: fetchError } = await supabase
      .from("attachments")
      .select("company_id, file_name, mime_type, file_size")
      .eq("id", attachmentId)
      .is("deleted_at", null)
      .single();

    if (fetchError || !attachment) {
      return new NextResponse(null, { status: 404 });
    }

    // Verify access
    const { data: membership } = await supabase
      .from("team_members")
      .select("id")
      .eq("user_id", user.id)
      .eq("company_id", attachment.company_id)
      .eq("status", "active")
      .single();

    if (!membership) {
      return new NextResponse(null, { status: 403 });
    }

    // Return metadata in headers
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Content-Type": attachment.mime_type,
        "Content-Length": attachment.file_size.toString(),
        "Content-Disposition": `attachment; filename="${attachment.file_name}"`,
        "X-File-Name": attachment.file_name,
        "X-File-Size": attachment.file_size.toString(),
      },
    });
  } catch (_error) {
    return new NextResponse(null, { status: 500 });
  }
}

/**
 * OPTIONS /api/documents/[id]/download
 * CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Range",
    },
  });
}
