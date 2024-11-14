import { NextResponse } from "next/server";
import { fetchGitHubAPI } from "@/thorbis/lib/github";

export async function GET() {
	try {
		const repos = await fetchGitHubAPI("/user/repos");
		return NextResponse.json(repos);
	} catch (error) {
		console.error("GitHub repos fetch error:", error);
		return NextResponse.json({ error: "Failed to fetch GitHub repositories" }, { status: 500 });
	}
}
