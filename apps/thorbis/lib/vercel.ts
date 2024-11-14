import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getVercelHeaders(token: string) {
	if (!token) {
		throw new Error("No Vercel access token provided");
	}

	return {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	} as HeadersInit;
}

export async function fetchVercelAPI(token: string, endpoint: string, options: RequestInit = {}) {
	const headers = await getVercelHeaders(token);
	const response = await fetch(`https://api.vercel.com${endpoint}`, {
		...options,
		headers: {
			...headers,
			...(options.headers || {}),
		},
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(`Vercel API error: ${error.message || response.statusText}`);
	}

	return response.json();
}

export async function testVercelConnection(token: string) {
	try {
		const [user, teams, projects] = await Promise.all([fetchVercelAPI(token, "/v2/user"), fetchVercelAPI(token, "/v2/teams"), fetchVercelAPI(token, "/v2/projects")]);

		return {
			user,
			teams,
			projects,
			timestamp: new Date().toISOString(),
			status: "success",
		};
	} catch (error) {
		console.error("Vercel API test failed:", error);
		return {
			error: error instanceof Error ? error.message : "Unknown error",
			timestamp: new Date().toISOString(),
			status: "error",
		};
	}
}
