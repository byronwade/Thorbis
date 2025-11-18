import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			className={cn(
				"border-input bg-card selection:bg-primary selection:text-primary-foreground file:text-foreground placeholder:text-muted-foreground h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-2",
				"aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-2",
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
