/**
 * Unified Inbox Page Client Component
 *
 * Complete unified communication hub combining email and SMS features
 * Features: full email composer, reply/forward, SMS conversation threads,
 * message sending, attachments, templates, AI suggestions
 */

"use client";

import { toggleStarCommunicationAction } from "@/actions/communications";
import {
    archiveEmailAction,
    bulkDeleteEmailsAction,
    fetchEmailContentAction,
    markEmailAsReadAction,
    retryFailedEmailAction,
    toggleSpamEmailAction,
} from "@/actions/email-actions";
import type {
    CompanySms,
    SmsTemplateContext,
} from "@/actions/sms-actions";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { formatDistanceToNow } from "date-fns";
import {
    AlertCircle,
    AlertTriangle,
    Archive,
    ArrowLeft,
    Briefcase,
    CheckCheck,
    Clock,
    Download,
    Flag,
    Forward,
    Loader2,
    Mail,
    MessageSquare,
    MoreHorizontal,
    PanelLeft,
    Paperclip,
    Phone,
    Printer,
    RefreshCw,
    Reply,
    ReplyAll,
    Star,
    StickyNote,
    Trash2,
    User,
    UserPlus,
    Voicemail,
    X
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

// Type for message attachments stored in provider_metadata
type MessageAttachment = {
	type?: string;
	url?: string;
	filename?: string;
};

import {
    getCompanyContextAction,
    getSmsConversationAction,
    markSmsAsReadAction,
    markSmsConversationAsReadAction,
} from "@/actions/sms-actions";
import {
    getTeamChannelMessagesAction,
    markTeamChannelAsReadAction,
    sendTeamChannelMessageAction,
    type ChannelMessage,
} from "@/actions/teams-actions";
import { sendTextMessage } from "@/actions/twilio";
import { AutoLinkSuggestions } from "@/components/communication/auto-link-suggestions";
import { CallDetailView } from "@/components/communication/call-detail-view";
import { CommunicationEmptyState } from "@/components/communication/communication-empty-state";
import {
    SmsConversationSkeleton,
    TeamsChannelSkeleton
} from "@/components/communication/communication-loading-skeleton";
import { EmailContent } from "@/components/communication/email-content";
import { EmailFullComposer } from "@/components/communication/email-full-composer";
import {
    EmailReplyComposer,
    type EmailReplyMode,
} from "@/components/communication/email-reply-composer";
import { SmsMessageInput } from "@/components/communication/sms-message-input";
import { TransferDialog } from "@/components/communication/transfer-dialog";
import { VoicemailDetailView } from "@/components/communication/voicemail-detail-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useSidebar } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import {
    TooltipProvider
} from "@/components/ui/tooltip";
import type { Communication, CommunicationCounts } from "@/lib/queries/communications";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

import { Hash } from "lucide-react";

// Types
type InboxType = "personal" | "company" | "all";
type ViewMode = "list" | "grid";
type CommunicationType = "all" | "email" | "sms" | "call" | "voicemail";

/**
 * Check if a communication is a team channel message
 * Team messages should never appear in "All Messages" view
 * 
 * Team messages are identified by:
 * 1. channel = "teams" (definitive)
 * 2. to_address starting with "channel:" (definitive)
 * 3. Tags containing channel names AND having channel="teams" (definitive)
 * 
 * Note: We don't filter by tags alone because regular emails can have
 * category tags like "support" or "sales" that match team channel names.
 */
function isTeamChannelMessage(communication: Communication): boolean {
	// Check if channel is explicitly "teams" - this is the definitive indicator
	if ((communication as any).channel === "teams") {
		return true;
	}
	
	// Check if to_address indicates a channel (team messages have to_address like "channel:general")
	// This is also definitive - regular emails don't have this pattern
	if (communication.toAddress?.startsWith("channel:")) {
		return true;
	}
	
	// Don't filter by tags alone - regular emails can have category tags that match
	// team channel names (e.g., "support", "sales"). Only filter if channel="teams" is also set.
	
	return false;
}

/**
 * Filter out team channel messages from communications array
 */
function filterOutTeamMessages(communications: Communication[]): Communication[] {
	return communications.filter((comm) => !isTeamChannelMessage(comm));
}

/**
 * Get contact display name for a communication
 * Priority:
 * 1. Customer name (if linked)
 * 2. fromName/toName from communication
 * 3. fromAddress/toAddress as fallback
 */
function getContactDisplayName(
	communication: Communication,
	direction?: "from" | "to"
): string {
	const effectiveDirection = direction || (communication.direction === "inbound" ? "from" : "to");

	// Priority 1: Linked customer name
	if (communication.customer) {
		const customerName = communication.customer.firstName
			? `${communication.customer.firstName} ${communication.customer.lastName || ""}`.trim()
			: null;
		if (customerName) return customerName;
	}

	// Priority 2: fromName/toName from communication
	if (effectiveDirection === "from" && communication.fromName) {
		return communication.fromName;
	}
	if (effectiveDirection === "to" && communication.toName) {
		return communication.toName;
	}

	// Priority 3: Address as fallback (always show email/phone, never "Unknown")
	const address = effectiveDirection === "from"
		? communication.fromAddress
		: communication.toAddress;

	// Always show the actual email/phone address if available
	// Only show "Unknown" if there's truly no address
	return address || (effectiveDirection === "from" ? "Unknown sender" : "Unknown recipient");
}

/**
 * Get type configuration for communication types (memoized helper)
 * Returns icon, background color, and icon color for each type
 */
function getTypeConfig(type: string) {
	switch (type) {
		case "email":
			return { 
				icon: Mail, 
				bg: "bg-blue-500 dark:bg-blue-600",
				iconColor: "text-white"
			};
		case "sms":
			return {
				icon: MessageSquare,
				bg: "bg-green-500 dark:bg-green-600",
				iconColor: "text-white"
			};
		case "call":
			return {
				icon: Phone,
				bg: "bg-purple-500 dark:bg-purple-600",
				iconColor: "text-white"
			};
		case "voicemail":
			return {
				icon: Voicemail,
				bg: "bg-orange-500 dark:bg-orange-600",
				iconColor: "text-white"
			};
		default:
			return { 
				icon: Mail, 
				bg: "bg-gray-500 dark:bg-gray-600",
				iconColor: "text-white"
			};
	}
}

interface UnifiedInboxPageClientProps {
	initialCommunications: Communication[];
	initialCounts?: CommunicationCounts;
	companyId: string;
	teamMemberId: string;
	initialInboxType?: InboxType;
	initialFolder?: string;
	initialCategory?: string;
	initialCommunicationId?: string;
	initialChannelId?: string | null;
}

export function UnifiedInboxPageClient({
	initialCommunications,
	initialCounts,
	companyId,
	teamMemberId,
	initialInboxType = "personal",
	initialFolder = "inbox",
	initialCategory = "primary",
	initialCommunicationId,
	initialChannelId,
}: UnifiedInboxPageClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toggleSidebar } = useSidebar();

	const inboxType: InboxType =
		(searchParams?.get("inbox") as InboxType) || initialInboxType;
	const folder = searchParams?.get("folder") || initialFolder;
	const category = searchParams?.get("category") || initialCategory;
	// Use initialChannelId on first render to match server, then sync with searchParams
	// This prevents hydration mismatch by ensuring server and client render the same initially
	const [isMounted, setIsMounted] = useState(false);
	
	// Mark as mounted after hydration
	useEffect(() => {
		setIsMounted(true);
	}, []);
	
	// Use searchParams value after mount, initialChannelId before mount (for SSR)
	// This ensures server and client render the same structure on first render
	const channelId = isMounted ? searchParams?.get("channel") : (initialChannelId || null);
	const assignedFilter = searchParams?.get("assigned");
	const typeFromUrl = searchParams?.get("type") as CommunicationType | null;

	const communicationIdFromQuery = searchParams?.get("id");
	const communicationId = communicationIdFromQuery || initialCommunicationId;
	const [isPending, startTransition] = useTransition();

	// Core communication state - filter out team messages immediately
	const [communications, setCommunications] = useState<Communication[]>(
		filterOutTeamMessages(initialCommunications),
	);
	// Teams state
	const [channelMessages, setChannelMessages] = useState<ChannelMessage[]>([]);
	const [loadingChannelMessages, setLoadingChannelMessages] = useState(false);
	const conversationScrollRef = useRef<HTMLDivElement>(null);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);

	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedCommunication, setSelectedCommunication] =
		useState<Communication | null>(() => {
			if (communicationId && initialCommunications) {
				const comm = initialCommunications.find((c) => c.id === communicationId);
				// Don't select team channel messages - they should never appear in inbox view
				if (comm && !isTeamChannelMessage(comm)) {
					return comm;
				}
			}
			return null;
		});

	// Search and filter state - using debounced search hook
	const { searchInput, searchQuery, setSearchInput, clearSearch } = useDebouncedSearch();
	
	// Type filter - use URL as single source of truth
	const typeFilter: CommunicationType = typeFromUrl || "all";

	// Notes state
	const [notesOpen, setNotesOpen] = useState(false);
	const [internalNotes, setInternalNotes] = useState("");
	const [savingNotes, setSavingNotes] = useState(false);

	// Email compose/reply state
	const [composeMode, setComposeMode] = useState(false);
	const [replyMode, setReplyMode] = useState<EmailReplyMode | null>(null);
	const [emailContent, setEmailContent] = useState<{
		html?: string | null;
		text?: string | null;
	} | null>(null);
	const [loadingContent, setLoadingContent] = useState(false);
	const [retrying, setRetrying] = useState(false);

	// SMS state
	const [conversationMessages, setConversationMessages] = useState<CompanySms[]>([]);
	const [loadingConversation, setLoadingConversation] = useState(false);
	
	// Cache for fast switching between communications
	const emailContentCache = useRef<Map<string, { html?: string | null; text?: string | null }>>(new Map());
	const smsConversationCache = useRef<Map<string, CompanySms[]>>(new Map());
	const [messageInput, setMessageInput] = useState("");
	const [sendingMessage, setSendingMessage] = useState(false);
	const [attachments, setAttachments] = useState<File[]>([]);
	const [companyContext, setCompanyContext] = useState<SmsTemplateContext | null>(null);
	// Initialize starredIds from initial communications
	const [starredIds, setStarredIds] = useState<Set<string>>(() => {
		const starred = new Set<string>();
		initialCommunications?.forEach((comm) => {
			if (comm.tags && Array.isArray(comm.tags) && comm.tags.includes("starred")) {
				starred.add(comm.id);
			}
		});
		return starred;
	});

	// Transfer dialog state
	const [transferDialogOpen, setTransferDialogOpen] = useState(false);

	// Refs for stable values
	const selectedCommunicationRef = useRef<Communication | null>(selectedCommunication);
	const refreshingRef = useRef(refreshing);
	refreshingRef.current = refreshing;
	
	// Refs to prevent unnecessary fetch triggers
	const fetchLockRef = useRef(false);
	const lastFetchParamsRef = useRef<string>("");
	
	// Store URL params in refs for stable access
	const folderRef = useRef(folder);
	const inboxTypeRef = useRef(inboxType);
	const categoryRef = useRef(category);
	const assignedFilterRef = useRef(assignedFilter);
	const channelIdRef = useRef(channelId);
	const typeFromUrlRef = useRef(typeFromUrl);
	const teamMemberIdRef = useRef(teamMemberId);
	const companyIdRef = useRef(companyId);
	
	// Update refs when values change
	folderRef.current = folder;
	inboxTypeRef.current = inboxType;
	categoryRef.current = category;
	assignedFilterRef.current = assignedFilter;
	channelIdRef.current = channelId;
	typeFromUrlRef.current = typeFromUrl;
	teamMemberIdRef.current = teamMemberId;
	companyIdRef.current = companyId;

	// Handle compose=true query param from navigation
	useEffect(() => {
		const shouldCompose = searchParams?.get("compose") === "true";
		if (shouldCompose && !composeMode) {
			setComposeMode(true);
			setSelectedCommunication(null);
			setEmailContent(null);
			selectedCommunicationRef.current = null;
			// Clean up URL
			const newParams = new URLSearchParams(searchParams?.toString() || "");
			newParams.delete("compose");
			const newUrl = newParams.toString()
				? `/dashboard/communication?${newParams.toString()}`
				: "/dashboard/communication";
			router.replace(newUrl);
		}
	}, [searchParams, router, composeMode]);

	// Keyboard shortcut: 'C' to open compose mode
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement;
			if (
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.isContentEditable
			) {
				return;
			}

			if (
				e.key === "c" &&
				!e.metaKey &&
				!e.ctrlKey &&
				!e.altKey &&
				!composeMode
			) {
				e.preventDefault();
				// Open compose type selector
				window.dispatchEvent(new CustomEvent("open-unified-compose"));
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [composeMode]);

	// Fetch company context for SMS templates
	useEffect(() => {
		getCompanyContextAction().then((result) => {
			if (result.success && result.context) {
				setCompanyContext(result.context);
			}
		});
	}, []);

	// Get current user ID for Teams channel message direction
	useEffect(() => {
		const supabase = createClient();
		if (supabase) {
			supabase.auth.getUser().then(({ data: { user } }) => {
				if (user) {
					setCurrentUserId(user.id);
				}
			});
		}
	}, []);

	// Track the last loaded communication ID to prevent re-fetching on list refresh
	const lastLoadedCommIdRef = useRef<string | null>(null);

	// Handle initial load from URL or when URL changes externally (e.g., back button)
	useEffect(() => {
		// Skip if we already handled this ID or if selection was triggered by click
		if (communicationId === lastLoadedCommIdRef.current) {
			return;
		}
		
		if (communicationId && communications) {
			const comm = communications.find((c) => c.id === communicationId);
			if (comm && selectedCommunicationRef.current?.id !== comm.id) {
				lastLoadedCommIdRef.current = communicationId;
				// Set basic state for initial load
				setSelectedCommunication(comm);
				setInternalNotes(comm.internalNotes || "");
				selectedCommunicationRef.current = comm;
				setReplyMode(null);
				
				// Load content based on type using cache
				if (comm.type === "email") {
					const cached = emailContentCache.current.get(comm.id);
					if (cached) {
						setEmailContent(cached);
					} else if (comm.body || comm.bodyHtml) {
						const content = { html: comm.bodyHtml || null, text: comm.body || null };
						setEmailContent(content);
						emailContentCache.current.set(comm.id, content);
					}
					setConversationMessages([]);
				} else if (comm.type === "sms") {
					const phoneNumber = comm.direction === "inbound" ? comm.fromAddress : comm.toAddress;
					if (phoneNumber) {
						const cached = smsConversationCache.current.get(phoneNumber);
						if (cached) {
							setConversationMessages(cached);
						}
					}
					setEmailContent(null);
				}
			}
		} else if (!communicationId) {
			lastLoadedCommIdRef.current = null;
			setSelectedCommunication(null);
			selectedCommunicationRef.current = null;
			setEmailContent(null);
			setConversationMessages([]);
			setReplyMode(null);
		}
	}, [communicationId, communications]);

	// Store searchQuery in ref for stable access
	const searchQueryRef = useRef(searchQuery);
	searchQueryRef.current = searchQuery;
	
	// Fetch communications function - optimized with refs to prevent unnecessary re-creates
	const fetchCommunications = useCallback(
		async (showRefreshing = false) => {
			// Create unique fetch key from current params
			const fetchKey = JSON.stringify({
				folder: folderRef.current,
				inboxType: inboxTypeRef.current,
				category: categoryRef.current,
				assignedFilter: assignedFilterRef.current,
				channelId: channelIdRef.current,
				typeFromUrl: typeFromUrlRef.current,
				searchQuery: searchQueryRef.current,
			});
			
			// Prevent duplicate fetches with same params (unless manual refresh)
			if (fetchLockRef.current) {
				return;
			}
			
			// For automatic fetches, skip if params haven't changed AND we have communications
			// If communications array is empty, always fetch (user might have navigated back)
			if (!showRefreshing && lastFetchParamsRef.current === fetchKey && communications.length > 0) {
				return;
			}
			
			fetchLockRef.current = true;
			if (!showRefreshing) {
				lastFetchParamsRef.current = fetchKey;
			}
			
			setRefreshing(true);
			setError(null);

			startTransition(async () => {
				try {
					const currentChannelId = channelIdRef.current;
					const currentSearchQuery = searchQueryRef.current;
					
					// If viewing a Teams channel, fetch channel messages instead of communications list
					if (currentChannelId) {
						setLoadingChannelMessages(true);
						const result = await getTeamChannelMessagesAction({
							channel: currentChannelId,
							limit: 50,
							offset: 0,
							search: currentSearchQuery || undefined,
						});

						if (result.success && result.messages) {
							setChannelMessages(result.messages);
							
							// Mark as read logic
							const unreadMessages = result.messages.filter(
								(msg) => !msg.read_at && msg.direction === "inbound",
							);
							if (unreadMessages.length > 0) {
								markTeamChannelAsReadAction(currentChannelId).catch(console.error);
							}
						} else {
							setError(result.error || "Failed to load channel messages");
						}
						setLoadingChannelMessages(false);
						setRefreshing(false);
						fetchLockRef.current = false;
						return;
					}

					const { getCommunicationsAction } = await import(
						"@/actions/communications"
					);
					
					const currentFolder = folderRef.current;
					const currentInboxType = inboxTypeRef.current;
					const currentCategory = categoryRef.current;
					const currentAssignedFilter = assignedFilterRef.current;
					const currentTypeFromUrl = typeFromUrlRef.current;
					const currentTeamMemberId = teamMemberIdRef.current;
					const currentCompanyId = companyIdRef.current;
					const currentTypeFilter: CommunicationType = currentTypeFromUrl || "all";
					
					// Build filters based on folder
					let statusFilter: string | undefined;
					let directionFilter: "inbound" | "outbound" | undefined;
					let isArchivedFilter: boolean | undefined;
					let isDraftFilter: boolean | undefined;

					if (currentFolder === "draft") {
						isDraftFilter = true;
					} else if (currentFolder === "archived") {
						isArchivedFilter = true;
					} else if (currentFolder === "sent") {
						directionFilter = "outbound";
						// Sent folder should exclude drafts and archived
						isDraftFilter = false;
						isArchivedFilter = false;
					} else if (currentFolder === "inbox") {
						// Inbox folder handled by getCommunicationsAction
						// Just ensure we're not showing drafts or archived
						isDraftFilter = false;
						isArchivedFilter = false;
					} else if (currentFolder === "starred") {
						// Starred folder - filter by tags in memory
						// Just ensure we're not showing drafts or archived
						isDraftFilter = false;
						isArchivedFilter = false;
					} else if (currentFolder && ["archive", "trash", "spam"].includes(currentFolder)) {
						statusFilter = currentFolder;
					}

					const result = await getCommunicationsAction({
						teamMemberId: currentTeamMemberId,
						companyId: currentCompanyId,
						limit: 50,
						offset: 0,
						type: currentTypeFilter !== "all" ? currentTypeFilter : undefined,
						// Inbox type determines filtering logic
						inboxType: currentInboxType,
						// For personal inbox, always filter by mailbox_owner_id for emails
						// This ensures personal emails are shown regardless of folder
						mailboxOwnerId: currentInboxType === "personal" ? currentTeamMemberId : undefined,
						// If viewing company inbox, filter by category
						category:
							currentInboxType === "company" && currentCategory && ["support", "sales", "billing", "general"].includes(currentCategory)
								? (currentCategory as "support" | "sales" | "billing" | "general")
								: undefined,
						// Status filter for archive, trash, spam
						status: statusFilter,
						// Special handling for "sent" folder - filter by direction
						direction: directionFilter,
						// Filter by assigned user if needed
						assignedTo: currentAssignedFilter === "me" ? "me" : undefined,
						searchQuery: currentSearchQuery || undefined,
						sortBy: "created_at",
						sortOrder: "desc",
						// Add draft and archived filters
						isDraft: isDraftFilter,
						isArchived: isArchivedFilter,
						// Pass folder for special handling
						folder: currentFolder,
					});

					if (result.success && result.data) {
						const fetchedComms = result.data as Communication[];
						// Filter out team channel messages before setting state to prevent flash
						const filteredComms = filterOutTeamMessages(fetchedComms);
						setCommunications(filteredComms);

						// Sync starredIds from filtered communications (team messages shouldn't be starred in inbox)
						setStarredIds((prev) => {
							const newStarred = new Set(prev);
							filteredComms.forEach((comm) => {
								if (comm.tags && Array.isArray(comm.tags) && comm.tags.includes("starred")) {
									newStarred.add(comm.id);
								}
							});
							return newStarred;
						});

						// Update selected communication if it's still in the filtered list
						// Clear selection if it was a team message
						const currentSelected = selectedCommunicationRef.current;
						if (currentSelected) {
							if (isTeamChannelMessage(currentSelected)) {
								// Selected communication is a team message, clear it
								setSelectedCommunication(null);
								selectedCommunicationRef.current = null;
								setEmailContent(null);
							} else {
								const updatedComm = filteredComms.find(
									(c) => c.id === currentSelected.id,
								);
								if (updatedComm) {
									setSelectedCommunication(updatedComm);
									selectedCommunicationRef.current = updatedComm;
								}
							}
						}
					}
				} catch (err) {
					console.error("Failed to fetch communications:", err);
					const errorMessage =
						err instanceof Error
							? err.message
							: "Failed to load communications";
					setError(errorMessage);
					toast.error("Failed to load communications", {
						description: errorMessage,
					});
				} finally {
					setRefreshing(false);
					fetchLockRef.current = false;
					// Always update last fetch params after completion to prevent duplicate fetches
					const currentFetchKey = JSON.stringify({
						folder: folderRef.current,
						inboxType: inboxTypeRef.current,
						category: categoryRef.current,
						assignedFilter: assignedFilterRef.current,
						channelId: channelIdRef.current,
						typeFromUrl: typeFromUrlRef.current,
						searchQuery: searchQueryRef.current,
					});
					lastFetchParamsRef.current = currentFetchKey;
				}
			});
		},
		[], // Empty dependencies - uses refs for all values
	);

	// Fetch SMS conversation
	const fetchConversation = useCallback(async (phoneNumber: string) => {
		if (!phoneNumber) return;

		setLoadingConversation(true);
		try {
			const result = await getSmsConversationAction(phoneNumber);
			if (result.success && result.messages) {
				setConversationMessages(result.messages);

				// Mark all unread messages as read
				const unreadMessages = result.messages.filter(
					(msg) => !msg.read_at && msg.direction === "inbound",
				);
				if (unreadMessages.length > 0) {
					setConversationMessages((prev) =>
						prev.map((msg) =>
							!msg.read_at && msg.direction === "inbound"
								? { ...msg, read_at: new Date().toISOString() }
								: msg,
						),
					);

					markSmsConversationAsReadAction(phoneNumber)
						.then((result) => {
							if (result.success) {
								window.dispatchEvent(new CustomEvent("sms-read"));
							}
						})
						.catch(() => {});
				}

				// Scroll to bottom
				setTimeout(() => {
					if (conversationScrollRef.current) {
						conversationScrollRef.current.scrollTop =
							conversationScrollRef.current.scrollHeight;
					}
				}, 100);
			}
		} catch (err) {
			toast.error("Failed to load conversation");
		} finally {
			setLoadingConversation(false);
		}
	}, []);

	// Consolidated URL param watching - single effect to prevent duplicate fetches
		const prevParamsRef = useRef<string>("");
	useEffect(() => {
		// Create unique key from all params
		const paramsKey = JSON.stringify({
			folder,
			inboxType,
			category,
			assignedFilter,
			typeFromUrl,
			channelId,
			searchQuery,
		});
		
		// Fetch if params changed
		// Clear lastFetchParamsRef to ensure fresh fetch when navigating
		if (prevParamsRef.current !== paramsKey) {
			prevParamsRef.current = paramsKey;
			// Clear the fetch params cache to force a fresh fetch
			// This ensures we always fetch when params change, even if we've been here before
			lastFetchParamsRef.current = "";
			// Clear communications state to show loading state while fetching
			setCommunications([]);
			fetchCommunications();
		}
	}, [folder, inboxType, category, assignedFilter, typeFromUrl, channelId, searchQuery, fetchCommunications]);

	// Auto-scroll to bottom for Teams channel messages
	useEffect(() => {
		if (channelId && channelMessages.length > 0 && !loadingChannelMessages) {
			setTimeout(() => {
				if (conversationScrollRef.current) {
					conversationScrollRef.current.scrollTop =
						conversationScrollRef.current.scrollHeight;
				}
			}, 100);
		}
	}, [channelId, channelMessages.length, loadingChannelMessages]);

	// Real-time subscription for Teams channel messages - optimized with better filters
	useEffect(() => {
		if (!channelId || !companyId) {
			return;
		}

		const supabase = createClient();
		if (!supabase) {
			return;
		}

		// Create realtime channel for team messages with optimized filters
		const channelName = `teams-channel-${channelId}-${companyId}`;
		const channel = supabase
			.channel(channelName)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "communications",
					// Optimized: Filter by company, channel, and type at database level
					// This reduces the number of events we receive significantly
					// Note: Supabase real-time filters use comma-separated syntax
					filter: `company_id=eq.${companyId}`,
				},
				async (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
					// Check if this message belongs to the current channel
					const newMessage = payload.new as {
						id: string;
						company_id: string;
						type: string;
						tags: string[] | null;
						direction: string;
						body: string;
						body_html: string | null;
						created_at: string;
						read_at: string | null;
						sent_by: string | null;
						provider_metadata: Record<string, unknown> | null;
					};

					// Filter by channel tag (type and channel already filtered at DB level)
					// Only process messages for this specific channel
					if (
						newMessage.tags &&
						Array.isArray(newMessage.tags) &&
						newMessage.tags.includes(channelId)
					) {
						// Fetch the full message with user info
						const { data: fullMessage } = await supabase
							.from("communications")
							.select(`
								id,
								body,
								body_html,
								created_at,
								read_at,
								direction,
								sent_by,
								provider_metadata,
								tags,
								sent_by_user:users!sent_by(id, name, avatar, email)
							`)
							.eq("id", newMessage.id)
							.single();

						if (fullMessage) {
							// Handle sent_by_user - it might be an array or single object
							const userData = Array.isArray(fullMessage.sent_by_user)
								? fullMessage.sent_by_user[0]
								: fullMessage.sent_by_user;

							const channelMessage: ChannelMessage = {
								id: fullMessage.id,
								body: fullMessage.body || "",
								body_html: fullMessage.body_html,
								created_at: fullMessage.created_at,
								read_at: fullMessage.read_at,
								direction: fullMessage.direction as "inbound" | "outbound",
								sent_by: fullMessage.sent_by,
								sent_by_user: userData
									? {
											id: userData.id,
											name: userData.name || null,
											avatar: userData.avatar || null,
											email: userData.email || null,
										}
									: null,
								provider_metadata: (fullMessage.provider_metadata as Record<string, unknown>) || null,
							};

							// Add new message to state
							setChannelMessages((prev) => {
								// Check if message already exists (prevent duplicates)
								if (prev.some((msg) => msg.id === channelMessage.id)) {
									return prev;
								}
								return [...prev, channelMessage];
							});

							// Auto-scroll to bottom
							setTimeout(() => {
								if (conversationScrollRef.current) {
									conversationScrollRef.current.scrollTop =
										conversationScrollRef.current.scrollHeight;
								}
							}, 100);

							// Mark as read if it's an inbound message
							if (channelMessage.direction === "inbound" && !channelMessage.read_at) {
								markTeamChannelAsReadAction(channelId).catch(console.error);
							}
						}
					}
				},
			)
			.subscribe((status: "SUBSCRIBED" | "TIMED_OUT" | "CLOSED" | "CHANNEL_ERROR") => {
				if (status === "SUBSCRIBED") {
					console.log(`✅ Subscribed to Teams channel: ${channelId}`);
				} else if (status === "CHANNEL_ERROR") {
					console.error(`❌ Failed to subscribe to Teams channel: ${channelId}`);
				}
			});

		return () => {
			// Remove subscription and cleanup
			supabase.removeChannel(channel);
		};
	}, [channelId, companyId]);

	// Auto-refresh using consolidated hook
	// useCommunicationRefresh(fetchCommunications, {
	// 	interval: 30000,
	// 	disabled: composeMode,
	// });

	// Store searchParams in ref to avoid re-creating callback
	const searchParamsRef = useRef(searchParams);
	searchParamsRef.current = searchParams;

	// Handle communication selection - optimized for fast switching
	const handleCommunicationSelect = useCallback(
		(communication: Communication) => {
			// Skip if already selected
			if (selectedCommunicationRef.current?.id === communication.id) return;
			
			// Immediate state updates for instant UI response
			setSelectedCommunication(communication);
			setInternalNotes(communication.internalNotes || "");
			selectedCommunicationRef.current = communication;
			setReplyMode(null);
			lastLoadedCommIdRef.current = communication.id;

			// Update URL instantly using native API (no React overhead, preserves Next.js state)
			const params = new URLSearchParams(searchParamsRef.current?.toString() || "");
			params.set("id", communication.id);
			const newUrl = `/dashboard/communication?${params.toString()}`;
			window.history.replaceState(
				{ ...window.history.state, as: newUrl, url: newUrl },
				"",
				newUrl
			);

			// Mark as read in background (non-blocking)
			if (communication.status === "unread" || communication.status === "new") {
				setCommunications((prev) =>
					prev.map((c) =>
						c.id === communication.id ? { ...c, status: "read" } : c,
					),
				);
				// Fire and forget - don't await
				if (communication.type === "email") {
					markEmailAsReadAction({ emailId: communication.id }).catch(() => {});
				} else if (communication.type === "sms") {
					markSmsAsReadAction({ smsId: communication.id }).catch(() => {});
				}
			}

			// Handle content based on type - use cache for instant display
			if (communication.type === "email") {
				// Check cache first
				const cached = emailContentCache.current.get(communication.id);
				if (cached) {
					setEmailContent(cached);
					setConversationMessages([]);
					return;
				}
				
				// Use inline content if available
				if (communication.body || communication.bodyHtml) {
					const content = {
						html: communication.bodyHtml || null,
						text: communication.body || null,
					};
					setEmailContent(content);
					emailContentCache.current.set(communication.id, content);
					setConversationMessages([]);
				} else {
					// Fetch in background
					setEmailContent(null);
					setConversationMessages([]);
					setLoadingContent(true);
					fetchEmailContentAction(communication.id)
						.then((result) => {
							if (result.success && selectedCommunicationRef.current?.id === communication.id) {
								const content = {
									html: result.html || null,
									text: result.text || null,
								};
								setEmailContent(content);
								emailContentCache.current.set(communication.id, content);
							}
						})
						.finally(() => setLoadingContent(false));
				}
			} else if (communication.type === "sms") {
				const phoneNumber = communication.direction === "inbound"
					? communication.fromAddress
					: communication.toAddress;
				
				if (phoneNumber) {
					// Check cache first
					const cached = smsConversationCache.current.get(phoneNumber);
					if (cached) {
						setConversationMessages(cached);
						setEmailContent(null);
						return;
					}
					
					// Fetch conversation
					setEmailContent(null);
					setConversationMessages([]);
					setLoadingConversation(true);
					getSmsConversationAction(phoneNumber)
						.then((result) => {
							if (result.success && result.messages && selectedCommunicationRef.current?.id === communication.id) {
								setConversationMessages(result.messages);
								smsConversationCache.current.set(phoneNumber, result.messages);
								
								// Mark unread as read
								const unread = result.messages.filter(m => !m.read_at && m.direction === "inbound");
								if (unread.length > 0) {
									markSmsConversationAsReadAction(phoneNumber).catch(() => {});
								}
							}
						})
						.finally(() => setLoadingConversation(false));
				}
			} else {
				// Call or voicemail - just clear other states
				setEmailContent(null);
				setConversationMessages([]);
			}
		},
		[], // No dependencies - uses refs for all external values
	);

	// Save internal notes
	const handleSaveNotes = useCallback(async () => {
		if (!selectedCommunication) return;

		setSavingNotes(true);
		try {
			const { saveInternalNotesAction } = await import(
				"@/actions/communications"
			);
			const result = await saveInternalNotesAction({
				communicationId: selectedCommunication.id,
				notes: internalNotes,
			});

			if (result.success) {
				toast.success("Notes saved");
				setCommunications((prev) =>
					prev.map((c) =>
						c.id === selectedCommunication.id
							? {
									...c,
									internalNotes,
									internalNotesUpdatedAt: new Date().toISOString(),
									internalNotesUpdatedBy: teamMemberId,
								}
							: c,
					),
				);
				setNotesOpen(false);
			} else {
				toast.error(result.error || "Failed to save notes");
			}
		} catch (error) {
			console.error("Failed to save notes:", error);
			toast.error("Failed to save notes");
		} finally {
			setSavingNotes(false);
		}
	}, [selectedCommunication, internalNotes, teamMemberId]);

	// Email actions
	const handleArchive = useCallback(
		async (communicationId: string) => {
			// Store the communication for potential revert
			const commToArchive = communications.find((c) => c.id === communicationId);
			if (!commToArchive) return;

			// Optimistic update - immediately remove from list
			setCommunications((prev) => prev.filter((c) => c.id !== communicationId));
			
			// Clear selection if this was the selected communication
			if (selectedCommunication?.id === communicationId) {
				setSelectedCommunication(null);
				setEmailContent(null);
				selectedCommunicationRef.current = null;
			}

			try {
				const result = await archiveEmailAction(communicationId);
				if (result.success) {
					toast.success("Archived");
					window.dispatchEvent(new CustomEvent("email-archived"));
				} else {
					// Revert on failure
					setCommunications((prev) => [...prev, commToArchive].sort((a, b) => 
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					));
					toast.error(result.error || "Failed to archive");
				}
			} catch (err) {
				// Revert on error
				setCommunications((prev) => [...prev, commToArchive].sort((a, b) => 
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				));
				console.error("Failed to archive:", err);
				toast.error("Failed to archive");
			}
		},
		[communications, selectedCommunication],
	);

	const handleStar = useCallback(async (communicationId: string) => {
		// Get current starred state
		const currentlyStarred = starredIds.has(communicationId);
		const newStarredState = !currentlyStarred;
		
		// Optimistic update - immediately update UI
		setStarredIds((prev) => {
			const newSet = new Set(prev);
			if (newStarredState) {
				newSet.add(communicationId);
			} else {
				newSet.delete(communicationId);
			}
			return newSet;
		});
		
		// Update communication tags optimistically
		setCommunications((prev) => 
			prev.map((c) => {
				if (c.id === communicationId) {
					const currentTags = c.tags || [];
					const hasStarredTag = Array.isArray(currentTags) && currentTags.includes("starred");
					const newTags = newStarredState
						? hasStarredTag ? currentTags : [...currentTags, "starred"]
						: currentTags.filter((tag: string) => tag !== "starred");
					return { ...c, tags: newTags.length > 0 ? newTags : null };
				}
				return c;
			})
		);

		try {
			const result = await toggleStarCommunicationAction(communicationId);
			if (result.success) {
				toast.success(newStarredState ? "Starred" : "Unstarred");
			} else {
				// Revert on failure
				setStarredIds((prev) => {
					const newSet = new Set(prev);
					if (currentlyStarred) {
						newSet.add(communicationId);
					} else {
						newSet.delete(communicationId);
					}
					return newSet;
				});
				setCommunications((prev) => 
					prev.map((c) => {
						if (c.id === communicationId) {
							const currentTags = c.tags || [];
							const revertedTags = currentlyStarred
								? Array.isArray(currentTags) && !currentTags.includes("starred")
									? [...currentTags, "starred"]
									: currentTags
								: currentTags.filter((tag: string) => tag !== "starred");
							return { ...c, tags: revertedTags.length > 0 ? revertedTags : null };
						}
						return c;
					})
				);
				toast.error(result.error || "Failed to update");
			}
		} catch (err) {
			// Revert on error
			setStarredIds((prev) => {
				const newSet = new Set(prev);
				if (currentlyStarred) {
					newSet.add(communicationId);
				} else {
					newSet.delete(communicationId);
				}
				return newSet;
			});
			setCommunications((prev) => 
				prev.map((c) => {
					if (c.id === communicationId) {
						const currentTags = c.tags || [];
						const revertedTags = currentlyStarred
							? Array.isArray(currentTags) && !currentTags.includes("starred")
								? [...currentTags, "starred"]
								: currentTags
							: currentTags.filter((tag: string) => tag !== "starred");
						return { ...c, tags: revertedTags.length > 0 ? revertedTags : null };
					}
					return c;
				})
			);
			console.error("Failed to star:", err);
			toast.error("Failed to update");
		}
	}, [starredIds]);

	const handleToggleSpam = useCallback(
		async (communicationId: string) => {
			try {
				const result = await toggleSpamEmailAction(communicationId);
				if (result.success) {
					toast.success("Updated spam status");
					window.dispatchEvent(new CustomEvent("email-spam-toggled"));
					fetchCommunications();
				} else {
					toast.error("Failed to update spam status");
				}
			} catch {
				toast.error("Failed to update spam status");
			}
		},
		[fetchCommunications],
	);

	const handleDelete = useCallback(
		async (communicationId: string) => {
			try {
				const result = await bulkDeleteEmailsAction([communicationId]);
				if (result.success) {
					toast.success("Deleted");
					setCommunications((prev) =>
						prev.filter((c) => c.id !== communicationId),
					);
					if (selectedCommunication?.id === communicationId) {
						setSelectedCommunication(null);
						setEmailContent(null);
					}
				} else {
					toast.error(result.error || "Failed to delete");
				}
			} catch (err) {
				console.error("Failed to delete:", err);
				toast.error("Failed to delete");
			}
		},
		[selectedCommunication],
	);

	const handleRetry = useCallback(
		async (emailId: string) => {
			if (!emailId) return;

			setRetrying(true);
			try {
				const result = await retryFailedEmailAction(emailId);

				if (result.success) {
					toast.success("Email sent successfully!");
					fetchCommunications();
				} else {
					toast.error("Failed to send email", {
						description: result.error || "Please try again later",
					});
				}
			} catch (err) {
				console.error("Failed to retry email:", err);
				toast.error("Failed to send email");
			} finally {
				setRetrying(false);
			}
		},
		[fetchCommunications],
	);

	const handlePrintEmail = useCallback(() => {
		if (!selectedCommunication) return;

		const printContent = `
			<!DOCTYPE html>
			<html>
			<head>
				<title>${selectedCommunication.subject || "Email"}</title>
				<style>
					body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
					.header { border-bottom: 1px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 20px; }
					.subject { font-size: 24px; font-weight: 600; margin-bottom: 12px; }
					.meta { color: #6b7280; font-size: 14px; }
					.meta-row { margin-bottom: 4px; }
					.body { line-height: 1.6; }
				</style>
			</head>
			<body>
				<div class="header">
					<div class="subject">${selectedCommunication.subject || "No Subject"}</div>
					<div class="meta">
						<div class="meta-row"><strong>From:</strong> ${selectedCommunication.fromAddress || "Unknown"}</div>
						<div class="meta-row"><strong>To:</strong> ${selectedCommunication.toAddress || "Unknown"}</div>
						<div class="meta-row"><strong>Date:</strong> ${new Date(selectedCommunication.createdAt).toLocaleString()}</div>
					</div>
				</div>
				<div class="body">
					${emailContent?.html || emailContent?.text || selectedCommunication.body || "No content"}
				</div>
			</body>
			</html>
		`;

		const printWindow = window.open("", "_blank");
		if (printWindow) {
			printWindow.document.write(printContent);
			printWindow.document.close();
			printWindow.focus();
			setTimeout(() => printWindow.print(), 250);
		}
	}, [selectedCommunication, emailContent]);

	const handleDownloadEml = useCallback(() => {
		if (!selectedCommunication) return;

		const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).slice(2)}`;
		const date = new Date(selectedCommunication.createdAt).toUTCString();

		const emlContent = `MIME-Version: 1.0
Date: ${date}
Subject: ${selectedCommunication.subject || "No Subject"}
From: ${selectedCommunication.fromAddress || "Unknown"}
To: ${selectedCommunication.toAddress || "Unknown"}
Content-Type: multipart/alternative; boundary="${boundary}"

--${boundary}
Content-Type: text/plain; charset="UTF-8"
Content-Transfer-Encoding: 7bit

${emailContent?.text || selectedCommunication.body || "No content"}

--${boundary}
Content-Type: text/html; charset="UTF-8"
Content-Transfer-Encoding: 7bit

${emailContent?.html || `<p>${selectedCommunication.body || "No content"}</p>`}

--${boundary}--
`;

		const blob = new Blob([emlContent], { type: "message/rfc822" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		const safeSubject =
			(selectedCommunication.subject || "email")
				.replace(/[^a-z0-9\s-]/gi, "_")
				.replace(/\s+/g, "_")
				.slice(0, 50) || "email";
		link.download = `${safeSubject}.eml`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		toast.success("Email downloaded");
	}, [selectedCommunication, emailContent]);

	// SMS actions
	const handleAttachFiles = useCallback((files: File[]) => {
		setAttachments((prev) => [...prev, ...files]);
	}, []);

	const handleSendMessage = useCallback(async () => {
		if (
			(!messageInput.trim() && attachments.length === 0) ||
			!selectedCommunication ||
			sendingMessage
		)
			return;

		const phoneNumber =
			selectedCommunication.direction === "inbound"
				? selectedCommunication.fromAddress
				: selectedCommunication.toAddress;
		if (!phoneNumber) {
			toast.error("Cannot determine recipient phone number");
			return;
		}

		setSendingMessage(true);
		try {
			if (attachments.length > 0) {
				const { uploadSmsAttachments } = await import("@/actions/sms-actions");
				const uploadResult = await uploadSmsAttachments(attachments);

				if (!uploadResult.success || !uploadResult.urls) {
					toast.error(uploadResult.error || "Failed to upload attachments");
					setSendingMessage(false);
					return;
				}

				const { sendMMSMessage } = await import("@/actions/twilio");
				const result = await sendMMSMessage({
					to: phoneNumber,
					from: "",
					text: messageInput.trim() || undefined,
					mediaUrls: uploadResult.urls,
					customerId: selectedCommunication.customerId || undefined,
				});

				if (result.success) {
					setMessageInput("");
					setAttachments([]);
					toast.success("Message with attachments sent");
					fetchConversation(phoneNumber);
					fetchCommunications();
				} else {
					toast.error((result as { error?: string }).error || "Failed to send message");
				}
			} else {
				const result = await sendTextMessage({
					to: phoneNumber,
					from: "",
					text: messageInput.trim(),
					customerId: selectedCommunication.customerId || undefined,
				});

				if (result.success) {
					setMessageInput("");
					toast.success("Message sent");
					fetchConversation(phoneNumber);
					fetchCommunications();
				} else {
					toast.error((result as { error?: string }).error || "Failed to send message");
				}
			}
		} catch (err) {
			toast.error("Failed to send message", {
				description: err instanceof Error ? err.message : "Unknown error",
			});
		} finally {
			setSendingMessage(false);
		}
	}, [
		messageInput,
		attachments,
		selectedCommunication,
		sendingMessage,
		fetchConversation,
		fetchCommunications,
	]);

	// Handle sending Teams channel messages
	const handleSendSms = useCallback(async (text: string, attachments: any[]) => {
		if (!channelId || sendingMessage) {
			if (!channelId) {
				toast.error("Channel ID not found.");
			}
			return;
		}

		setSendingMessage(true);

		// Optimistic update - add message immediately to UI
		const tempId = `temp-${Date.now()}`;
		const optimisticMessage: ChannelMessage = {
			id: tempId,
			body: text,
			body_html: text,
			created_at: new Date().toISOString(),
			read_at: null,
			direction: "outbound",
			sent_by: currentUserId || teamMemberId,
			sent_by_user: currentUserId ? {
				id: currentUserId,
				name: null, // Will be filled by realtime update
				avatar: null,
				email: null, // Will be filled by realtime update
			} : null,
			provider_metadata: attachments.length > 0
				? {
						attachments: attachments.map((a) => ({
							url: a.url || "",
							type: a.type || "file",
							filename: a.filename || "attachment",
						})),
					}
				: null,
		};

		// Add optimistic message to state
		setChannelMessages((prev) => [...prev, optimisticMessage]);

		// Auto-scroll to bottom immediately
		setTimeout(() => {
			if (conversationScrollRef.current) {
				conversationScrollRef.current.scrollTop =
					conversationScrollRef.current.scrollHeight;
			}
		}, 50);

		try {
			// Send message to server
			const result = await sendTeamChannelMessageAction({
				channel: channelId,
				text,
				attachments: attachments.map((a) => ({
					file: a.file,
					type: a.type === "image" ? "image" : "file",
				})),
			});

			if (result.success) {
				// Remove optimistic message (realtime will add the real one)
				setChannelMessages((prev) => prev.filter((msg) => msg.id !== tempId));
				// Clear message input
				setMessageInput("");
				setAttachments([]);
				// Refresh to get the real message with full user data
				fetchCommunications();
			} else {
				// Remove failed optimistic message
				setChannelMessages((prev) => prev.filter((msg) => msg.id !== tempId));
				toast.error("Failed to send message");
			}
		} catch (error) {
			// Remove failed optimistic message
			setChannelMessages((prev) => prev.filter((msg) => msg.id !== tempId));
			toast.error("Failed to send message");
		} finally {
			setSendingMessage(false);
		}
	}, [channelId, currentUserId, teamMemberId, sendingMessage, fetchCommunications]);


	// Format call duration
	const formatDuration = (seconds: number | null | undefined): string => {
		if (!seconds) return "0:00";
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Format timestamp for SMS messages
	const formatMessageTime = (date: string) => {
		const messageDate = new Date(date);
		const now = new Date();
		const isToday = messageDate.toDateString() === now.toDateString();

		if (isToday) {
			return messageDate.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
			});
		}

		return messageDate.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
		});
	};

	// Helper function to get user display name (Slack-style)
	const getUserDisplayName = useCallback((user: {
		name?: string | null;
		email?: string | null;
	} | null | undefined): string => {
		if (!user) return "Unknown User";
		if (user.name) return user.name;
		if (user.email) return user.email.split("@")[0];
		return "Unknown User";
	}, []);

	// Helper function to check if messages should be grouped (Slack-style)
	const shouldGroupMessages = useCallback((msg1: ChannelMessage, msg2: ChannelMessage): boolean => {
		// Different users - don't group
		if (msg1.sent_by_user?.id !== msg2.sent_by_user?.id) return false;
		
		// Same user - check time gap (group if within 2 minutes)
		const timeDiff = new Date(msg2.created_at).getTime() - new Date(msg1.created_at).getTime();
		return timeDiff < 2 * 60 * 1000; // 2 minutes
	}, []);

	// Filter communications by type - memoized to prevent unnecessary recalculation
	// Note: Search filtering is done server-side, this only handles type filter client-side
	const filteredCommunications = useMemo(() => {
		// If typeFilter is "all", return all communications (server already filtered by folder/search)
		if (typeFilter === "all") {
			return communications;
		}
		
		// Apply type filter client-side
		return communications.filter((comm) => comm.type === typeFilter);
	}, [communications, typeFilter]);

	// Mobile: show list when no communication selected, show detail when communication selected
	const showListOnMobile = !selectedCommunication && !composeMode;
	const showDetailOnMobile = selectedCommunication || composeMode;

	// Use memoized getTypeConfig helper (defined outside component)

	// Render content based on view mode (Teams vs Email/SMS)
	const renderContent = () => {
		if (channelId) {
			// Teams Channel View - Full-width matching SMS design exactly
			return (
				<div className="flex flex-1 h-full w-full flex-col overflow-hidden bg-sidebar">
					<div className="flex flex-1 h-full w-full flex-col overflow-hidden bg-card md:rounded-tl-2xl">
						{/* Header Toolbar - matching SMS view */}
						<div className="sticky top-0 z-15 flex shrink-0 items-center justify-between gap-1.5 p-2 pb-0 transition-colors bg-card">
							<div className="flex flex-1 items-center gap-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										const params = new URLSearchParams(searchParams?.toString() || "");
										params.delete("channel");
										const newUrl = params.toString()
											? `/dashboard/communication?${params.toString()}`
											: "/dashboard/communication";
										router.push(newUrl, { scroll: false });
									}}
									className="h-10 w-10 p-0 md:h-8 md:w-8"
									title="Back to communications"
								>
									<ArrowLeft className="h-5 w-5 md:hidden text-muted-foreground" />
									<X className="h-4 w-4 hidden md:block text-muted-foreground" />
								</Button>
								<Separator
									orientation="vertical"
									className="h-4 bg-border/60 hidden md:block"
								/>
							</div>
						</div>

						{/* Communication Content - matching SMS structure exactly */}
						<div className="flex min-h-0 flex-1 flex-col overflow-hidden w-full">
							<div className="relative overflow-hidden flex-1 h-full min-h-0 flex flex-col w-full">
								<TooltipProvider delayDuration={100}>
									{/* Header section - matching SMS view exactly */}
									<div className="border-b border-border/50 px-2 py-4 space-y-3">
										<h1 className="text-base font-semibold text-foreground">
											#{channelId}
										</h1>

										<div className="flex items-center gap-3">
											<Avatar className="h-9 w-9 shrink-0 rounded-md cursor-pointer">
												<AvatarFallback className="bg-muted text-muted-foreground font-semibold text-sm rounded-md">
													<Hash className="h-4 w-4" />
												</AvatarFallback>
											</Avatar>

											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2">
													<span className="font-semibold text-sm text-foreground capitalize">
														{channelId}
													</span>
												</div>
												<div className="flex items-center gap-2 text-xs text-muted-foreground">
													<span>Team Channel</span>
												</div>
											</div>
										</div>
									</div>

									{/* Conversation area - matching SMS view exactly */}
									<>
										<div
											ref={conversationScrollRef}
											className="flex-1 overflow-y-auto bg-card px-4 py-4"
										>
											{loadingChannelMessages ? (
												<TeamsChannelSkeleton count={5} />
											) : channelMessages.length === 0 ? (
												<CommunicationEmptyState
													variant="empty-team-channel"
													channelName={channelId || undefined}
													className="h-full"
												/>
											) : (
												<div className="space-y-1">
													{channelMessages.map((msg, index) => {
														// Determine if this is the first message in a group
														const isFirstInGroup =
															index === 0 ||
															!shouldGroupMessages(
																channelMessages[index - 1],
																msg,
															);

														// Show timestamp for first message in group or when time gap > 5 minutes
														const showTime =
															isFirstInGroup ||
															(index > 0 &&
																new Date(msg.created_at).getTime() -
																	new Date(
																		channelMessages[index - 1].created_at,
																	).getTime() >
																	5 * 60 * 1000);

														const userDisplayName = getUserDisplayName(
															msg.sent_by_user,
														);
														const userProfileUrl = msg.sent_by_user?.id
															? `/dashboard/team/${msg.sent_by_user.id}`
															: "#";

														// Determine spacing: more space between groups (8-12px), less within groups (4-6px)
														const spacingClass = isFirstInGroup 
															? (index === 0 ? "mt-0" : "mt-3") // 12px between groups
															: "mt-1.5"; // 6px within groups

														return (
															<div key={msg.id} className={spacingClass}>
																{showTime && (
																	<div className="flex justify-center my-3">
																		<span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
																			{formatMessageTime(msg.created_at)}
																		</span>
																	</div>
																)}
																{(() => {
																	const isOutbound = msg.direction === "outbound" || 
																		(currentUserId && msg.sent_by_user?.id === currentUserId);
																	return (
																		<div className={cn(
																			"flex gap-2 px-2 group",
																			isOutbound ? "flex-row-reverse" : "flex-row",
																			isFirstInGroup ? "pt-1 pb-1" : "pt-0.5 pb-1"
																		)}>
																			{/* Avatar - always visible, only show for first message in group */}
																			{isFirstInGroup ? (
																				<Link
																					href={userProfileUrl}
																					className="flex-shrink-0"
																				>
																					<Avatar className="h-9 w-9">
																						{msg.sent_by_user?.avatar ? (
																							<AvatarImage
																								src={msg.sent_by_user.avatar}
																								alt={userDisplayName}
																							/>
																						) : null}
																						<AvatarFallback className="bg-primary/10 text-primary">
																							{userDisplayName
																								.charAt(0)
																								.toUpperCase()}
																						</AvatarFallback>
																					</Avatar>
																				</Link>
																			) : (
																				<div className={cn(
																					"flex-shrink-0",
																					isOutbound ? "w-9" : "w-9"
																				)} />
																			)}

																			{/* Message content */}
																			<div className={cn(
																				"flex flex-col min-w-0",
																				isOutbound ? "items-end" : "items-start"
																			)}>
																				{/* User name - only show for first message in group */}
																				{isFirstInGroup && (
																					<div className="mb-0.5">
																						<Link
																							href={userProfileUrl}
																							className="text-sm font-semibold text-foreground hover:underline"
																						>
																							{userDisplayName}
																						</Link>
																					</div>
																				)}

																				{/* Message bubble - match SMS design with primary color for outbound */}
																				<div
																					className={cn(
																						"max-w-[75%] rounded-2xl px-4 py-2 shadow-sm",
																						isOutbound
																							? "bg-primary text-primary-foreground rounded-tr-sm"
																							: "bg-muted text-foreground rounded-tl-sm",
																					)}
																					style={{ minWidth: '60px', width: 'fit-content', maxWidth: '75%' }}
																				>
																					{/* Show attachments if present */}
																					{msg.provider_metadata &&
																						typeof msg.provider_metadata ===
																							"object" &&
																						"attachments" in
																							msg.provider_metadata &&
																						Array.isArray(
																							msg.provider_metadata.attachments,
																						) &&
																						msg.provider_metadata.attachments
																							.length > 0 && (
																							<div className="mb-2 space-y-2">
																								{(msg.provider_metadata.attachments as MessageAttachment[]).map(
																									(att, attIdx) => {
																										const isImage =
																											att.type === "image" ||
																											(att.url &&
																												/\.(jpg|jpeg|png|gif|webp)$/i.test(
																													att.url,
																												));
																										return (
																											<div
																												key={attIdx}
																												className="rounded-lg overflow-hidden"
																											>
																												{isImage ? (
																													<img
																														src={att.url}
																														alt={
																															att.filename ||
																															"Image"
																														}
																														className="max-w-full max-h-64 object-contain rounded-lg"
																														loading="lazy"
																													/>
																												) : (
																													<a
																														href={att.url}
																														target="_blank"
																														rel="noopener noreferrer"
																														className={cn(
																															"flex items-center gap-2 p-2 rounded-lg hover:opacity-80 transition-opacity",
																															isOutbound
																																? "bg-primary-foreground/20"
																																: "bg-background/20",
																														)}
																													>
																														<Paperclip className="h-4 w-4" />
																														<span className="text-xs truncate">
																															{att.filename ||
																																"Attachment"}
																														</span>
																													</a>
																												)}
																											</div>
																										);
																									},
																								)}
																							</div>
																						)}
																						{msg.body && (
																							<p className="text-sm whitespace-pre-wrap text-left leading-relaxed" style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}>
																								{msg.body}
																							</p>
																						)}
																						{!msg.body &&
																							(!msg.provider_metadata ||
																								typeof msg.provider_metadata !==
																									"object" ||
																								!("attachments" in
																									msg.provider_metadata) ||
																								!Array.isArray(
																									msg.provider_metadata.attachments,
																								) ||
																								msg.provider_metadata.attachments
																									.length === 0) && (
																									<p className="text-sm opacity-70 italic">
																										No message content
																									</p>
																								)}
																					</div>
																					{/* Timestamp below message bubble */}
																					<span
																						className={cn(
																							"text-xs text-muted-foreground mt-0.5",
																							isOutbound
																								? "text-right"
																								: "text-left",
																						)}
																					>
																						{new Date(
																							msg.created_at,
																						).toLocaleTimeString("en-US", {
																							hour: "numeric",
																							minute: "2-digit",
																						})}
																					</span>
																				</div>
																			</div>
																		);
																	})()}
															</div>
														);
													})}
												</div>
											)}
										</div>

										{/* SMS Message Input - matching SMS view exactly */}
										<SmsMessageInput
											value={messageInput}
											onChange={setMessageInput}
											onSend={handleSendSms}
											onAttach={handleAttachFiles}
											sending={sendingMessage}
											disabled={!channelId || isPending || loadingChannelMessages}
											placeholder={`Message #${channelId}`}
											showSegmentCounter={false}
										/>
									</>
								</TooltipProvider>
							</div>
						</div>
					</div>
				</div>
			);
		}

		// Standard Email/SMS View
		return (
			<div className="flex flex-1 h-full w-full flex-col overflow-hidden bg-sidebar">
			<div className="flex flex-row flex-1 w-full overflow-hidden min-h-0 md:gap-2">
				{/* Left Panel - Communications List */}
				<div
					className={cn(
						"flex w-full flex-col bg-card md:w-[350px] lg:w-[400px] md:shrink-0 md:rounded-tr-2xl overflow-hidden",
						selectedCommunication ? "hidden md:flex" : "flex",
					)}
				>
						<div className="sticky top-0 z-15 flex flex-col gap-2 p-2 pb-0 transition-colors bg-card md:rounded-tr-2xl">
							<div className="grid grid-cols-12 gap-2 mt-1">
								<div className="col-span-12 flex gap-2">
									{/* Sidebar toggle */}
									<Button
										variant="ghost"
										size="sm"
										onClick={toggleSidebar}
										className="h-10 w-10 p-0 md:h-8 md:w-8 shrink-0"
										title="Toggle sidebar"
									>
										<PanelLeft className="h-5 w-5 md:h-4 md:w-4 text-muted-foreground" />
									</Button>

									{/* Search input */}
									<div className="relative flex-1">
										<Input
											type="search"
											placeholder="Search communications..."
											value={searchInput}
											onChange={(e) => setSearchInput(e.target.value)}
											className="h-10 md:h-8 pl-9 pr-20 text-base md:text-sm border-input bg-white dark:bg-[#141414] dark:border-none"
										/>
										<svg
											width="10"
											height="10"
											viewBox="0 0 10 10"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											className="absolute left-3 top-1/2 -translate-y-1/2 fill-[#71717A] dark:fill-[#6F6F6F]"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M6.81038 7.0756C6.18079 7.54011 5.40248 7.81466 4.56004 7.81466C2.46451 7.81466 0.765747 6.11589 0.765747 4.02037C0.765747 1.92484 2.46451 0.226074 4.56004 0.226074C6.65557 0.226074 8.35433 1.92484 8.35433 4.02037C8.35433 4.8628 8.07978 5.64112 7.61527 6.27071L9.70535 8.36078C9.92761 8.58305 9.92761 8.94341 9.70535 9.16568C9.48308 9.38794 9.12272 9.38794 8.90046 9.16568L6.81038 7.0756ZM7.21604 4.02037C7.21604 5.48724 6.02691 6.67637 4.56004 6.67637C3.09317 6.67637 1.90403 5.48724 1.90403 4.02037C1.90403 2.5535 3.09317 1.36436 4.56004 1.36436C6.02691 1.36436 7.21604 2.5535 7.21604 4.02037Z"
											/>
										</svg>
										{searchInput && (
											<button
												onClick={clearSearch}
												className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
											>
												<X className="h-3 w-3" />
											</button>
										)}
									</div>

									{/* Refresh button */}
									<Button
										variant="ghost"
										size="sm"
										onClick={() => fetchCommunications(true)}
										disabled={refreshing}
										className="h-10 w-10 p-0 md:h-8 md:w-8"
										title="Refresh"
									>
										<RefreshCw
											className={`h-5 w-5 md:h-4 md:w-4 text-muted-foreground ${refreshing ? "animate-spin" : ""}`}
										/>
									</Button>
								</div>
							</div>
						</div>

						{/* Progress bar */}
						<div
							className={cn(
								"bg-[#006FFE] relative z-5 h-0.5 w-full transition-opacity",
								refreshing ? "opacity-100 animate-pulse" : "opacity-0",
							)}
						/>

						{/* Communications List */}
						<div className="relative z-1 flex-1 overflow-hidden pt-0 min-h-0">
							<div className="hide-link-indicator flex h-full w-full">
								<div className="flex flex-1 flex-col">
									<ScrollArea className="scrollbar-none flex-1 overflow-x-hidden h-full">
										{error &&
										(!communications || communications.length === 0) ? (
											<div className="flex items-center justify-center p-8">
												<div className="text-center">
													<AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
													<p className="text-sm text-destructive mb-2 font-medium">
														Failed to load communications
													</p>
													<p className="text-xs text-muted-foreground mb-4">
														{error}
													</p>
													<Button
														variant="outline"
														size="sm"
														onClick={() => fetchCommunications()}
													>
														Try Again
													</Button>
												</div>
											</div>
										) : filteredCommunications.length ? (
											<div className="min-h-[200px] px-2">
												{filteredCommunications.map((communication) => {
													const isSelected =
														selectedCommunication?.id === communication.id;
													const isUnread =
														communication.status === "unread" ||
														communication.status === "new";
													const typeConfig = getTypeConfig(communication.type);
													const TypeIcon = typeConfig.icon;

													return (
														<div
															key={communication.id}
															className="select-none md:my-1"
														>
															<div
																className={cn(
																	"hover:bg-accent group flex cursor-pointer flex-col items-start rounded-lg py-2 text-left text-sm transition-all hover:opacity-100 relative",
																	isSelected ? "bg-accent opacity-100" : "",
																	isUnread ? "opacity-100" : "opacity-60",
																)}
																onClick={() =>
																	handleCommunicationSelect(communication)
																}
															>
																{/* Hover Action Toolbar */}
																<div
																	className="dark:bg-panelDark absolute right-2 z-25 flex -translate-y-1/2 items-center gap-1 rounded-xl border bg-white p-1 opacity-0 shadow-sm group-hover:opacity-100 top-[-1] transition-opacity duration-200"
																	onClick={(e) => e.stopPropagation()}
																>
																	<Button
																		variant="ghost"
																		size="sm"
																		className="h-6 w-6 overflow-visible p-0 hover:bg-accent group/star"
																		onClick={(e) => {
																			e.stopPropagation();
																			handleStar(communication.id);
																		}}
																		title="Star"
																	>
																		<Star
																			className={cn(
																				"h-4 w-4 transition-colors group-hover/star:text-yellow-500",
																				starredIds.has(communication.id)
																					? "fill-yellow-500 text-yellow-500"
																					: "text-muted-foreground",
																			)}
																		/>
																	</Button>
																	<Button
																		variant="ghost"
																		size="sm"
																		className="h-6 w-6 p-0 hover:bg-accent group/archive"
																		onClick={(e) => {
																			e.stopPropagation();
																			handleArchive(communication.id);
																		}}
																		title="Archive"
																	>
																		<Archive className="h-4 w-4 text-muted-foreground transition-colors group-hover/archive:text-blue-500" />
																	</Button>
																</div>

																{/* Communication Card Content */}
																<div className="relative flex w-full items-center justify-between gap-4 px-2">
																	{/* Avatar with type badge */}
																	<div className="relative">
																		<Avatar className="h-8 w-8 shrink-0 rounded-full border">
																			<AvatarFallback className="bg-white dark:bg-[#373737] text-[#9F9F9D] font-bold text-xs">
																				{getContactDisplayName(communication)[0]?.toUpperCase() || "?"}
																			</AvatarFallback>
																		</Avatar>
																		<div
																			className={cn(
																				"absolute -bottom-1 -right-1 rounded-full p-1 flex items-center justify-center",
																				typeConfig.bg,
																				"shadow-sm ring-1 ring-background/50",
																			)}
																		>
																			<TypeIcon
																				className="h-2.5 w-2.5"
																				style={{ color: 'white' }}
																			/>
																		</div>
																	</div>

																	<div className="flex w-full justify-between">
																		<div className="w-full">
																			<div className="flex w-full flex-row items-center justify-between">
																				<div className="flex flex-row items-center gap-[4px]">
																					<span className="font-bold text-md flex items-baseline gap-1 group-hover:opacity-100">
																						<div className="flex items-center gap-1">
																							<span className="line-clamp-1 overflow-hidden text-sm">
																								{getContactDisplayName(communication)}
																							</span>
																							{isUnread && (
																								<span className="ml-0.5 size-2 rounded-full bg-[#006FFE]"></span>
																							)}
																						</div>
																					</span>
																				</div>
																				<p className="text-muted-foreground text-nowrap text-xs font-normal opacity-70 transition-opacity group-hover:opacity-100 dark:text-[#8C8C8C]">
																					{communication.createdAt
																						? new Date(
																								communication.createdAt,
																							).toLocaleTimeString([], {
																								hour: "2-digit",
																								minute: "2-digit",
																							})
																						: ""}
																				</p>
																			</div>

																			<div className="flex justify-between items-center gap-2">
																				<p className="mt-1 line-clamp-1 min-w-0 overflow-hidden text-sm text-[#8C8C8C] flex-1">
																					{communication.type === "call" ? (
																						<span>
																							{communication.direction === "inbound"
																								? "Incoming Call"
																								: "Outgoing Call"}
																							{communication.callDuration && communication.callDuration > 0 && (
																								<span className="ml-2">
																									• {formatDuration(communication.callDuration)}
																								</span>
																							)}
																						</span>
																					) : communication.type === "voicemail" ? (
																						<span>
																							Voicemail
																							{communication.callDuration && (
																								<span className="ml-2">
																									• {formatDuration(communication.callDuration)}
																								</span>
																							)}
																						</span>
																					) : (
																						communication.subject ||
																						communication.body ||
																						"No content"
																					)}
																				</p>
																				{/* Status badges */}
																				<div className="flex items-center gap-1 shrink-0">
																					{communication.customerId && (
																						<Link
																							href={`/dashboard/customers/${communication.customerId}`}
																							onClick={(e) =>
																								e.stopPropagation()
																							}
																							className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-0.5"
																							title="View customer profile"
																						>
																							<User className="h-2.5 w-2.5" />
																						</Link>
																					)}
																					{communication.jobId && (
																						<span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-600 flex items-center gap-0.5">
																							<Briefcase className="h-2.5 w-2.5" />
																						</span>
																					)}
																					{communication.internalNotes && (
																						<span className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground flex items-center gap-0.5">
																							<StickyNote className="h-2.5 w-2.5" />
																						</span>
																					)}
																					{communication.status ===
																						"failed" && (
																						<span className="px-1.5 py-0.5 rounded text-[10px] bg-destructive/10 text-destructive flex items-center gap-0.5">
																							<AlertTriangle className="h-2.5 w-2.5" />
																						</span>
																					)}
																				</div>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													);
												})}
											</div>
										) : (
											<CommunicationEmptyState
												variant={
													searchQuery
														? "no-search-results"
														: typeFilter !== "all"
															? "empty-type-filter"
															: folder === "inbox"
																? "empty-inbox"
																: folder
																	? "empty-folder"
																	: "no-communications"
												}
												searchQuery={searchQuery}
												folder={folder}
												type={typeFilter !== "all" ? typeFilter : undefined}
												onAction={
													!searchQuery && folder !== "inbox"
														? () => {
																window.dispatchEvent(
																	new CustomEvent("open-unified-compose"),
																);
															}
														: undefined
												}
												className="p-8"
											/>
										)}
									</ScrollArea>
								</div>
							</div>
						</div>
					</div>

				{/* Right Panel - Communication Detail or Compose */}
				{composeMode ? (
					/* Email Composer */
					<div
						className={cn(
							"bg-card mb-1 shadow-sm flex flex-col overflow-hidden",
							"w-full h-full flex-1 min-w-0",
							"md:rounded-tl-2xl",
							showDetailOnMobile ? "flex" : "hidden md:flex",
						)}
					>
						<EmailFullComposer
							companyId={companyId}
							onClose={() => setComposeMode(false)}
							onSent={() => {
								setComposeMode(false);
								fetchCommunications();
							}}
							className="h-full"
						/>
					</div>
				) : selectedCommunication ? (
					<div
						className={cn(
							"bg-card mb-1 shadow-sm flex flex-col overflow-hidden",
							"w-full h-full flex-1 min-w-0",
							"md:rounded-tl-2xl",
							showDetailOnMobile ? "flex" : "hidden md:flex",
						)}
					>
						<div className="relative flex-1 min-h-0 flex flex-col w-full">
							<div className="bg-card relative flex flex-col overflow-hidden transition-all duration-300 h-full flex-1 min-h-0 w-full">
								{/* Communication Header Toolbar */}
								<div className="sticky top-0 z-15 flex shrink-0 items-center justify-between gap-1.5 p-2 pb-0 transition-colors bg-card">
									<div className="flex flex-1 items-center gap-2">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												setSelectedCommunication(null);
												selectedCommunicationRef.current = null;
												setEmailContent(null);
												setConversationMessages([]);
												setReplyMode(null);
												router.push("/dashboard/communication", {
													scroll: false,
												});
											}}
											className="h-10 w-10 p-0 md:h-8 md:w-8"
											title="Back to list"
										>
											<ArrowLeft className="h-5 w-5 md:hidden text-muted-foreground" />
											<X className="h-4 w-4 hidden md:block text-muted-foreground" />
										</Button>
										<Separator
											orientation="vertical"
											className="h-4 bg-border/60 hidden md:block"
										/>
									</div>
									<div className="flex items-center gap-1">
										{/* Reply buttons for email */}
										{selectedCommunication.type === "email" && (
											<>
												<Button
													variant="ghost"
													size="sm"
													className="h-10 w-10 p-0 md:h-8 md:w-auto md:px-2"
													onClick={() => setReplyMode("reply-all")}
													title="Reply all"
												>
													<ReplyAll className="h-5 w-5 md:h-4 md:w-4 md:mr-1.5 text-muted-foreground" />
													<span className="text-sm leading-none font-medium hidden md:inline">
														Reply all
													</span>
												</Button>
											</>
										)}
										{/* Notes */}
										<Sheet open={notesOpen} onOpenChange={setNotesOpen}>
											<SheetTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="h-10 w-10 p-0 md:h-8 md:w-8 hidden md:flex"
													title="Internal notes"
												>
													<StickyNote className="h-4 w-4 text-muted-foreground" />
												</Button>
											</SheetTrigger>
											<SheetContent>
												<SheetHeader>
													<SheetTitle>Internal Notes</SheetTitle>
													<SheetDescription>
														Private team notes - not visible to customer
													</SheetDescription>
												</SheetHeader>
												<div className="py-4">
													<Textarea
														placeholder="Add your notes here..."
														value={internalNotes}
														onChange={(e) => setInternalNotes(e.target.value)}
														className="min-h-[200px] resize-none"
													/>
													{selectedCommunication.internalNotesUpdatedAt && (
														<p className="text-xs text-muted-foreground mt-2">
															Last updated{" "}
															{formatDistanceToNow(
																new Date(
																	selectedCommunication.internalNotesUpdatedAt,
																),
																{
																	addSuffix: true,
																},
															)}
														</p>
													)}
													<div className="mt-4 flex justify-end gap-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() => setNotesOpen(false)}
														>
															Cancel
														</Button>
														<Button
															size="sm"
															onClick={handleSaveNotes}
															disabled={savingNotes}
														>
															{savingNotes ? "Saving..." : "Save Notes"}
														</Button>
													</div>
												</div>
											</SheetContent>
										</Sheet>
										{/* Star */}
										<Button
											variant="ghost"
											size="sm"
											className="h-10 w-10 p-0 md:h-8 md:w-8 group/star"
											title="Star"
											onClick={() => handleStar(selectedCommunication.id)}
										>
											<Star
												className={cn(
													"h-5 w-5 md:h-4 md:w-4 transition-colors group-hover/star:text-yellow-500",
													starredIds.has(selectedCommunication.id)
														? "fill-yellow-500 text-yellow-500"
														: "text-muted-foreground",
												)}
											/>
										</Button>
										{/* Spam toggle for email */}
										{selectedCommunication.type === "email" && (
											<Button
												variant="ghost"
												size="sm"
												className="h-10 w-10 p-0 md:h-8 md:w-8 hidden md:flex group/spam"
												title="Toggle spam"
												onClick={() =>
													handleToggleSpam(selectedCommunication.id)
												}
											>
												<Flag className="h-4 w-4 text-muted-foreground transition-colors group-hover/spam:text-orange-500" />
											</Button>
										)}
										{/* Archive */}
										<Button
											variant="destructive"
											size="sm"
											className="h-10 w-10 p-0 md:h-8 md:w-8"
											title="Archive"
											onClick={() =>
												handleArchive(selectedCommunication.id)
											}
										>
											<Archive className="h-5 w-5 md:h-4 md:w-4" />
										</Button>
										{/* More menu */}
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="h-10 w-10 p-0 md:h-8 md:w-8"
													title="More"
												>
													<MoreHorizontal className="h-5 w-5 md:h-4 md:w-4 text-muted-foreground" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-48">
												{selectedCommunication.type === "email" && (
													<>
														<DropdownMenuItem
															onClick={() =>
																handleToggleSpam(selectedCommunication.id)
															}
															className="md:hidden"
														>
															<Flag className="h-4 w-4 mr-2" />
															Toggle spam
														</DropdownMenuItem>
														<DropdownMenuItem onClick={handlePrintEmail}>
															<Printer className="h-4 w-4 mr-2" />
															Print
														</DropdownMenuItem>
														<DropdownMenuItem onClick={handleDownloadEml}>
															<Download className="h-4 w-4 mr-2" />
															Download as .eml
														</DropdownMenuItem>
														<DropdownMenuSeparator />
													</>
												)}
												<DropdownMenuItem
													onClick={() => setNotesOpen(true)}
													className="md:hidden"
												>
													<StickyNote className="h-4 w-4 mr-2" />
													Notes
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => setTransferDialogOpen(true)}
												>
													<UserPlus className="h-4 w-4 mr-2" />
													Assign to Team Member
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => handleDelete(selectedCommunication.id)}
													className="text-destructive focus:text-destructive"
												>
													<Trash2 className="h-4 w-4 mr-2" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>

								{/* Communication Content */}
								<div className="flex min-h-0 flex-1 flex-col overflow-hidden w-full">
									<div className="relative overflow-hidden flex-1 h-full min-h-0 flex flex-col w-full">
										<TooltipProvider delayDuration={100}>
											{/* Header section with subject and sender info */}
											<div className="border-b border-border/50 px-2 py-4 space-y-3">
												<h1 className="text-base font-semibold text-foreground">
													{selectedCommunication.subject ||
														(selectedCommunication.type === "sms"
															? "Text Message"
															: "No Subject")}
												</h1>

												<div className="flex items-center gap-3">
													<Avatar className="h-9 w-9 shrink-0 rounded-md cursor-pointer">
														<AvatarFallback className="bg-muted text-muted-foreground font-semibold text-sm rounded-md">
															{getContactDisplayName(selectedCommunication)[0]?.toUpperCase() || "?"}
														</AvatarFallback>
													</Avatar>

													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2">
															<span className="font-semibold text-sm text-foreground">
																{getContactDisplayName(selectedCommunication)}
															</span>
															{(selectedCommunication.status === "unread" ||
																selectedCommunication.status === "new") && (
																<div className="h-2 w-2 rounded-full bg-primary" />
															)}
														</div>
														<div className="flex items-center gap-2 text-xs text-muted-foreground">
															<span>
																{selectedCommunication.direction === "inbound"
																	? selectedCommunication.fromAddress || "unknown"
																	: selectedCommunication.toAddress || "unknown"}
															</span>
															{selectedCommunication.customerId && (
																<Badge variant="outline" className="gap-1">
																	<User className="h-2.5 w-2.5" />
																	Customer
																</Badge>
															)}
															{selectedCommunication.assignedTo && (
																<Badge
																	variant="outline"
																	className="gap-1 cursor-pointer hover:bg-accent"
																	onClick={() => setTransferDialogOpen(true)}
																>
																	<UserPlus className="h-2.5 w-2.5" />
																	{selectedCommunication.assignedTeamMember
																		? `${selectedCommunication.assignedTeamMember.firstName} ${selectedCommunication.assignedTeamMember.lastName}`.trim()
																		: "Assigned"}
																</Badge>
															)}
														</div>
													</div>

													<div className="flex items-center gap-2">
														<span className="text-xs text-muted-foreground whitespace-nowrap">
															{new Date(
																selectedCommunication.createdAt,
															).toLocaleTimeString("en-US", {
																hour: "numeric",
																minute: "2-digit",
															})}
														</span>
													</div>
												</div>

												{/* Email status for outbound emails */}
												{selectedCommunication.type === "email" &&
													selectedCommunication.direction === "outbound" && (
														<div className="flex flex-col gap-2 pt-2">
															<div className="flex items-center gap-1 flex-wrap">
																<div
																	className={cn(
																		"flex items-center gap-1.5 px-2 py-1 rounded-full text-xs",
																		selectedCommunication.status === "sent" || selectedCommunication.status === "delivered"
																			? "bg-green-500/10 text-green-600"
																			: selectedCommunication.status === "failed"
																				? "bg-red-500/10 text-red-600"
																				: "bg-muted text-muted-foreground",
																	)}
																>
																	{selectedCommunication.status === "sent" || selectedCommunication.status === "delivered" ? (
																		<CheckCheck className="h-3 w-3" />
																	) : selectedCommunication.status === "failed" ? (
																		<AlertCircle className="h-3 w-3" />
																	) : (
																		<Clock className="h-3 w-3" />
																	)}
																	<span className="capitalize">{selectedCommunication.status}</span>
																</div>
															</div>
														</div>
													)}
											</div>

											{/* Auto-Link Suggestions */}
											<div className="px-2 py-2">
												<AutoLinkSuggestions
													communication={selectedCommunication}
													companyId={companyId}
													onLinked={() => {
														fetchCommunications();
													}}
												/>
											</div>

											{/* Content area - different for email vs SMS */}
											{selectedCommunication.type === "email" ? (
												/* Email Content */
												<div className="flex-1 overflow-hidden flex flex-col min-h-0 w-full">
													<div className="flex-1 overflow-y-auto px-2 py-4 w-full">
														{loadingContent ? (
															<CommunicationDetailSkeleton />
														) : (
															<EmailContent
																html={emailContent?.html || null}
																text={
																	emailContent?.text ||
																	selectedCommunication.body ||
																	null
																}
																attachments={null}
															/>
														)}
													</div>

													{/* Reply Composer or Action Bar */}
													<div className="px-2 py-4 pb-safe">
														{replyMode ? (
															<EmailReplyComposer
																mode={replyMode}
																selectedEmail={{
																	id: selectedCommunication.id,
																	from_address: selectedCommunication.fromAddress || "",
																	from_name: null,
																	to_address: selectedCommunication.toAddress || "",
																	subject: selectedCommunication.subject || "",
																	body: emailContent?.text || selectedCommunication.body || "",
																	body_html: emailContent?.html || null,
																} as any}
																companyId={companyId}
																onClose={() => setReplyMode(null)}
																onSent={() => {
																	setReplyMode(null);
																	fetchCommunications();
																}}
															/>
														) : selectedCommunication.status === "failed" ? (
															<div className="flex items-center gap-2 flex-wrap">
																<Button
																	variant="default"
																	size="sm"
																	className="h-11 px-4 flex-1 md:flex-none md:h-9"
																	onClick={() =>
																		handleRetry(selectedCommunication.id)
																	}
																	disabled={retrying}
																>
																	{retrying ? (
																		<>
																			<Loader2 className="h-5 w-5 md:h-4 md:w-4 mr-2 animate-spin" />
																			Sending...
																		</>
																	) : (
																		<>
																			<RefreshCw className="h-5 w-5 md:h-4 md:w-4 mr-2" />
																			Retry Send
																		</>
																	)}
																</Button>
															</div>
														) : (
															<div className="flex items-center gap-2 flex-wrap">
																<Button
																	variant="default"
																	size="sm"
																	className="h-11 px-4 flex-1 md:flex-none md:h-9"
																	onClick={() => setReplyMode("reply")}
																>
																	<Reply className="h-5 w-5 md:h-4 md:w-4 mr-2" />
																	Reply
																</Button>
																<Button
																	variant="outline"
																	size="sm"
																	className="h-11 px-3 flex-1 md:flex-none md:h-9 md:px-4"
																	onClick={() => setReplyMode("reply-all")}
																>
																	<ReplyAll className="h-5 w-5 md:h-4 md:w-4 mr-2" />
																	<span className="hidden xs:inline">
																		Reply All
																	</span>
																	<span className="xs:hidden">All</span>
																</Button>
																<Button
																	variant="outline"
																	size="sm"
																	className="h-11 px-3 flex-1 md:flex-none md:h-9 md:px-4"
																	onClick={() => setReplyMode("forward")}
																>
																	<Forward className="h-5 w-5 md:h-4 md:w-4 mr-2" />
																	Forward
																</Button>
															</div>
														)}
													</div>
												</div>
											) : selectedCommunication.type === "sms" ? (
												/* SMS Conversation View */
												<>
													<div
														ref={conversationScrollRef}
														className="flex-1 overflow-y-auto bg-card px-4 py-4"
													>
														{loadingConversation ? (
															<SmsConversationSkeleton count={3} />
														) : conversationMessages.length === 0 ? (
															<CommunicationEmptyState
																variant="empty-sms-conversation"
																className="h-full"
															/>
														) : (
															<div className="space-y-2">
																{conversationMessages.map((msg, index) => {
																	const isOutbound =
																		msg.direction === "outbound";
																	const showTime =
																		index === 0 ||
																		new Date(msg.created_at).getTime() -
																			new Date(
																				conversationMessages[index - 1]
																					.created_at,
																			).getTime() >
																			5 * 60 * 1000;

																	return (
																		<div key={msg.id} className="flex flex-col">
																			{showTime && (
																				<div className="flex justify-center my-2">
																					<span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
																						{formatMessageTime(msg.created_at)}
																					</span>
																				</div>
																			)}
																			<div
																				className={cn(
																					"flex flex-col",
																					isOutbound
																						? "items-end"
																						: "items-start",
																				)}
																			>
																				<div
																					className={cn(
																						"max-w-[75%] rounded-2xl px-4 py-2 shadow-sm",
																						isOutbound
																							? "bg-primary text-primary-foreground rounded-tr-sm"
																							: "bg-muted text-foreground rounded-tl-sm",
																					)}
																				>
																					{/* Show attachments if present */}
																					{msg.provider_metadata &&
																						typeof msg.provider_metadata ===
																							"object" &&
																						"attachments" in
																							msg.provider_metadata &&
																						Array.isArray(
																							msg.provider_metadata.attachments,
																						) &&
																						msg.provider_metadata.attachments
																							.length > 0 && (
																							<div className="mb-2 space-y-2">
																								{(msg.provider_metadata.attachments as MessageAttachment[]).map(
																									(att, attIdx) => {
																										const isImage =
																											att.type === "image" ||
																											(att.url &&
																												/\.(jpg|jpeg|png|gif|webp)$/i.test(
																													att.url,
																												));
																										return (
																											<div
																												key={attIdx}
																												className="rounded-lg overflow-hidden"
																											>
																												{isImage ? (
																													<img
																														src={att.url}
																														alt={
																															att.filename ||
																															"Image"
																														}
																														className="max-w-full max-h-64 object-contain rounded-lg"
																														loading="lazy"
																													/>
																												) : (
																													<a
																														href={att.url}
																														target="_blank"
																														rel="noopener noreferrer"
																														className={cn(
																															"flex items-center gap-2 p-2 rounded-lg hover:opacity-80 transition-opacity",
																															isOutbound
																																? "bg-primary-foreground/20"
																																: "bg-background/20",
																														)}
																													>
																														<Paperclip className="h-4 w-4" />
																														<span className="text-xs truncate">
																															{att.filename ||
																																"Attachment"}
																														</span>
																													</a>
																												)}
																											</div>
																										);
																									},
																								)}
																							</div>
																						)}
																					{msg.body && (
																						<p className="text-sm whitespace-pre-wrap break-words">
																							{msg.body}
																						</p>
																					)}
																					{!msg.body &&
																						(!msg.provider_metadata ||
																							typeof msg.provider_metadata !==
																								"object" ||
																							!("attachments" in
																								msg.provider_metadata) ||
																							!Array.isArray(
																								msg.provider_metadata.attachments,
																							) ||
																							msg.provider_metadata.attachments
																								.length === 0) && (
																							<p className="text-sm opacity-70 italic">
																								No message content
																							</p>
																						)}
																				</div>
																				<span
																					className={cn(
																						"text-xs text-muted-foreground mt-0.5",
																						isOutbound
																							? "text-right"
																							: "text-left",
																					)}
																				>
																					{new Date(
																						msg.created_at,
																					).toLocaleTimeString([], {
																						hour: "2-digit",
																						minute: "2-digit",
																					})}
																				</span>
																			</div>
																		</div>
																	);
																})}
															</div>
														)}
													</div>

													{/* SMS Message Input */}
													<SmsMessageInput
														value={messageInput}
														onChange={setMessageInput}
														onSend={handleSendMessage}
														onAttach={handleAttachFiles}
														sending={sendingMessage}
														disabled={!selectedCommunication}
														placeholder="Text Message"
														customerId={
															selectedCommunication?.customerId || undefined
														}
														customerName={undefined}
														customerFirstName={undefined}
														companyName={companyContext?.companyName}
														companyPhone={companyContext?.companyPhone}
														enableAiSuggestions={Boolean(
															selectedCommunication?.customerId,
														)}
													/>
												</>
											) : selectedCommunication.type === "call" ? (
												/* Call Detail View */
												<CallDetailView
													communication={selectedCommunication}
													onSendText={(phone) => {
														// Navigate to SMS view for this phone
														const existingSmsComm = communications.find(
															(c) =>
																c.type === "sms" &&
																(c.fromAddress === phone || c.toAddress === phone)
														);
														if (existingSmsComm) {
															handleCommunicationSelect(existingSmsComm);
														} else {
															toast.info(`Start new conversation with ${phone}`);
														}
													}}
													onCallBack={(phone) => {
														// For now, show phone number - real implementation would use Twilio to initiate call
														window.open(`tel:${phone}`, "_self");
													}}
													onTransfer={() => {
														setTransferDialogOpen(true);
													}}
												/>
											) : selectedCommunication.type === "voicemail" ? (
												/* Voicemail Detail View */
												<VoicemailDetailView
													communication={selectedCommunication}
													isRead={selectedCommunication.status === "read"}
													onMarkAsRead={(id, read) => {
														// Mark voicemail as read/unread
														setCommunications((prev) =>
															prev.map((c) =>
																c.id === id
																	? { ...c, status: read ? "read" : "unread" }
																	: c,
															),
														);
													}}
													onSendText={(phone) => {
														// Navigate to SMS view for this phone
														const existingSmsComm = communications.find(
															(c) =>
																c.type === "sms" &&
																(c.fromAddress === phone || c.toAddress === phone)
														);
														if (existingSmsComm) {
															handleCommunicationSelect(existingSmsComm);
														} else {
															toast.info(`Start new conversation with ${phone}`);
														}
													}}
													onCallBack={(phone) => {
														window.open(`tel:${phone}`, "_self");
													}}
													onTransfer={() => {
														setTransferDialogOpen(true);
													}}
												/>
											) : (
												/* Fallback for other types */
												<ScrollArea className="flex-1 px-2 py-4">
													<div className="prose prose-sm max-w-none">
														<p className="whitespace-pre-wrap">
															{selectedCommunication.body || "No content"}
														</p>
													</div>
												</ScrollArea>
											)}
										</TooltipProvider>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					/* Empty State */
					<div
						className={cn(
							"bg-card mb-1 shadow-sm hidden md:flex md:flex-col md:items-center md:justify-center md:rounded-tl-2xl flex-1 min-w-0",
						)}
					>
						<CommunicationEmptyState
							variant="no-communications"
							onAction={() => {
								window.dispatchEvent(new CustomEvent("open-unified-compose"));
							}}
							actionLabel="New Message"
						/>
					</div>
				)}
			</div>
		</div>
		);
	};

	return (
		<div className="flex flex-1 h-full w-full flex-col">
			{renderContent()}
			{/* Transfer Dialog - Available for all communication types */}
			{selectedCommunication && (
				<TransferDialog
					open={transferDialogOpen}
					onOpenChange={setTransferDialogOpen}
					communication={selectedCommunication}
					companyId={companyId}
					currentTeamMemberId={teamMemberId}
					onTransferComplete={() => {
						fetchCommunications();
					}}
				/>
			)}
		</div>
	);
}
