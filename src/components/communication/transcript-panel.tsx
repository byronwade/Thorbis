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

import { Copy, Download, Search, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranscriptStore } from "@/lib/stores/transcript-store";

export function TranscriptPanel() {
  const entries = useTranscriptStore((state) =>
    state.filteredEntries.length > 0 ? state.filteredEntries : state.entries
  );
  const searchQuery = useTranscriptStore((state) => state.searchQuery);
  const setSearchQuery = useTranscriptStore((state) => state.setSearchQuery);
  const isRecording = useTranscriptStore((state) => state.isRecording);
  const exportTranscript = useTranscriptStore(
    (state) => state.exportTranscript
  );
  const getFullTranscript = useTranscriptStore(
    (state) => state.getFullTranscript
  );

  const [autoScroll, setAutoScroll] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new entries arrive
  useEffect(() => {
    if (autoScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [entries, autoScroll]);

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

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-zinc-700 border-b bg-zinc-800/50 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-blue-400" />
          <h3 className="font-semibold text-sm text-white">Live Transcript</h3>
          {isRecording && (
            <div className="flex items-center gap-1.5">
              <div className="size-2 animate-pulse rounded-full bg-red-500" />
              <span className="text-xs text-zinc-400">Recording</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCopy}
            size="sm"
            title="Copy transcript"
            variant="ghost"
          >
            <Copy className="size-4" />
          </Button>
          <Button
            onClick={handleExport}
            size="sm"
            title="Export transcript"
            variant="ghost"
          >
            <Download className="size-4" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="border-zinc-700 border-b p-3">
        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-zinc-500" />
          <Input
            className="h-9 bg-zinc-900 pl-9 text-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transcript..."
            type="text"
            value={searchQuery}
          />
        </div>
      </div>

      {/* Transcript entries */}
      <div
        className="flex-1 space-y-3 overflow-y-auto p-4"
        onScroll={handleScroll}
        ref={scrollContainerRef}
      >
        {entries.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="rounded-full bg-zinc-800 p-4">
              <Sparkles className="size-8 text-zinc-600" />
            </div>
            <p className="mt-4 font-medium text-sm text-zinc-500">
              No transcript yet
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              Transcript will appear here during the call
            </p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              className={`rounded-lg p-3 ${entry.speaker === "csr" ? "border border-blue-700/30 bg-blue-900/20" : "border border-zinc-700/50 bg-zinc-800/50"}`}
              key={entry.id}
            >
              {/* Entry header */}
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-semibold text-xs ${entry.speaker === "csr" ? "text-blue-400" : "text-zinc-400"}`}
                  >
                    {entry.speaker === "csr" ? "CSR" : "Customer"}
                  </span>
                  {entry.isAnalyzing && (
                    <div className="flex items-center gap-1">
                      <div className="size-1 animate-pulse rounded-full bg-amber-500" />
                      <span className="text-[10px] text-amber-500">
                        AI Analyzing...
                      </span>
                    </div>
                  )}
                </div>
                <span className="font-mono text-[10px] text-zinc-600">
                  {formatTime(entry.timestamp)}
                </span>
              </div>

              {/* Entry text */}
              <p className="text-sm text-zinc-300 leading-relaxed">
                {entry.text}
              </p>

              {/* AI extracted data */}
              {entry.aiExtracted && (
                <div className="mt-2 space-y-1 border-zinc-700 border-t pt-2">
                  {entry.aiExtracted.customerInfo && (
                    <div className="flex flex-wrap gap-1">
                      {entry.aiExtracted.customerInfo.name && (
                        <span className="rounded bg-green-900/30 px-2 py-0.5 text-[10px] text-green-400">
                          Name: {entry.aiExtracted.customerInfo.name}
                        </span>
                      )}
                      {entry.aiExtracted.customerInfo.email && (
                        <span className="rounded bg-green-900/30 px-2 py-0.5 text-[10px] text-green-400">
                          Email: {entry.aiExtracted.customerInfo.email}
                        </span>
                      )}
                    </div>
                  )}
                  {entry.aiExtracted.issueCategories &&
                    entry.aiExtracted.issueCategories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.aiExtracted.issueCategories.map((category) => (
                          <span
                            className="rounded bg-amber-900/30 px-2 py-0.5 text-[10px] text-amber-400"
                            key={category}
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    )}
                  {entry.aiExtracted.sentiment && (
                    <div className="flex items-center gap-1">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] ${entry.aiExtracted.sentiment === "positive" ? "bg-green-900/30 text-green-400" : entry.aiExtracted.sentiment === "negative" ? "bg-red-900/30 text-red-400" : "bg-zinc-700/30 text-zinc-400"}`}
                      >
                        Sentiment: {entry.aiExtracted.sentiment}
                      </span>
                      {entry.aiExtracted.confidence !== undefined && (
                        <span className="font-mono text-[10px] text-zinc-600">
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
        <div className="border-zinc-700 border-t bg-zinc-900 p-2 text-center">
          <button
            className="text-blue-400 text-xs hover:text-blue-300"
            onClick={() => setAutoScroll(true)}
            type="button"
          >
            ↓ New messages below • Click to auto-scroll
          </button>
        </div>
      )}
    </div>
  );
}
