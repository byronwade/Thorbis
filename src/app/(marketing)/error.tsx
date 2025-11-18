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
 * Marketing Pages Error Boundary - Client Component
 */
export default function MarketingError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {}, []);

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<div className="flex items-center gap-2">
						<AlertCircle className="text-destructive h-5 w-5" />
						<CardTitle>Something went wrong</CardTitle>
					</div>
					<CardDescription>
						An error occurred while loading this page
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{process.env.NODE_ENV === "development" && (
						<div className="bg-muted rounded-lg p-4">
							<p className="text-muted-foreground font-mono text-sm">
								{error.message}
							</p>
						</div>
					)}
					<div className="flex gap-2">
						<Button className="flex-1" onClick={reset}>
							Try again
						</Button>
						<Button
							className="flex-1"
							onClick={() => (window.location.href = "/")}
							variant="outline"
						>
							Go Home
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
