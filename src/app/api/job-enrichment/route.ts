/**
 * Job Enrichment API Route
 *
 * Non-blocking enrichment endpoint for optimistic loading
 */

import { type NextRequest, NextResponse } from "next/server";
import { jobEnrichmentService } from "@/lib/services/job-enrichment";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get("jobId");
    const address = searchParams.get("address");
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const zipCode = searchParams.get("zipCode");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!(jobId && address && city && state)) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Authenticate user
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

    // Enrich job (with timeout protection)
    const enrichmentPromise = jobEnrichmentService.enrichJob({
      id: jobId,
      address,
      address2: undefined,
      city,
      state,
      zipCode: zipCode || "",
      lat: lat ? Number.parseFloat(lat) : undefined,
      lon: lon ? Number.parseFloat(lon) : undefined,
    });

    // Race with timeout (10 seconds max)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 10_000)
    );

    const enrichment = await Promise.race([
      enrichmentPromise,
      timeoutPromise,
    ]).catch(() => null);

    if (!enrichment) {
      return NextResponse.json(
        { error: "Enrichment timeout or failed" },
        { status: 504 }
      );
    }

    return NextResponse.json(enrichment, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
