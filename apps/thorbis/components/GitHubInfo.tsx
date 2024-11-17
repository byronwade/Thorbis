"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface GitHubData {
	login: string;
	name: string;
	avatar_url: string;
	html_url: string;
	public_repos: number;
	followers: number;
	following: number;
}

export function GitHubInfo() {
	const [githubData, setGithubData] = useState<GitHubData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchGitHubData = async () => {
			try {
				const response = await fetch("/api/github/user");
				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(errorText || response.statusText);
				}
				const data = await response.json();
				console.log("GitHub Data:", data);
				setGithubData(data);
			} catch (err) {
				console.error("Error:", err);
				setError(err instanceof Error ? err.message : "Failed to fetch GitHub data");
			} finally {
				setLoading(false);
			}
		};

		fetchGitHubData();
	}, []);

	if (loading) {
		return (
			<Card>
				<CardContent className="p-4">
					<div className="animate-pulse space-y-2">
						<div className="h-4 bg-gray-200 rounded w-1/4"></div>
						<div className="h-4 bg-gray-200 rounded w-1/2"></div>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<CardContent className="p-4 text-red-500">{error}</CardContent>
			</Card>
		);
	}

	if (!githubData) {
		return (
			<Card>
				<CardContent className="p-4">No GitHub data available. Please connect your GitHub account.</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex items-center space-x-4">
					<img src={githubData.avatar_url} alt={githubData.login} className="w-16 h-16 rounded-full" />
					<div>
						<h3 className="text-lg font-semibold">{githubData.name}</h3>
						<p className="text-sm text-gray-500">@{githubData.login}</p>
					</div>
				</div>
				<div className="grid grid-cols-3 gap-4 mt-4">
					<div>
						<p className="text-sm text-gray-500">Repositories</p>
						<p className="font-semibold">{githubData.public_repos}</p>
					</div>
					<div>
						<p className="text-sm text-gray-500">Followers</p>
						<p className="font-semibold">{githubData.followers}</p>
					</div>
					<div>
						<p className="text-sm text-gray-500">Following</p>
						<p className="font-semibold">{githubData.following}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
