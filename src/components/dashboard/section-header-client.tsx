"use client";

import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type SectionHeaderTooltipProps = {
	tooltip: string;
};

/**
 * Client-only tooltip wrapper for section headers
 */
export function SectionHeaderTooltip({ tooltip }: SectionHeaderTooltipProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<Info className="text-muted-foreground size-4" />
				</TooltipTrigger>
				<TooltipContent className="max-w-xs">
					<p>{tooltip}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
