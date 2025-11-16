"use client";

/**
 * Smart Notes Component
 *
 * AI-powered notes with auto-save and quick snippets
 */

import { Clock, Save, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const QUICK_SNIPPETS = [
	"Customer called about...",
	"Scheduled appointment for...",
	"Issue resolved by...",
	"Follow-up required:",
	"Customer satisfied with service",
	"Additional work needed:",
];

export function SmartNotes() {
	const [notes, setNotes] = useState("");
	const [lastSaved, setLastSaved] = useState<Date | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	// Auto-save every 5 seconds
	useEffect(() => {
		if (!notes) {
			return;
		}

		const timer = setTimeout(() => {
			saveNotes();
		}, 5000);

		return () => clearTimeout(timer);
	}, [notes, saveNotes]);

	const saveNotes = async () => {
		setIsSaving(true);
		// Simulate save
		await new Promise((resolve) => setTimeout(resolve, 500));
		setLastSaved(new Date());
		setIsSaving(false);
	};

	const insertSnippet = (snippet: string) => {
		const newNotes = notes ? `${notes}\n${snippet}` : snippet;
		setNotes(newNotes);
	};

	return (
		<div className="flex h-full flex-col bg-background">
			{/* Header */}
			<div className="flex items-center justify-between border-border border-b px-4 py-2">
				<div className="flex items-center gap-2">
					<h3 className="font-semibold text-sm">Call Notes</h3>
					{isSaving ? (
						<Badge className="gap-1 text-xs" variant="outline">
							<Clock className="h-3 w-3 animate-spin" />
							Saving...
						</Badge>
					) : lastSaved ? (
						<span className="text-muted-foreground text-xs">
							Saved {lastSaved.toLocaleTimeString()}
						</span>
					) : null}
				</div>
				<Button
					disabled={isSaving}
					onClick={saveNotes}
					size="sm"
					variant="ghost"
				>
					<Save className="h-3 w-3" />
				</Button>
			</div>

			{/* Quick Snippets */}
			<div className="border-border border-b bg-muted/50 p-2">
				<div className="mb-1 flex items-center gap-1">
					<Sparkles className="h-3 w-3 text-muted-foreground" />
					<span className="text-muted-foreground text-xs">Quick Snippets</span>
				</div>
				<div className="flex flex-wrap gap-1">
					{QUICK_SNIPPETS.map((snippet, idx) => (
						<Button
							className="h-6 text-xs"
							key={idx}
							onClick={() => insertSnippet(snippet)}
							size="sm"
							variant="outline"
						>
							{snippet}
						</Button>
					))}
				</div>
			</div>

			{/* Notes Textarea */}
			<div className="flex-1 p-2">
				<Textarea
					className="h-full min-h-0 resize-none border-none bg-transparent focus-visible:ring-0"
					onChange={(e) => setNotes(e.target.value)}
					placeholder="Take notes during the call..."
					value={notes}
				/>
			</div>
		</div>
	);
}
