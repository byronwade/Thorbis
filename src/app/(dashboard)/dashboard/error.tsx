"use client";

import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

/**
 * Dashboard Error Boundary
 *
 * Catches and handles errors in the dashboard section
 * Follows Next.js 16 error boundary pattern
 */
export default function DashboardError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log error to error reporting service
		// TODO: Integrate with error monitoring (e.g., Sentry)
		if (error.digest) {
			// Error digest is available in production
			// Can be used for error tracking
		}
	}, [error]);

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<div className="flex items-center gap-2">
						<AlertCircle className="h-5 w-5 text-destructive" />
						<CardTitle>Something went wrong</CardTitle>
					</div>
					<CardDescription>
						An error occurred while loading this page
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{process.env.NODE_ENV === "development" && (
						<div className="rounded-lg bg-muted p-4">
							<p className="font-mono text-muted-foreground text-sm">
								{error.message}
							</p>
						</div>
					)}
					<div className="flex gap-2">
						<Button className="flex-1" onClick={reset} variant="default">
							Try again
						</Button>
						<Button
							className="flex-1"
							onClick={() => (window.location.href = "/dashboard")}
							variant="outline"
						>
							Go to Dashboard
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
