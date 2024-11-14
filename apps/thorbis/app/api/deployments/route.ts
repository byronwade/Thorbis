import { NextResponse } from "next/server";
import { getFeatureFlag } from "@/lib/edge-config";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const isEnabled = await getFeatureFlag("deployments");

		if (!isEnabled) {
			return NextResponse.json({ error: "Feature not available" }, { status: 404 });
		}

		return NextResponse.json({ deployments: [] });
	} catch {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
