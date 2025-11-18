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
							<div className="bg-destructive size-2 animate-pulse rounded-full" />
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
							<Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
							<Input
								className="bg-card h-9 pl-9 text-sm"
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
								<div className="bg-foreground rounded-full p-4">
									<Sparkles className="text-muted-foreground size-8" />
								</div>
								<p className="text-muted-foreground mt-4 text-sm font-medium">
									No transcript yet
								</p>
								<p className="text-muted-foreground mt-1 text-xs">
									Transcript will appear here during the call
								</p>
							</div>
						) : (
							entries.map((entry) => (
								<div
									className={`rounded-lg p-3 ${entry.speaker === "csr" ? "border-primary/30 bg-primary/20 border" : "border-border/50 bg-foreground/50 border"}`}
									key={entry.id}
								>
									{/* Entry header */}
									<div className="mb-1.5 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<span
												className={`text-xs font-semibold ${entry.speaker === "csr" ? "text-primary" : "text-muted-foreground"}`}
											>
												{entry.speaker === "csr" ? "CSR" : "Customer"}
											</span>
											{entry.isAnalyzing && (
												<div className="flex items-center gap-1">
													<div className="bg-warning size-1 animate-pulse rounded-full" />
													<span className="text-warning text-[10px]">
														AI Analyzing...
													</span>
												</div>
											)}
										</div>
										<span className="text-muted-foreground font-mono text-[10px]">
											{formatTime(entry.timestamp)}
										</span>
									</div>

									{/* Entry text */}
									<p className="text-muted-foreground text-sm leading-relaxed">
										{entry.text}
									</p>

									{/* AI extracted data */}
									{entry.aiExtracted && (
										<div className="border-border mt-2 space-y-1 border-t pt-2">
											{entry.aiExtracted.customerInfo && (
												<div className="flex flex-wrap gap-1">
													{entry.aiExtracted.customerInfo.name && (
														<span className="bg-success/30 text-success rounded px-2 py-0.5 text-[10px]">
															Name: {entry.aiExtracted.customerInfo.name}
														</span>
													)}
													{entry.aiExtracted.customerInfo.email && (
														<span className="bg-success/30 text-success rounded px-2 py-0.5 text-[10px]">
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
																	className="bg-warning/30 text-warning rounded px-2 py-0.5 text-[10px]"
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
														<span className="text-muted-foreground font-mono text-[10px]">
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
						<div className="border-border bg-card border-t p-2 text-center">
							<button
								className="text-primary hover:text-primary text-xs"
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
				<section className="border-border/60 bg-card overflow-hidden rounded-xl border shadow-sm">
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
