"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Props = {
	enabled: boolean;
	onToggle: (value: boolean) => void;
};

export function PerformanceModeToggle({ enabled, onToggle }: Props) {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	if (!mounted) {
		return (
			<div className="flex items-center gap-2 text-xs text-muted-foreground">
				<span className="inline-block h-4 w-16 rounded bg-muted" />
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<Switch checked={enabled} onCheckedChange={onToggle} id="perf-mode" />
			<Label htmlFor="perf-mode" className="text-xs font-medium">
				Performance Mode
			</Label>
		</div>
	);
}
