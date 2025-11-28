import { createClient } from "@stratos/auth/server";
import { NextResponse } from "next/server";

/**
 * Get user preferences including timezone
 * GET /api/user/preferences
 */
export async function GET() {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { data, error } = await supabase
			.from("user_preferences")
			.select("timezone, theme, language, date_format, time_format")
			.eq("user_id", user.id)
			.maybeSingle();

		if (error) {
			console.error("Error fetching user preferences:", error);
			return NextResponse.json(
				{ error: "Failed to fetch preferences" },
				{ status: 500 },
			);
		}

		// Return preferences or defaults
		return NextResponse.json({
			timezone: data?.timezone || "America/New_York",
			theme: data?.theme || "system",
			language: data?.language || "en",
			date_format: data?.date_format || "MM/DD/YYYY",
			time_format: data?.time_format || "12h",
		});
	} catch (error) {
		console.error("User preferences API error:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

