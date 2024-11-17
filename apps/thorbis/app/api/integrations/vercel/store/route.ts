import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.email) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { token } = await req.json();
		if (!token) {
			return new NextResponse("Token is required", { status: 400 });
		}

		// First, ensure the user exists
		const user = await prisma.user.upsert({
			where: { email: session.user.email },
			create: {
				email: session.user.email,
				name: session.user.name || "",
				image: session.user.image || "",
			},
			update: {},
		});

		// Then create/update the integration
		await prisma.integration.upsert({
			where: {
				userId_platform: {
					userId: user.id,
					platform: "vercel",
				},
			},
			create: {
				userId: user.id,
				platform: "vercel",
				accessToken: token,
			},
			update: {
				accessToken: token,
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error storing Vercel token:", error);
		return new NextResponse(JSON.stringify({ error: "Failed to store token" }), { status: 500 });
	}
}
