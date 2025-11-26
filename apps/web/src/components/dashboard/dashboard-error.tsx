"use client";

/**
 * Dashboard Error Component
 *
 * Shared error boundary component for dashboard pages
 * Provides consistent error handling UI across the app
 */

import { AlertCircle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type DashboardErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export function DashboardError({ error, reset }: DashboardErrorProps) {
	useEffect(() => {
		// Log error to monitoring service (e.g., Sentry)
		console.error("Dashboard error:", error);
	}, [error]);

	return (
		<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<div className="flex items-center gap-2">
						<AlertCircle className="text-destructive h-5 w-5" />
						<CardTitle>Something went wrong</CardTitle>
					</div>
					<CardDescription>
						An error occurred while loading this page. You can try refreshing or
						return to the dashboard.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{error.digest && (
						<div className="bg-muted rounded-lg p-3">
							<p className="text-muted-foreground text-xs">
								<span className="font-medium">Error ID:</span> {error.digest}
							</p>
						</div>
					)}

					{process.env.NODE_ENV === "development" && (
						<details className="bg-muted rounded-lg p-3">
							<summary className="cursor-pointer text-sm font-medium">
								Error Details (Development Only)
							</summary>
							<p className="text-muted-foreground mt-2 font-mono text-xs break-all">
								{error.message}
							</p>
						</details>
					)}

					<div className="flex gap-2">
						<Button onClick={reset} variant="default" className="flex-1">
							<RefreshCcw className="mr-2 h-4 w-4" />
							Try Again
						</Button>
						<Button asChild variant="outline" className="flex-1">
							<Link href="/dashboard">
								<Home className="mr-2 h-4 w-4" />
								Dashboard
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
