/**
 * Transcript Store - Zustand State Management
 *
 * Manages live call transcript state including:
 * - Real-time transcript entries with speaker detection
 * - AI analysis status for each transcript segment
 * - Transcript search and export functionality
 * - Speaker identification and timestamp tracking
 *
 * Performance optimizations:
 * - Lightweight state management with Zustand
 * - No provider wrapper needed
 * - Selective subscriptions prevent unnecessary re-renders
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Transcript entry type
export type TranscriptEntry = {
	id: string;
	speaker: "csr" | "customer";
	text: string;
	timestamp: number;
	isAnalyzing: boolean;
	aiExtracted?: {
		customerInfo?: {
			name?: string;
			email?: string;
			phone?: string;
			company?: string;
		};
		issueCategories?: string[];
		actionItems?: string[];
		sentiment?: "positive" | "neutral" | "negative";
		confidence?: number; // 0-100
	};
};

// Store state type
type TranscriptStore = {
	// State
	entries: TranscriptEntry[];
	isRecording: boolean;
	currentSpeaker: "csr" | "customer" | null;
	searchQuery: string;
	filteredEntries: TranscriptEntry[];

	// Actions
	addEntry: (entry: Omit<TranscriptEntry, "id" | "timestamp" | "isAnalyzing">) => void;
	updateEntry: (id: string, updates: Partial<TranscriptEntry>) => void;
	markAsAnalyzing: (id: string) => void;
	markAsAnalyzed: (id: string, extracted: TranscriptEntry["aiExtracted"]) => void;
	setCurrentSpeaker: (speaker: "csr" | "customer" | null) => void;
	setSearchQuery: (query: string) => void;
	startRecording: () => void;
	stopRecording: () => void;
	clearTranscript: () => void;
	exportTranscript: () => string;
	getFullTranscript: () => string;
};

// Initial state
const initialState = {
	entries: [],
	isRecording: false,
	currentSpeaker: null,
	searchQuery: "",
	filteredEntries: [],
};

// Create store
export const useTranscriptStore = create<TranscriptStore>()(
	devtools(
		(set, get) => ({
			...initialState,

			addEntry: (entry) => {
				const newEntry: TranscriptEntry = {
					...entry,
					id: `transcript-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
					timestamp: Date.now(),
					isAnalyzing: false,
				};

				set((state) => {
					const entries = [...state.entries, newEntry];
					return {
						entries,
						filteredEntries: state.searchQuery
							? entries.filter((e) =>
									e.text.toLowerCase().includes(state.searchQuery.toLowerCase())
								)
							: entries,
					};
				});
			},

			updateEntry: (id, updates) => {
				set((state) => {
					const entries = state.entries.map((entry) =>
						entry.id === id ? { ...entry, ...updates } : entry
					);
					return {
						entries,
						filteredEntries: state.searchQuery
							? entries.filter((e) =>
									e.text.toLowerCase().includes(state.searchQuery.toLowerCase())
								)
							: entries,
					};
				});
			},

			markAsAnalyzing: (id) => {
				get().updateEntry(id, { isAnalyzing: true });
			},

			markAsAnalyzed: (id, extracted) => {
				get().updateEntry(id, {
					isAnalyzing: false,
					aiExtracted: extracted,
				});
			},

			setCurrentSpeaker: (speaker) => set({ currentSpeaker: speaker }),

			setSearchQuery: (query) => {
				set((state) => ({
					searchQuery: query,
					filteredEntries: query
						? state.entries.filter((e) => e.text.toLowerCase().includes(query.toLowerCase()))
						: state.entries,
				}));
			},

			startRecording: () => set({ isRecording: true }),

			stopRecording: () => set({ isRecording: false }),

			clearTranscript: () => set(initialState),

			exportTranscript: () => {
				const { entries } = get();
				return JSON.stringify(
					entries.map((e) => ({
						speaker: e.speaker,
						text: e.text,
						timestamp: new Date(e.timestamp).toISOString(),
						aiExtracted: e.aiExtracted,
					})),
					null,
					2
				);
			},

			getFullTranscript: () => {
				const { entries } = get();
				return entries
					.map((e) => {
						const time = new Date(e.timestamp).toLocaleTimeString();
						const speaker = e.speaker === "csr" ? "CSR" : "Customer";
						return `[${time}] ${speaker}: ${e.text}`;
					})
					.join("\n");
			},
		}),
		{ name: "TranscriptStore" }
	)
);
