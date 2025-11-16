import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

/**
 * Get current user info for onboarding
 * Returns user's name, email, and other relevant info
 */
export async function GET() {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		const supabase = await createClient();
		if (!supabase) {
			return NextResponse.json(
				{ error: "Database not configured" },
				{ status: 500 },
			);
		}

		// Get user profile from database
		const { data: profile } = await supabase
			.from("users")
			.select("name, email, phone")
			.eq("id", user.id)
			.single();

		// Extract name parts from full name or email
		const fullName =
			profile?.name ||
			user.user_metadata?.name ||
			user.email?.split("@")[0] ||
			"";
		const nameParts = fullName.split(" ");
		const firstName = nameParts[0] || "";
		const lastName = nameParts.slice(1).join(" ") || "";

		return NextResponse.json({
			email: user.email || profile?.email || "",
			firstName,
			lastName,
			phone: profile?.phone || user.user_metadata?.phone || "",
		});
	} catch (_error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
