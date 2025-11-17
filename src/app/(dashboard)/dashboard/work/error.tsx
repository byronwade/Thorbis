"use client";

/**
 * Error boundary for Work page
 * Displays a centered, non-scrollable error state with helpful information
 * Mobile-friendly design
 */

import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {}, []);

	return (
		<div className="flex h-full min-h-[60vh] items-center justify-center px-4 py-12">
			<Card className="w-full max-w-md">
				<CardHeader>
					<div className="flex items-center gap-2">
						<AlertCircle className="text-destructive h-5 w-5" />
						<CardTitle>Something went wrong</CardTitle>
					</div>
					<CardDescription>
						An error occurred while loading this page. This has been logged and we'll look into it.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Error Details (development only) */}
					{process.env.NODE_ENV === "development" && (
						<div className="bg-muted rounded-lg p-4">
							<p className="text-muted-foreground font-mono text-sm">{error.message}</p>
							{error.stack && (
								<details className="mt-2">
									<summary className="text-muted-foreground cursor-pointer text-xs">
										Stack trace
									</summary>
									<pre className="mt-2 overflow-auto text-xs">{error.stack}</pre>
								</details>
							)}
						</div>
					)}
					<div className="flex flex-col gap-2 sm:flex-row">
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
