import { NextResponse } from "next/server";
import { getCompanyWeather } from "@/actions/weather";

// Cache weather data for 10 minutes, allow stale for 5 more minutes while revalidating
const CACHE_CONTROL = "public, max-age=600, stale-while-revalidate=300";

export async function GET() {
	const result = await getCompanyWeather();

	if (result.success) {
		return NextResponse.json(result.data, {
			headers: {
				"Cache-Control": CACHE_CONTROL,
			},
		});
	}

	return NextResponse.json(
		{ error: result.error ?? "Unable to fetch weather" },
		{ status: 400 },
	);
}
