import type * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			className={cn(
				"border-input bg-card placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base transition-smooth outline-none md:text-sm",
				"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:shadow-overlay-xs",
				"aria-invalid:border-destructive aria-invalid:ring-destructive/50 aria-invalid:ring-2",
				"disabled:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60",
				className,
			)}
			data-slot="textarea"
			{...props}
		/>
	);
}

export { Textarea };
