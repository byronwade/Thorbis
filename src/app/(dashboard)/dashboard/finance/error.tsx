"use client";

/**
 * Finance Error Boundary
 *
 * Catches and displays errors in finance routes.
 */

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function FinanceError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Finance error:", error);
	}, [error]);

	return (
		<div className="flex min-h-[400px] flex-col items-center justify-center p-8">
			<div className="mx-auto max-w-md space-y-6 text-center">
				<div className="flex justify-center">
					<div className="rounded-full bg-destructive/10 p-6">
						<AlertTriangle className="size-12 text-destructive" />
					</div>
				</div>

				<div className="space-y-2">
					<h2 className="font-semibold text-2xl">Financial Error</h2>
					<p className="text-muted-foreground">
						{error.message || "An error occurred in the finance section."}
					</p>
					{error.digest && (
						<p className="font-mono text-muted-foreground text-xs">Error ID: {error.digest}</p>
					)}
				</div>

				<div className="flex justify-center gap-3">
					<Button onClick={() => reset()} variant="default">
						<RefreshCw className="mr-2 size-4" />
						Try Again
					</Button>
					<Button onClick={() => (window.location.href = "/dashboard")} variant="outline">
						<Home className="mr-2 size-4" />
						Dashboard
					</Button>
				</div>
			</div>
		</div>
	);
}
