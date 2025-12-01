import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type * as React from "react";

import { cn } from "./utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
				destructive:
					"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
				outline:
					"bg-muted/90 text-foreground shadow-xs hover:bg-muted hover:text-foreground dark:bg-muted/80 dark:hover:bg-muted",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
				ghost:
					"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-11 px-4 py-2 has-[>svg]:px-3 md:h-9",
				sm: "h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 md:h-8",
				lg: "h-12 rounded-md px-6 has-[>svg]:px-4 md:h-10",
				icon: "size-11 md:size-9",
				"icon-sm": "size-9 md:size-8",
				"icon-lg": "size-12 md:size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	loading?: boolean;
}

function Button({
	className,
	variant,
	size,
	asChild = false,
	loading = false,
	children,
	disabled,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			disabled={loading || disabled}
			{...props}
		>
			{loading && <Loader2 className="animate-spin" />}
			{children}
		</Comp>
	);
}

export { Button, buttonVariants };
