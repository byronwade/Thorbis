"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GitHubRepo } from "@/types/github";

export function GitHubRepos() {
	const [repos, setRepos] = useState<GitHubRepo[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchRepos = async () => {
			try {
				const response = await fetch("/api/github/repos");
				if (!response.ok) {
					throw new Error((await response.text()) || response.statusText);
				}
				const data = await response.json();
				setRepos(data);
			} catch (err) {
				console.error("Error:", err);
				setError(err instanceof Error ? err.message : "Failed to fetch repositories");
			} finally {
				setLoading(false);
			}
		};

		fetchRepos();
	}, []);

	if (loading) {
		return (
			<Card>
				<CardContent className="p-4">
					<div className="animate-pulse space-y-4">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="space-y-2">
								<div className="h-4 bg-gray-200 rounded w-3/4"></div>
								<div className="h-4 bg-gray-200 rounded w-1/2"></div>
							</div>
						))}
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

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold">Your Repositories</h2>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{repos.map((repo) => (
					<Card key={repo.id}>
						<CardContent className="p-4">
							<h3 className="font-semibold text-lg">
								<a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
									{repo.name}
								</a>
							</h3>
							<p className="text-sm text-gray-500 mt-1">{repo.description || "No description"}</p>
							<div className="mt-2 text-sm">
								<span className={`inline-flex items-center px-2 py-1 rounded-full ${repo.private ? "bg-gray-100" : "bg-green-100"}`}>{repo.private ? "Private" : "Public"}</span>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
