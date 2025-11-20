import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			className={cn(
				"border-input bg-card selection:bg-primary selection:text-primary-foreground file:text-foreground placeholder:text-muted-foreground h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-smooth outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
				"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:shadow-overlay-xs",
				"aria-invalid:border-destructive aria-invalid:ring-destructive/50 aria-invalid:ring-2",
				"disabled:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:pointer-events-none",
				className,
			)}
			data-slot="input"
			suppressHydrationWarning
			type={type}
			{...props}
		/>
	);
}

export { Input };
