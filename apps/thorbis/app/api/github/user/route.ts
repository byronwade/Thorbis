import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.accessToken) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		const response = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
				Accept: "application/vnd.github.v3+json",
			},
		});

		if (!response.ok) {
			throw new Error(`GitHub API error: ${response.statusText}`);
		}

		const userData = await response.json();
		return NextResponse.json(userData);
	} catch (error) {
		console.error("GitHub user fetch error:", error);
		return NextResponse.json({ error: "Failed to fetch GitHub user" }, { status: 500 });
	}
}
