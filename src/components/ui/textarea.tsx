import type * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			className={cn(
				"bg-muted/90 text-foreground placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-md px-3 py-2 text-base transition-smooth outline-none md:text-sm shadow-xs dark:bg-muted/80",
				"focus-visible:bg-muted focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:shadow-sm",
				"aria-invalid:bg-destructive/10 aria-invalid:ring-destructive/50 aria-invalid:ring-2",
				"disabled:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60",
				className,
			)}
			data-slot="textarea"
			{...props}
		/>
	);
}

export { Textarea };
