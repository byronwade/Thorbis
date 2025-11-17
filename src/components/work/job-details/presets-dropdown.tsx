"use client";

import { Blocks, ChevronRight, Grid3x3 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ALL_PRESETS } from "@/lib/presets/job-layout-presets";
import { useJobDetailsLayoutStore } from "@/lib/stores/job-details-layout-store";
import { cn } from "@/lib/utils";

export function PresetsDropdown() {
	const [open, setOpen] = useState(false);

	const industry = useJobDetailsLayoutStore((state) => state.industry);
	const loadPreset = useJobDetailsLayoutStore((state) => state.loadPreset);

	const handleLoadPreset = (presetId: string) => {
		const preset = ALL_PRESETS.find((p) => p.id === presetId);
		if (preset) {
			loadPreset(preset);
			setOpen(false);
		}
	};

	return (
		<DropdownMenu onOpenChange={setOpen} open={open}>
			<DropdownMenuTrigger asChild>
				<button
					className={cn(
						"flex w-full items-center justify-between gap-2 rounded-md px-2 py-2",
						"text-sm font-medium transition-colors",
						"hover:bg-accent hover:text-accent-foreground",
						"focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
					)}
					type="button"
				>
					<div className="flex items-center gap-2">
						<Grid3x3 className="h-4 w-4" />
						<span>Presets</span>
					</div>
					<ChevronRight className={cn("h-4 w-4 transition-transform", open && "rotate-90")} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-[320px]" side="right">
				{/* Header */}
				<div className="p-2">
					<div className="text-sm font-medium">Layout Presets</div>
					<div className="text-muted-foreground text-xs">
						Choose a pre-configured layout optimized for your industry
					</div>
				</div>
				<DropdownMenuSeparator />

				{/* Preset List */}
				<ScrollArea className="h-[400px]">
					<div className="flex flex-col gap-1 p-2">
						{ALL_PRESETS.map((preset) => (
							<button
								className={cn(
									"flex flex-col gap-1 rounded-md p-3 text-left outline-hidden transition-all",
									"hover:bg-accent hover:text-accent-foreground",
									"min-h-[44px] w-full border",
									industry === preset.industry
										? "border-primary bg-primary/5"
										: "border-transparent"
								)}
								key={preset.id}
								onClick={() => handleLoadPreset(preset.id)}
								type="button"
							>
								<div className="flex items-center justify-between gap-2">
									<span className="text-[0.8rem] font-medium">{preset.name}</span>
									{industry === preset.industry ? (
										<Badge className="h-5 px-1.5 text-[0.65rem]" variant="default">
											Current
										</Badge>
									) : null}
								</div>
								<span className="text-muted-foreground text-[0.7rem]">{preset.description}</span>
								<div className="flex items-center gap-1.5 text-[0.65rem]">
									<Blocks className="text-muted-foreground h-3 w-3" />
									<span className="text-muted-foreground">{preset.widgets.length} widgets</span>
								</div>
							</button>
						))}
					</div>
				</ScrollArea>

				{/* Footer */}
				<DropdownMenuSeparator />
				<div className="text-muted-foreground p-2 text-center text-xs">
					{ALL_PRESETS.length} preset{ALL_PRESETS.length !== 1 ? "s" : ""} available
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
