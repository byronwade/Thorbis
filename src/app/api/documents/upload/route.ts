/**
 * Document Upload API Route
 *
 * Handles chunked file uploads for large files
 * Supports resumable uploads with range requests
 */

import { type NextRequest, NextResponse } from "next/server";
import type { DocumentContext } from "@/lib/storage/document-manager";
import { uploadDocument } from "@/lib/storage/document-manager";
import { validateFile } from "@/lib/storage/file-validator";
import { createClient } from "@/lib/supabase/server";

// Maximum request size: 250MB
export const maxDuration = 300; // 5 minutes for large uploads

/**
 * POST /api/documents/upload
 * Upload a document
 */
export async function POST(request: NextRequest) {
  try {
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

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const companyId = formData.get("companyId") as string;
    const contextType = formData.get("contextType") as DocumentContext["type"];
    const contextId = formData.get("contextId") as string | undefined;
    const folder = formData.get("folder") as string | undefined;
    const description = formData.get("description") as string | undefined;
    const tagsStr = formData.get("tags") as string | undefined;

    // Validate required fields
    if (!(file && companyId && contextType)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify user has access to company
    const { data: membership, error: memberError } = await supabase
      .from("team_members")
      .select("id, role")
      .eq("user_id", user.id)
      .eq("company_id", companyId)
      .eq("status", "active")
      .single();

    if (memberError || !membership) {
      return NextResponse.json(
        { error: "Access denied - not a member of this company" },
        { status: 403 }
      );
    }

    // Validate file
    const validation = await validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: "File validation failed",
          details: validation.errors,
          warnings: validation.warnings,
        },
        { status: 400 }
      );
    }

    // Upload document
    const context: DocumentContext = {
      type: contextType,
      id: contextId,
      folder,
    };

    const tags = tagsStr ? JSON.parse(tagsStr) : undefined;

    const result = await uploadDocument(file, {
      companyId,
      context,
      description,
      tags,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, warnings: result.warnings },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        attachmentId: result.attachmentId,
        fileName: file.name,
        fileSize: file.size,
        storageUrl: result.storageUrl,
        storagePath: result.storagePath,
      },
      warnings: result.warnings,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/documents/upload
 * CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
