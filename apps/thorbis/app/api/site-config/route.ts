import { getServerSession } from "next-auth";
import { authOptions } from "@/thorbis/lib/auth";
import { prisma } from "@/thorbis/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.email) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const config = await req.json();

		// Get user
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
		});

		if (!user) {
			return new NextResponse("User not found", { status: 404 });
		}

		// Upsert site config
		const siteConfig = await prisma.siteConfig.upsert({
			where: { userId: user.id },
			create: {
				userId: user.id,
				siteName: config.siteName,
				siteDescription: config.siteDescription,
				adminEmail: config.adminEmail,
				timezone: config.timezone,
				databasePrefix: config.databasePrefix,
			},
			update: {
				siteName: config.siteName,
				siteDescription: config.siteDescription,
				adminEmail: config.adminEmail,
				timezone: config.timezone,
				databasePrefix: config.databasePrefix,
			},
		});

		return NextResponse.json(siteConfig);
	} catch (error) {
		console.error("Error saving site config:", error);
		return new NextResponse(JSON.stringify({ error: "Failed to save site configuration" }), { status: 500 });
	}
}
