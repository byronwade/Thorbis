"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AiToolbarActions() {
	return (
		<div className="flex items-center gap-2">
			<Button variant="ghost" size="sm" asChild>
				<Link href="/dashboard/settings/ai">
					<Settings className="size-4" />
					<span className="hidden md:inline-block">AI Settings</span>
				</Link>
			</Button>
		</div>
	);
}

