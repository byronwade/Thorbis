/**
 * Work Page Loading State
 * Displays a centered, non-scrollable loading state
 * Mobile-friendly design
 */

import { Loader2 } from "lucide-react";

export default function WorkLoading() {
	return (
		<div className="flex h-full min-h-[60vh] items-center justify-center px-4 py-12">
			<div className="mx-auto w-full max-w-md space-y-6 text-center">
				{/* Loading Spinner */}
				<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
					<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>

				{/* Loading Message */}
				<div className="space-y-2">
					<h2 className="font-semibold text-xl">Loading jobs...</h2>
					<p className="text-muted-foreground text-sm">
						Please wait while we fetch your job data.
					</p>
				</div>
			</div>
		</div>
	);
}
