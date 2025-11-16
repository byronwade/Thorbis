import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			className={cn(
				"h-9 w-full min-w-0 rounded-md border border-input bg-card px-3 py-1 text-base outline-none transition-colors selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20",
				"aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
				className
			)}
			data-slot="input"
			suppressHydrationWarning
			type={type}
			{...props}
		/>
	);
}

export { Input };
