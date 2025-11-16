/**
 * Customer Enrichment API Route
 *
 * GET  /api/customers/[id]/enrich - Get cached enrichment data
 * POST /api/customers/[id]/enrich - Trigger new enrichment
 */

import { type NextRequest, NextResponse } from "next/server";
import {
  enrichCustomerData,
  getEnrichmentData,
} from "@/actions/customer-enrichment";
import { createClient } from "@/lib/supabase/server";

/**
 * GET - Retrieve cached enrichment data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await getEnrichmentData(id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Customer not found" ? 404 : 500 }
      );
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error("Error fetching enrichment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST - Trigger new enrichment
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body for options
    const body = await request.json().catch(() => ({}));
    const forceRefresh = body.forceRefresh;

    const result = await enrichCustomerData(id, forceRefresh);

    if (!result.success) {
      const statusCode =
        result.error === "Customer not found"
          ? 404
          : result.error?.includes("limit reached")
            ? 429
            : 500;

      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (error) {
    console.error("Error enriching customer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
