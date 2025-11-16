/**
 * Vercel Workflow Route - Placeholder
 *
 * This route is required by the workflow package but currently unused.
 * The workflow feature is disabled in next.config.ts for performance reasons.
 */

import { NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json({
		workflows: [],
		message: "Workflow feature is currently disabled",
	});
}
