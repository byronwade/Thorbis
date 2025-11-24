import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PricingBadgeProps {
	variant?: "default" | "compact" | "detailed";
	className?: string;
}

/**
 * Reusable pricing badge for consistent messaging across marketing pages.
 * Centralizes the $200/mo pricing copy for easy updates.
 */
export function PricingBadge({
	variant = "default",
	className,
}: PricingBadgeProps) {
	if (variant === "compact") {
		return (
			<Badge
				variant="outline"
				className={cn(
					"border-primary/30 bg-primary/5 text-primary",
					className
				)}
			>
				$200/mo • Unlimited users
			</Badge>
		);
	}

	if (variant === "detailed") {
		return (
			<Badge
				variant="outline"
				className={cn(
					"border-primary/30 bg-primary/5 px-4 py-1.5 text-primary",
					className
				)}
			>
				$200/mo base • Pay-as-you-go • Unlimited users • No contracts
			</Badge>
		);
	}

	return (
		<Badge
			variant="outline"
			className={cn(
				"border-primary/30 bg-primary/5 text-primary",
				className
			)}
		>
			$200/mo base • Unlimited users • No contracts
		</Badge>
	);
}
