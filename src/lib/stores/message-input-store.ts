/**
 * Message Input Store - Manages message composition state
 *
 * Features:
 * - Draft messages saved per thread
 * - Attachment management
 * - Template selection
 * - Auto-save drafts
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AttachmentPreview {
	id: string;
	file: File;
	type: "image" | "video" | "document" | "audio";
	preview?: string; // Data URL for image previews
	size: number;
	name: string;
}

export interface MessageDraft {
	threadId: string;
	text: string;
	attachments: AttachmentPreview[];
	selectedCompanyLine: string | null;
	selectedTemplateId: string | null;
	lastSaved: Date;
}

interface MessageInputState {
	// Draft storage (Map: threadId -> draft)
	drafts: Map<string, MessageDraft>;

	// Current composition state
	currentThreadId: string | null;

	// Actions - Draft management
	saveDraft: (
		threadId: string,
		text: string,
		attachments?: AttachmentPreview[],
	) => void;
	loadDraft: (threadId: string) => MessageDraft | null;
	clearDraft: (threadId: string) => void;
	clearAllDrafts: () => void;

	// Actions - Attachments
	addAttachment: (threadId: string, attachment: AttachmentPreview) => void;
	removeAttachment: (threadId: string, attachmentId: string) => void;
	clearAttachments: (threadId: string) => void;

	// Actions - Template
	setTemplate: (threadId: string, templateId: string | null) => void;

	// Actions - Company line selection
	setCompanyLine: (threadId: string, lineId: string | null) => void;

	// Actions - Current thread
	setCurrentThread: (threadId: string | null) => void;

	// Getters
	getCurrentDraft: () => MessageDraft | null;
	getDraftText: (threadId: string) => string;
	hasUnsavedChanges: (threadId: string) => boolean;
}

export const useMessageInputStore = create<MessageInputState>()(
	persist(
		(set, get) => ({
			drafts: new Map(),
			currentThreadId: null,

			// Draft management
			saveDraft: (threadId, text, attachments) =>
				set((state) => {
					const existingDraft = state.drafts.get(threadId);
					const newDraft: MessageDraft = {
						threadId,
						text,
						attachments: attachments || existingDraft?.attachments || [],
						selectedCompanyLine: existingDraft?.selectedCompanyLine || null,
						selectedTemplateId: existingDraft?.selectedTemplateId || null,
						lastSaved: new Date(),
					};

					const newDrafts = new Map(state.drafts);
					newDrafts.set(threadId, newDraft);

					return { drafts: newDrafts };
				}),

			loadDraft: (threadId) => {
				const { drafts } = get();
				return drafts.get(threadId) || null;
			},

			clearDraft: (threadId) =>
				set((state) => {
					const newDrafts = new Map(state.drafts);
					newDrafts.delete(threadId);
					return { drafts: newDrafts };
				}),

			clearAllDrafts: () => set({ drafts: new Map() }),

			// Attachment management
			addAttachment: (threadId, attachment) =>
				set((state) => {
					const draft = state.drafts.get(threadId);
					if (!draft) {
						// Create new draft with attachment
						const newDraft: MessageDraft = {
							threadId,
							text: "",
							attachments: [attachment],
							selectedCompanyLine: null,
							selectedTemplateId: null,
							lastSaved: new Date(),
						};
						const newDrafts = new Map(state.drafts);
						newDrafts.set(threadId, newDraft);
						return { drafts: newDrafts };
					}

					const updatedDraft = {
						...draft,
						attachments: [...draft.attachments, attachment],
						lastSaved: new Date(),
					};

					const newDrafts = new Map(state.drafts);
					newDrafts.set(threadId, updatedDraft);
					return { drafts: newDrafts };
				}),

			removeAttachment: (threadId, attachmentId) =>
				set((state) => {
					const draft = state.drafts.get(threadId);
					if (!draft) return state;

					const updatedDraft = {
						...draft,
						attachments: draft.attachments.filter((a) => a.id !== attachmentId),
						lastSaved: new Date(),
					};

					const newDrafts = new Map(state.drafts);
					newDrafts.set(threadId, updatedDraft);
					return { drafts: newDrafts };
				}),

			clearAttachments: (threadId) =>
				set((state) => {
					const draft = state.drafts.get(threadId);
					if (!draft) return state;

					const updatedDraft = {
						...draft,
						attachments: [],
						lastSaved: new Date(),
					};

					const newDrafts = new Map(state.drafts);
					newDrafts.set(threadId, updatedDraft);
					return { drafts: newDrafts };
				}),

			// Template selection
			setTemplate: (threadId, templateId) =>
				set((state) => {
					const draft = state.drafts.get(threadId);
					if (!draft) {
						const newDraft: MessageDraft = {
							threadId,
							text: "",
							attachments: [],
							selectedCompanyLine: null,
							selectedTemplateId: templateId,
							lastSaved: new Date(),
						};
						const newDrafts = new Map(state.drafts);
						newDrafts.set(threadId, newDraft);
						return { drafts: newDrafts };
					}

					const updatedDraft = {
						...draft,
						selectedTemplateId: templateId,
						lastSaved: new Date(),
					};

					const newDrafts = new Map(state.drafts);
					newDrafts.set(threadId, updatedDraft);
					return { drafts: newDrafts };
				}),

			// Company line selection
			setCompanyLine: (threadId, lineId) =>
				set((state) => {
					const draft = state.drafts.get(threadId);
					if (!draft) {
						const newDraft: MessageDraft = {
							threadId,
							text: "",
							attachments: [],
							selectedCompanyLine: lineId,
							selectedTemplateId: null,
							lastSaved: new Date(),
						};
						const newDrafts = new Map(state.drafts);
						newDrafts.set(threadId, newDraft);
						return { drafts: newDrafts };
					}

					const updatedDraft = {
						...draft,
						selectedCompanyLine: lineId,
						lastSaved: new Date(),
					};

					const newDrafts = new Map(state.drafts);
					newDrafts.set(threadId, updatedDraft);
					return { drafts: newDrafts };
				}),

			// Current thread
			setCurrentThread: (threadId) => set({ currentThreadId: threadId }),

			// Getters
			getCurrentDraft: () => {
				const { currentThreadId, drafts } = get();
				if (!currentThreadId) return null;
				return drafts.get(currentThreadId) || null;
			},

			getDraftText: (threadId) => {
				const { drafts } = get();
				const draft = drafts.get(threadId);
				return draft?.text || "";
			},

			hasUnsavedChanges: (threadId) => {
				const { drafts } = get();
				const draft = drafts.get(threadId);
				if (!draft) return false;
				return draft.text.length > 0 || draft.attachments.length > 0;
			},
		}),
		{
			name: "message-input-storage",
			// Custom serialization for Map
			storage: {
				getItem: (name) => {
					const str = localStorage.getItem(name);
					if (!str) return null;
					const { state } = JSON.parse(str);
					return {
						state: {
							...state,
							drafts: new Map(Object.entries(state.drafts || {})),
						},
					};
				},
				setItem: (name, value) => {
					const draftsObject = Object.fromEntries(value.state.drafts);
					localStorage.setItem(
						name,
						JSON.stringify({
							state: {
								...value.state,
								drafts: draftsObject,
							},
						}),
					);
				},
				removeItem: (name) => localStorage.removeItem(name),
			},
			// Only persist drafts, not currentThreadId
			partialize: (state) => ({ drafts: state.drafts }),
		},
	),
);
