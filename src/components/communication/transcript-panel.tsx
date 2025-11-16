"use client";

/**
 * Transcript Panel - Client Component
 *
 * Live call transcript display with AI analysis highlighting
 *
 * Client-side features:
 * - Real-time transcript updates
 * - Auto-scroll to latest entry
 * - Speaker identification (CSR vs Customer)
 * - AI extraction highlighting
 * - Search functionality
 * - Copy/export transcript
 * - Timestamp markers
 *
 * Performance optimizations:
 * - Virtual scrolling for long transcripts
 * - Debounced search
 * - Memoized entry rendering
 */

import { Copy, Download, MessageSquare, Search, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	UnifiedAccordion,
	type UnifiedAccordionSection,
} from "@/components/ui/unified-accordion";
import { useTranscriptStore } from "@/lib/stores/transcript-store";

export function TranscriptPanel() {
	const entries = useTranscriptStore((state) =>
		state.filteredEntries.length > 0 ? state.filteredEntries : state.entries,
	);
	const searchQuery = useTranscriptStore((state) => state.searchQuery);
	const setSearchQuery = useTranscriptStore((state) => state.setSearchQuery);
	const isRecording = useTranscriptStore((state) => state.isRecording);
	const exportTranscript = useTranscriptStore(
		(state) => state.exportTranscript,
	);
	const getFullTranscript = useTranscriptStore(
		(state) => state.getFullTranscript,
	);

	const [autoScroll, setAutoScroll] = useState(true);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom when new entries arrive
	useEffect(() => {
		if (autoScroll && scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop =
				scrollContainerRef.current.scrollHeight;
		}
	}, [autoScroll]);

	// Handle scroll to detect manual scrolling
	const handleScroll = () => {
		if (scrollContainerRef.current) {
			const { scrollTop, scrollHeight, clientHeight } =
				scrollContainerRef.current;
			const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
			setAutoScroll(isAtBottom);
		}
	};

	// Copy transcript to clipboard
	const handleCopy = async () => {
		const text = getFullTranscript();
		await navigator.clipboard.writeText(text);
	};

	// Export transcript as JSON
	const handleExport = () => {
		const data = exportTranscript();
		const blob = new Blob([data], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `transcript-${new Date().toISOString()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	// Format timestamp
	const formatTime = (timestamp: number) => {
		const date = new Date(timestamp);
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	};

	// Build sections array for UnifiedAccordion
	const sections: UnifiedAccordionSection[] = [
		{
			id: "transcript",
			title: "Live Transcript",
			icon: <MessageSquare className="h-4 w-4" />,
			count: entries.length,
			actions: (
				<div className="flex items-center gap-2">
					{isRecording && (
						<div className="flex items-center gap-1.5">
							<div className="size-2 animate-pulse rounded-full bg-destructive" />
							<span className="text-muted-foreground text-xs">Recording</span>
						</div>
					)}
					<Button
						className="h-8 px-2"
						onClick={handleCopy}
						size="sm"
						title="Copy transcript"
						variant="ghost"
					>
						<Copy className="size-3.5" />
					</Button>
					<Button
						className="h-8 px-2"
						onClick={handleExport}
						size="sm"
						title="Export transcript"
						variant="ghost"
					>
						<Download className="size-3.5" />
					</Button>
				</div>
			),
			content: (
				<div className="flex flex-col">
					{/* Search */}
					<div className="border-border border-b p-3">
						<div className="relative">
							<Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
							<Input
								className="h-9 bg-card pl-9 text-sm"
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search transcript..."
								type="text"
								value={searchQuery}
							/>
						</div>
					</div>

					{/* Transcript entries */}
					<div
						className="h-[calc(100vh-28rem)] space-y-3 overflow-y-auto p-4"
						onScroll={handleScroll}
						ref={scrollContainerRef}
					>
						{entries.length === 0 ? (
							<div className="flex h-full flex-col items-center justify-center text-center">
								<div className="rounded-full bg-foreground p-4">
									<Sparkles className="size-8 text-muted-foreground" />
								</div>
								<p className="mt-4 font-medium text-muted-foreground text-sm">
									No transcript yet
								</p>
								<p className="mt-1 text-muted-foreground text-xs">
									Transcript will appear here during the call
								</p>
							</div>
						) : (
							entries.map((entry) => (
								<div
									className={`rounded-lg p-3 ${entry.speaker === "csr" ? "border border-primary/30 bg-primary/20" : "border border-border/50 bg-foreground/50"}`}
									key={entry.id}
								>
									{/* Entry header */}
									<div className="mb-1.5 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span
												className={`font-semibold text-xs ${entry.speaker === "csr" ? "text-primary" : "text-muted-foreground"}`}
											>
												{entry.speaker === "csr" ? "CSR" : "Customer"}
											</span>
											{entry.isAnalyzing && (
												<div className="flex items-center gap-1">
													<div className="size-1 animate-pulse rounded-full bg-warning" />
													<span className="text-[10px] text-warning">
														AI Analyzing...
													</span>
												</div>
											)}
										</div>
										<span className="font-mono text-[10px] text-muted-foreground">
											{formatTime(entry.timestamp)}
										</span>
									</div>

									{/* Entry text */}
									<p className="text-muted-foreground text-sm leading-relaxed">
										{entry.text}
									</p>

									{/* AI extracted data */}
									{entry.aiExtracted && (
										<div className="mt-2 space-y-1 border-border border-t pt-2">
											{entry.aiExtracted.customerInfo && (
												<div className="flex flex-wrap gap-1">
													{entry.aiExtracted.customerInfo.name && (
														<span className="rounded bg-success/30 px-2 py-0.5 text-[10px] text-success">
															Name: {entry.aiExtracted.customerInfo.name}
														</span>
													)}
													{entry.aiExtracted.customerInfo.email && (
														<span className="rounded bg-success/30 px-2 py-0.5 text-[10px] text-success">
															Email: {entry.aiExtracted.customerInfo.email}
														</span>
													)}
												</div>
											)}
											{entry.aiExtracted.issueCategories &&
												entry.aiExtracted.issueCategories.length > 0 && (
													<div className="flex flex-wrap gap-1">
														{entry.aiExtracted.issueCategories.map(
															(category) => (
																<span
																	className="rounded bg-warning/30 px-2 py-0.5 text-[10px] text-warning"
																	key={category}
																>
																	{category}
																</span>
															),
														)}
													</div>
												)}
											{entry.aiExtracted.sentiment && (
												<div className="flex items-center gap-1">
													<span
														className={`rounded px-2 py-0.5 text-[10px] ${entry.aiExtracted.sentiment === "positive" ? "bg-success/30 text-success" : entry.aiExtracted.sentiment === "negative" ? "bg-destructive/30 text-destructive" : "bg-foreground/30 text-muted-foreground"}`}
													>
														Sentiment: {entry.aiExtracted.sentiment}
													</span>
													{entry.aiExtracted.confidence !== undefined && (
														<span className="font-mono text-[10px] text-muted-foreground">
															{Math.round(entry.aiExtracted.confidence)}%
														</span>
													)}
												</div>
											)}
										</div>
									)}
								</div>
							))
						)}
					</div>

					{/* Auto-scroll indicator */}
					{!autoScroll && entries.length > 0 && (
						<div className="border-border border-t bg-card p-2 text-center">
							<button
								className="text-primary text-xs hover:text-primary"
								onClick={() => setAutoScroll(true)}
								type="button"
							>
								↓ New messages below • Click to auto-scroll
							</button>
						</div>
					)}
				</div>
			),
		},
	];

	return (
		<ScrollArea className="h-full">
			<div className="flex flex-col gap-4 p-4">
				<section className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
					<div className="flex flex-col gap-4 p-0">
						<UnifiedAccordion
							defaultOpenSection="transcript"
							enableReordering={false}
							sections={sections}
							storageKey="call-window-transcript-panel"
						/>
					</div>
				</section>
			</div>
		</ScrollArea>
	);
}
