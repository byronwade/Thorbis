/**
 * Unified Inbox Page Client Component
 *
 * Complete unified communication hub combining email and SMS features
 * Features: full email composer, reply/forward, SMS conversation threads,
 * message sending, attachments, templates, AI suggestions
 */

"use client";

import { format, formatDistanceToNow } from "date-fns";
import {
	AlertCircle,
	AlertTriangle,
	Archive,
	ArrowLeft,
	Briefcase,
	CheckCheck,
	ChevronRight,
	Clock,
	Download,
	Eye,
	Filter,
	Flag,
	Forward,
	Link as LinkIcon,
	Loader2,
	Mail,
	MapPin,
	MessageSquare,
	MoreHorizontal,
	MousePointerClick,
	PanelLeft,
	Paperclip,
	Phone,
	Plus,
	Printer,
	RefreshCw,
	Reply,
	ReplyAll,
	Send,
	Star,
	StickyNote,
	Trash2,
	User,
	UserPlus,
	Voicemail,
	X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { useCommunicationRefresh } from "@/hooks/use-communication-refresh";
import {
	archiveEmailAction,
	bulkDeleteEmailsAction,
	fetchEmailContentAction,
	markEmailAsReadAction,
	retryFailedEmailAction,
	toggleSpamEmailAction,
} from "@/actions/email-actions";
import { toggleStarCommunicationAction } from "@/actions/communications";
import type {
	CompanySms,
	SmsTemplateContext,
} from "@/actions/sms-actions";

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
import { sendTextMessage } from "@/actions/twilio";
import { AutoLinkSuggestions } from "@/components/communication/auto-link-suggestions";
import { CallDetailView } from "@/components/communication/call-detail-view";
import { CustomerInfoPill } from "@/components/communication/customer-info-pill";
import { EmailContent } from "@/components/communication/email-content";
import { EmailFullComposer } from "@/components/communication/email-full-composer";
import {
	EmailReplyComposer,
	type EmailReplyMode,
} from "@/components/communication/email-reply-composer";
import { SmsMessageInput } from "@/components/communication/sms-message-input";
import { TransferDialog } from "@/components/communication/transfer-dialog";
import { VoicemailDetailView } from "@/components/communication/voicemail-detail-view";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Communication, CommunicationCounts } from "@/lib/queries/communications";
import { cn } from "@/lib/utils";
import { getCustomerDisplayName } from "@/lib/utils/customer-display";

type CommunicationType = "all" | "email" | "sms" | "call" | "voicemail";

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

	// Priority 3: Address as fallback
	const address = effectiveDirection === "from"
		? communication.fromAddress
		: communication.toAddress;

	return address || (effectiveDirection === "from" ? "Unknown sender" : "Unknown recipient");
}

interface UnifiedInboxPageClientProps {
	initialCommunications: Communication[];
	initialCounts?: CommunicationCounts;
	companyId: string;
	teamMemberId: string;
	selectedId?: string | null;
	activeType?: string | null;
	activeFolder?: string | null;
	activeCategory?: string | null;
}

export function UnifiedInboxPageClient({
	initialCommunications,
	initialCounts,
	companyId,
	teamMemberId,
	selectedId: initialSelectedId,
	activeType: initialActiveType,
	activeFolder: initialActiveFolder,
	activeCategory: initialActiveCategory,
}: UnifiedInboxPageClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toggleSidebar } = useSidebar();
	const [isPending, startTransition] = useTransition();

	const communicationIdFromQuery = searchParams?.get("id");
	const communicationId = communicationIdFromQuery || initialSelectedId;

	// Core communication state
	const [communications, setCommunications] = useState<Communication[]>(
		initialCommunications,
	);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedCommunication, setSelectedCommunication] =
		useState<Communication | null>(() => {
			if (initialSelectedId && initialCommunications) {
				return (
					initialCommunications.find((c) => c.id === initialSelectedId) || null
				);
			}
			return null;
		});

	// Search and filter state - using debounced search hook
	const { searchInput, searchQuery, setSearchInput, clearSearch } = useDebouncedSearch();
	const [typeFilter, setTypeFilter] = useState<CommunicationType>(
		(initialActiveType as CommunicationType) || "all",
	);

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
	const [messageInput, setMessageInput] = useState("");
	const [sendingMessage, setSendingMessage] = useState(false);
	const [attachments, setAttachments] = useState<File[]>([]);
	const [companyContext, setCompanyContext] = useState<SmsTemplateContext | null>(null);
	const [starredIds, setStarredIds] = useState<Set<string>>(new Set());

	// Transfer dialog state
	const [transferDialogOpen, setTransferDialogOpen] = useState(false);

	// Refs
	const selectedCommunicationRef = useRef<Communication | null>(selectedCommunication);
	const refreshingRef = useRef(refreshing);
	refreshingRef.current = refreshing;
	const conversationScrollRef = useRef<HTMLDivElement>(null);

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

	// Update selected communication when URL changes
	useEffect(() => {
		if (communicationId && communications) {
			const comm = communications.find((c) => c.id === communicationId);
			if (comm) {
				setSelectedCommunication(comm);
				setInternalNotes(comm.internalNotes || "");
				selectedCommunicationRef.current = comm;

				// Load email content if needed
				if (comm.type === "email") {
					const hasContent = comm.body;
					if (hasContent) {
						setEmailContent({
							html: null,
							text: comm.body || null,
						});
					} else {
						setLoadingContent(true);
						fetchEmailContentAction(comm.id)
							.then((result) => {
								if (result.success) {
									setEmailContent({
										html: result.html || null,
										text: result.text || null,
									});
								}
							})
							.finally(() => setLoadingContent(false));
					}
				}

				// Load SMS conversation if needed
				if (comm.type === "sms") {
					const phoneNumber = comm.direction === "inbound"
						? comm.fromAddress
						: comm.toAddress;
					if (phoneNumber) {
						fetchConversation(phoneNumber);
					}
				}
			}
		} else {
			setSelectedCommunication(null);
			selectedCommunicationRef.current = null;
			setEmailContent(null);
			setConversationMessages([]);
		}
	}, [communicationId, communications]);

	// Fetch communications function
	const fetchCommunications = useCallback(
		async (showRefreshing = false) => {
			setRefreshing(true);
			setError(null);

			startTransition(async () => {
				try {
					const { getCommunicationsAction } = await import(
						"@/actions/communications"
					);
					const result = await getCommunicationsAction({
						teamMemberId,
						companyId,
						type: typeFilter !== "all" ? typeFilter : undefined,
						limit: 100,
						offset: 0,
					});

					if (result.success && result.data) {
						setCommunications(result.data as Communication[]);

						// Update selected communication if it's still in the list
						const currentSelected = selectedCommunicationRef.current;
						if (currentSelected) {
							const updatedComm = (result.data as Communication[]).find(
								(c) => c.id === currentSelected.id,
							);
							if (updatedComm) {
								setSelectedCommunication(updatedComm);
								selectedCommunicationRef.current = updatedComm;
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
				}
			});
		},
		[teamMemberId, companyId, typeFilter],
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

	// Sync type filter with prop from URL params (sidebar navigation)
	useEffect(() => {
		const newType = (initialActiveType as CommunicationType) || "all";
		if (newType !== typeFilter) {
			setTypeFilter(newType);
		}
	}, [initialActiveType]);

	// Refetch when type filter changes
	useEffect(() => {
		fetchCommunications();
	}, [typeFilter]);

	// Refetch when search changes
	useEffect(() => {
		if (searchQuery) {
			fetchCommunications();
		}
	}, [searchQuery]);

	// Auto-refresh using consolidated hook
	useCommunicationRefresh(fetchCommunications, {
		interval: 30000,
		disabled: composeMode || refreshingRef.current,
	});

	// Handle communication selection
	const handleCommunicationSelect = useCallback(
		(communication: Communication) => {
			setSelectedCommunication(communication);
			setInternalNotes(communication.internalNotes || "");
			selectedCommunicationRef.current = communication;
			setReplyMode(null);
			setConversationMessages([]);

			const params = new URLSearchParams(searchParams?.toString() || "");
			params.set("id", communication.id);
			router.push(`/dashboard/communication?${params.toString()}`, {
				scroll: false,
			});

			// Mark as read if unread
			if (communication.status === "unread" || communication.status === "new") {
				if (communication.type === "email") {
					markEmailAsReadAction({ emailId: communication.id }).catch((err) => {
						console.error("Failed to mark as read:", err);
					});
				} else if (communication.type === "sms") {
					markSmsAsReadAction({ smsId: communication.id }).catch((err) => {
						console.error("Failed to mark as read:", err);
					});
				}
				// Optimistically update local state
				setCommunications((prev) =>
					prev.map((c) =>
						c.id === communication.id ? { ...c, status: "read" } : c,
					),
				);
				window.dispatchEvent(new CustomEvent("communication-updated"));
			}

			// Load email content
			if (communication.type === "email") {
				const hasContent = communication.body;
				if (hasContent) {
					setEmailContent({
						html: null,
						text: communication.body || null,
					});
				} else {
					setLoadingContent(true);
					fetchEmailContentAction(communication.id)
						.then((result) => {
							if (result.success) {
								setEmailContent({
									html: result.html || null,
									text: result.text || null,
								});
							}
						})
						.finally(() => setLoadingContent(false));
				}
			}

			// Load SMS conversation
			if (communication.type === "sms") {
				const phoneNumber = communication.direction === "inbound"
					? communication.fromAddress
					: communication.toAddress;
				if (phoneNumber) {
					fetchConversation(phoneNumber);
				}
			}
		},
		[router, searchParams, fetchConversation],
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
			try {
				const result = await archiveEmailAction(communicationId);
				if (result.success) {
					toast.success("Archived");
					setCommunications((prev) =>
						prev.filter((c) => c.id !== communicationId),
					);
					if (selectedCommunication?.id === communicationId) {
						setSelectedCommunication(null);
						setEmailContent(null);
					}
					window.dispatchEvent(new CustomEvent("email-archived"));
				} else {
					toast.error(result.error || "Failed to archive");
				}
			} catch (err) {
				console.error("Failed to archive:", err);
				toast.error("Failed to archive");
			}
		},
		[selectedCommunication],
	);

	const handleStar = useCallback(async (communicationId: string) => {
		try {
			const result = await toggleStarCommunicationAction(communicationId);
			if (result.success) {
				toast.success("Updated");
				setStarredIds((prev) => {
					const newSet = new Set(prev);
					if (result.isStarred) {
						newSet.add(communicationId);
					} else {
						newSet.delete(communicationId);
					}
					return newSet;
				});
			} else {
				toast.error(result.error || "Failed to update");
			}
		} catch (err) {
			console.error("Failed to star:", err);
			toast.error("Failed to update");
		}
	}, []);

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

	// Filter communications by type and search
	const filteredCommunications = communications.filter((comm) => {
		// Apply type filter first
		if (typeFilter !== "all" && comm.type !== typeFilter) {
			return false;
		}

		// Then apply search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			const matchesSubject = comm.subject?.toLowerCase().includes(query);
			const matchesBody = comm.body?.toLowerCase().includes(query);
			const matchesFrom = comm.fromAddress?.toLowerCase().includes(query);
			const matchesTo = comm.toAddress?.toLowerCase().includes(query);
			const matchesCustomer = comm.customer?.firstName?.toLowerCase().includes(query) ||
				comm.customer?.lastName?.toLowerCase().includes(query);
			return matchesSubject || matchesBody || matchesFrom || matchesTo || matchesCustomer;
		}
		return true;
	});

	// Mobile: show list when no communication selected, show detail when communication selected
	const showListOnMobile = !selectedCommunication && !composeMode;
	const showDetailOnMobile = selectedCommunication || composeMode;

	// Get type icon and colors
	const getTypeConfig = (type: string) => {
		switch (type) {
			case "email":
				return { icon: Mail, color: "text-blue-500", bg: "bg-blue-500/10" };
			case "sms":
				return {
					icon: MessageSquare,
					color: "text-green-500",
					bg: "bg-green-500/10",
				};
			case "call":
				return {
					icon: Phone,
					color: "text-purple-500",
					bg: "bg-purple-500/10",
				};
			case "voicemail":
				return {
					icon: Voicemail,
					color: "text-orange-500",
					bg: "bg-orange-500/10",
				};
			default:
				return { icon: Mail, color: "text-gray-500", bg: "bg-gray-500/10" };
		}
	};

	return (
		<div className="flex h-full w-full flex-col overflow-hidden bg-sidebar">
			<div className="flex flex-1 overflow-hidden min-h-0 md:gap-2">
				{/* Left Panel - Communications List */}
				<div
					className={cn(
						"bg-card mb-1 shadow-sm flex flex-col overflow-hidden",
						"w-full h-full",
						"md:w-[400px] lg:w-[480px] md:rounded-tr-2xl",
						showListOnMobile ? "flex" : "hidden md:flex",
					)}
				>
					<div className="w-full h-full flex flex-col">
						{/* Header with search and filters */}
						<div className="sticky top-0 z-15 flex flex-col gap-2 p-2 pb-0 transition-colors bg-card">
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
																				"absolute -bottom-1 -right-1 rounded-full p-0.5 border border-white dark:border-[#1C1C1C]",
																				typeConfig.bg,
																			)}
																		>
																			<TypeIcon
																				className={cn(
																					"h-2.5 w-2.5",
																					typeConfig.color,
																				)}
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
																					{communication.subject ||
																						communication.body ||
																						"No content"}
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
											<div className="flex items-center justify-center p-8">
												<div className="text-center">
													<p className="text-sm text-muted-foreground">
														No communications found
													</p>
													{searchQuery && (
														<p className="text-xs text-muted-foreground mt-1">
															Try adjusting your search
														</p>
													)}
												</div>
											</div>
										)}
									</ScrollArea>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right Panel - Communication Detail or Compose */}
				{composeMode ? (
					/* Email Composer */
					<div
						className={cn(
							"bg-card mb-1 shadow-sm flex flex-col min-w-0 overflow-hidden",
							"w-full h-full",
							"md:rounded-tl-2xl md:flex-1",
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
							"bg-card mb-1 shadow-sm flex flex-col min-w-0 overflow-hidden",
							"w-full h-full",
							"md:rounded-tl-2xl md:flex-1",
							showDetailOnMobile ? "flex" : "hidden md:flex",
						)}
					>
						<div className="relative flex-1 min-h-0 flex flex-col">
							<div className="bg-card relative flex flex-col overflow-hidden transition-all duration-300 h-full flex-1 min-h-0">
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
								<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
									<div className="relative overflow-hidden flex-1 h-full min-h-0 flex flex-col">
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
												<div className="flex-1 overflow-hidden flex flex-col min-h-0">
													<div className="flex-1 overflow-y-auto px-2 py-4">
														{loadingContent ? (
															<div className="flex items-center justify-center py-12">
																<div className="text-center">
																	<Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
																	<p className="text-sm text-muted-foreground">
																		Loading email content...
																	</p>
																</div>
															</div>
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
															<div className="flex items-center justify-center h-full">
																<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
															</div>
														) : conversationMessages.length === 0 ? (
															<div className="flex items-center justify-center h-full">
																<div className="text-center">
																	<MessageSquare className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-2" />
																	<p className="text-sm text-muted-foreground">
																		No messages yet
																	</p>
																</div>
															</div>
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
							"bg-card mb-1 shadow-sm hidden md:flex md:flex-col md:items-center md:justify-center md:rounded-tl-2xl md:flex-1",
						)}
					>
						<Mail className="h-16 w-16 text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold">No communication selected</h3>
						<p className="text-sm text-muted-foreground mb-4">
							Select a communication from the list to view details
						</p>
						<Button
							onClick={() => {
								window.dispatchEvent(new CustomEvent("open-unified-compose"));
							}}
							className="h-11 px-5"
						>
							<Plus className="h-4 w-4 mr-2" />
							New Message
						</Button>
					</div>
				)}
			</div>

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
