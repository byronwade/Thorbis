import { type NextRequest, NextResponse } from "next/server";
import { generateMockScheduleData } from "@/lib/mock-schedule-data";

/**
 * Mock Schedule API
 * GET /api/schedule - Get all schedule data
 */

let cachedData: ReturnType<typeof generateMockScheduleData> | null = null;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const forceRefresh = searchParams.get("refresh") === "true";

    // Use cached data unless forced refresh
    if (!cachedData || forceRefresh) {
      cachedData = generateMockScheduleData({
        technicianCount: 20,
        customerCount: 50,
        jobsPerTechnician: 5,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        includeRecurring: true,
        includeLongTerm: true,
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: cachedData,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (error) {
    // Log error to monitoring service in production
    // TODO: Integrate with error monitoring (e.g., Sentry)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch schedule data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
