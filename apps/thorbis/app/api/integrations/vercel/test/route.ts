import { getServerSession } from "next-auth";
import { authOptions } from "@/thorbis/lib/auth";
import { prisma } from "@/thorbis/lib/prisma";
import { testVercelConnection } from "@/thorbis/lib/vercel";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.email) {
			console.log("Test endpoint - No session:", { session });
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// Get the user's Vercel integration
		const integration = await prisma.integration.findFirst({
			where: {
				user: {
					email: session.user.email,
				},
				platform: "vercel",
			},
		});

		console.log("Test endpoint - Integration found:", {
			found: !!integration,
			email: session.user.email,
			integrationId: integration?.id,
			platform: integration?.platform,
		});

		if (!integration) {
			return new NextResponse("Vercel integration not found", { status: 404 });
		}

		// Test the connection using stored token
		const testResults = await testVercelConnection(integration.accessToken);

		// Log the full API response
		console.log(
			"Vercel API Response:",
			JSON.stringify(
				{
					user: testResults.user,
					teamsCount: testResults.teams?.length || 0,
					projectsCount: testResults.projects?.length || 0,
					status: testResults.status,
					timestamp: testResults.timestamp,
				},
				null,
				2
			)
		);

		return NextResponse.json(testResults);
	} catch (error) {
		console.error("Error testing Vercel connection:", {
			error: error instanceof Error ? error.message : error,
			stack: error instanceof Error ? error.stack : undefined,
		});
		return new NextResponse(JSON.stringify({ error: "Failed to test Vercel connection" }), { status: 500 });
	}
}
