import { getServerSession } from "next-auth";
import { authOptions } from "@/thorbis/lib/auth";
import { prisma } from "@/thorbis/lib/prisma";

export async function getGitHubHeaders() {
	const session = await getServerSession(authOptions);

	if (!session?.user?.id) {
		throw new Error("Not authenticated");
	}

	const integration = await prisma.integration.findUnique({
		where: {
			userId_platform: {
				userId: session.user.id,
				platform: "github",
			},
		},
	});

	if (!integration?.accessToken) {
		throw new Error("No GitHub integration found. Please connect your GitHub account.");
	}

	return {
		Authorization: `Bearer ${integration.accessToken}`,
		Accept: "application/vnd.github.v3+json",
	};
}

export async function fetchGitHubAPI(endpoint: string, options: RequestInit = {}) {
	const headers = await getGitHubHeaders();
	const response = await fetch(`https://api.github.com${endpoint}`, {
		...options,
		headers: {
			...headers,
			...options.headers,
		},
	});

	if (!response.ok) {
		throw new Error(`GitHub API error: ${response.statusText}`);
	}

	return response.json();
}

export async function getUserRepos() {
	return fetchGitHubAPI("/user/repos", {
		method: "GET",
		headers: {
			Accept: "application/vnd.github.v3+json",
		},
	});
}
