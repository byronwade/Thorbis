"use client";

import type { EmailRecord, EmailsResult, EmailFolder } from "@/lib/queries/emails";
import {
	archiveEmailAction,
	archiveAllEmailsAction,
	fetchEmailContentAction,
	getEmailsAction,
	markEmailAsReadAction,
	toggleSpamEmailAction,
	toggleStarEmailAction,
	retryFailedEmailAction,
} from "@/actions/email-actions";
import { CustomerInfoPill } from "@/components/communication/customer-info-pill";
import { EmailContent } from "@/components/communication/email-content";
import { EmailFullComposer } from "@/components/communication/email-full-composer";
import { EmailReplyComposer, type EmailReplyMode } from "@/components/communication/email-reply-composer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
	AlertTriangle,
	Archive,
	ArrowLeft,
	CheckCheck,
	ChevronRight,
	Download,
	Eye,
	Flag,
	Forward,
	Info,
	Loader2,
	MoreHorizontal,
	MousePointerClick,
	PanelLeft,
	Printer,
	RefreshCw,
	Reply,
	ReplyAll,
	Send,
	Star,
	StickyNote,
	Trash2,
	User,
	X
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getCustomerDisplayName } from "@/lib/utils/customer-display";
import { useSidebar } from "@/components/ui/sidebar";
import { useRoleStore } from "@/lib/stores/role-store";
import { USER_ROLES } from "@/types/roles";

type EmailPageClientProps = {
	initialEmails: EmailsResult;
	initialFolder: EmailFolder | "inbox";
	initialEmailId: string | null;
	companyId: string | null;
};

export function EmailPageClient({
	initialEmails,
	initialFolder,
	initialEmailId,
	companyId,
}: EmailPageClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const params = useParams();
	const folder: string = searchParams?.get("folder") || initialFolder;
	const emailIdFromPath = params?.id as string | undefined;
	const emailIdFromQuery = searchParams?.get("id");
	const emailId = emailIdFromPath || emailIdFromQuery || initialEmailId;
	const [isPending, startTransition] = useTransition();
	const [emails, setEmails] = useState<EmailsResult>(initialEmails);
	// Note: removed `loading` state - we use `refreshing` for all fetches to keep UI optimistic
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedEmail, setSelectedEmail] = useState<EmailRecord | null>(() => {
		if (initialEmailId && initialEmails.emails) {
			return initialEmails.emails.find(e => e.id === initialEmailId) || null;
		}
		return null;
	});
	const [emailContent, setEmailContent] = useState<{ html?: string | null; text?: string | null } | null>(() => {
		if (selectedEmail) {
			return {
				html: selectedEmail.body_html || null,
				text: selectedEmail.body || null,
			};
		}
		return null;
	});
	const [loadingContent, setLoadingContent] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const selectedEmailRef = useRef<EmailRecord | null>(selectedEmail);
	const { toggleSidebar } = useSidebar();
	const [replyMode, setReplyMode] = useState<EmailReplyMode | null>(null);
	const [composeMode, setComposeMode] = useState(false);
	const [notesOpen, setNotesOpen] = useState(false);
	const [emailNotes, setEmailNotes] = useState<string>("");
	const [archiveAllDialogOpen, setArchiveAllDialogOpen] = useState(false);
	const [retrying, setRetrying] = useState(false);
	const role = useRoleStore((state) => state.role);
	const isOwner = role === USER_ROLES.OWNER || role === USER_ROLES.ADMIN;

	// Handle compose=true query param from navigation
	useEffect(() => {
		const shouldCompose = searchParams?.get("compose") === "true";
		if (shouldCompose && !composeMode) {
			setComposeMode(true);
			setSelectedEmail(null);
			setEmailContent(null);
			selectedEmailRef.current = null;
			const newParams = new URLSearchParams(searchParams?.toString() || "");
			newParams.delete("compose");
			newParams.delete("to");
			newParams.delete("name");
			newParams.delete("customerId");
			const newUrl = newParams.toString()
				? `/dashboard/communication/email?${newParams.toString()}`
				: "/dashboard/communication/email";
			router.replace(newUrl);
		}
	}, [searchParams, router, composeMode]);

	// Keyboard shortcut: 'C' to open compose mode
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement;
			if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
				return;
			}

			if (e.key === "c" && !e.metaKey && !e.ctrlKey && !e.altKey && !composeMode) {
				e.preventDefault();
				setComposeMode(true);
				setSelectedEmail(null);
				setEmailContent(null);
				selectedEmailRef.current = null;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [composeMode]);

	// Fetch emails function (for refresh and search)
	// OPTIMISTIC: Always use refreshing state (subtle indicator) instead of blocking loading spinner
	// This ensures emails stay visible while new data is being fetched
	const fetchEmails = useCallback(async (showRefreshing = false) => {
		setRefreshing(true);
		setError(null);

		startTransition(async () => {
			try {
				const result = await getEmailsAction({
					limit: 50,
					offset: 0,
					type: "all",
					folder: (folder || "inbox") as EmailFolder,
					search: searchQuery || undefined,
					sortBy: "created_at",
					sortOrder: "desc"
				});

				const normalizedEmails = result.emails.map(email => {
					let parsedToAddress = email.to_address;
					if (typeof email.to_address === 'string') {
						const trimmed = email.to_address.trim();
						if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
							try {
								const parsed = JSON.parse(email.to_address);
								if (Array.isArray(parsed) && parsed.length > 0) {
									parsedToAddress = parsed[0];
								}
							} catch {
								// Keep original
							}
						}
					}
					return { ...email, to_address: parsedToAddress };
				});

				setEmails({
					...result,
					emails: normalizedEmails as unknown as EmailRecord[],
				});

				const currentSelected = selectedEmailRef.current;
				if (currentSelected) {
					const updatedEmail = result.emails.find(e => e.id === currentSelected.id);
					if (updatedEmail) {
						setSelectedEmail(updatedEmail as unknown as EmailRecord);
						selectedEmailRef.current = updatedEmail as unknown as EmailRecord;
					} else {
						setSelectedEmail(null);
						selectedEmailRef.current = null;
						setEmailContent(null);
					}
				}
			} catch (err) {
				console.error("Failed to fetch emails:", err);
				const errorMessage = err instanceof Error ? err.message : "Failed to load emails";
				setError(errorMessage);
				toast.error("Failed to load emails", { description: errorMessage });
			} finally {
				setRefreshing(false);
			}
		});
	}, [searchQuery, folder]);

	// Refetch when search changes (NOT on initial mount - we have server data)
	useEffect(() => {
		if (searchQuery) {
			fetchEmails();
		}
	}, [searchQuery]);

	// Use ref to track refreshing state without triggering effect re-runs
	const refreshingRef = useRef(refreshing);
	refreshingRef.current = refreshing;

	// Auto-refresh emails every 30 seconds to catch new incoming emails
	// This prevents the "have to refresh to see emails" issue
	useEffect(() => {
		const interval = setInterval(() => {
			// Only auto-refresh if not in compose mode and not already refreshing
			if (!composeMode && !refreshingRef.current) {
				fetchEmails();
			}
		}, 30000);

		// Also listen for custom events that indicate new emails
		const handleNewEmail = () => {
			fetchEmails();
		};
		window.addEventListener("email-received", handleNewEmail);
		window.addEventListener("email-sent", handleNewEmail);

		return () => {
			clearInterval(interval);
			window.removeEventListener("email-received", handleNewEmail);
			window.removeEventListener("email-sent", handleNewEmail);
		};
	}, [fetchEmails, composeMode]);

	// Refetch when folder changes (but not on initial mount)
	const initialFolderRef = useRef(folder);
	useEffect(() => {
		if (folder !== initialFolderRef.current) {
			initialFolderRef.current = folder;
			fetchEmails();
		}
	}, [folder, fetchEmails]);

	// Handle search input with debounce
	useEffect(() => {
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		searchTimeoutRef.current = setTimeout(() => {
			setSearchQuery(searchInput);
		}, 300);

		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, [searchInput]);

	// Handle email selection
	const handleEmailSelect = useCallback((email: EmailRecord) => {
		setSelectedEmail(email);
		selectedEmailRef.current = email;

		const queryParams = new URLSearchParams();
		if (folder && folder !== "inbox") queryParams.set("folder", folder);
		queryParams.set("id", email.id);

		router.replace(`/dashboard/communication/email?${queryParams.toString()}`, { scroll: false });

		const hasContent = email.body_html || email.body;
		if (hasContent) {
			setEmailContent({
				html: email.body_html || null,
				text: email.body || null,
			});
			setLoadingContent(false);
		} else {
			setLoadingContent(true);
			fetchEmailContentAction(email.id)
				.then((result) => {
					if (result.success) {
						setEmailContent({
							html: result.html || null,
							text: result.text || null,
						});
					} else {
						setEmailContent({ html: null, text: null });
					}
				})
				.catch(() => {
					setEmailContent({ html: null, text: null });
				})
				.finally(() => {
					setLoadingContent(false);
				});
		}

		if (!email.read_at) {
			setEmails(prev => ({
				...prev,
				emails: prev.emails.map(e =>
					e.id === email.id ? { ...e, read_at: new Date().toISOString() } : e
				)
			}));
			markEmailAsReadAction({ emailId: email.id })
				.then((result) => {
					if (result.success) {
						window.dispatchEvent(new CustomEvent("email-read"));
					}
				})
				.catch(console.error);
		}
	}, [router, folder]);

	// Load email from URL if ID changes
	useEffect(() => {
		if (emailId && emailId === selectedEmailRef.current?.id) {
			return;
		}

		if (emailId && emails?.emails) {
			const email = emails.emails.find(e => e.id === emailId);
			if (email) {
				setSelectedEmail(email);
				selectedEmailRef.current = email;

				const hasContent = email.body_html || email.body;
				if (hasContent) {
					setEmailContent({
						html: email.body_html || null,
						text: email.body || null,
					});
				} else {
					setLoadingContent(true);
					fetchEmailContentAction(email.id)
						.then((result) => {
							if (result.success) {
								setEmailContent({
									html: result.html || null,
									text: result.text || null,
								});
							} else {
								setEmailContent({ html: null, text: null });
							}
						})
						.catch(() => {
							setEmailContent({ html: null, text: null });
						})
						.finally(() => {
							setLoadingContent(false);
						});
				}

				if (!email.read_at) {
					setEmails(prev => ({
						...prev,
						emails: prev.emails.map(e =>
							e.id === email.id ? { ...e, read_at: new Date().toISOString() } : e
						)
					}));
					markEmailAsReadAction({ emailId: email.id }).catch(console.error);
				}
			}
		} else if (!emailId && selectedEmail) {
			setSelectedEmail(null);
			selectedEmailRef.current = null;
			setEmailContent(null);
		}
	}, [emailId, emails?.emails]);

	const handleRefresh = useCallback(() => {
		fetchEmails(true);
		toast.success("Refreshing emails...");
	}, [fetchEmails]);

	const handleArchive = useCallback(async (emailId: string) => {
		try {
			if (folder !== "archive") {
				setEmails(prev => ({
					...prev,
					emails: prev.emails.filter(e => e.id !== emailId),
					total: prev.total - 1,
				}));

				if (selectedEmail?.id === emailId) {
					setSelectedEmail(null);
					setEmailContent(null);
					selectedEmailRef.current = null;
					const params = new URLSearchParams();
					if (folder && folder !== "inbox") params.set("folder", folder);
					router.replace(`/dashboard/communication/email?${params.toString()}`, { scroll: false });
				}
			}

			const result = await archiveEmailAction(emailId);
			if (result.success) {
				toast.success("Email archived");
				window.dispatchEvent(new CustomEvent("email-archived"));
			} else {
				fetchEmails(false);
				toast.error("Failed to archive email", {
					description: result.error || "Unknown error"
				});
			}
		} catch (err) {
			fetchEmails(false);
			toast.error("Failed to archive email");
		}
	}, [fetchEmails, folder, selectedEmail, router]);

	// Confirm archive all - called from dialog
	const confirmArchiveAll = useCallback(async () => {
		if (!emails?.emails || emails.emails.length === 0) {
			toast.info("No emails to archive");
			setArchiveAllDialogOpen(false);
			return;
		}

		try {
			setRefreshing(true);
			setArchiveAllDialogOpen(false);
			const result = await archiveAllEmailsAction((folder || "inbox") as string);
			if (result.success) {
				toast.success(`Archived ${result.archived} email${result.archived === 1 ? '' : 's'}`);
				fetchEmails(false);
				setSelectedEmail(null);
				setEmailContent(null);
				window.dispatchEvent(new CustomEvent("email-archived"));
			} else {
				toast.error("Failed to archive emails", {
					description: result.error || "Unknown error"
				});
			}
		} catch (err) {
			toast.error("Failed to archive emails");
		} finally {
			setRefreshing(false);
		}
	}, [emails, folder, fetchEmails]);

	const handleToggleSpam = useCallback(async (emailId: string) => {
		try {
			const emailToUpdate = emails?.emails.find(e => e.id === emailId);
			const currentTags = (emailToUpdate?.tags as string[]) || [];
			const isSpam = currentTags.includes("spam") || emailToUpdate?.category === "spam";
			const willBeSpam = !isSpam;

			setEmails(prev => {
				if (willBeSpam && folder !== "spam") {
					return {
						...prev,
						emails: prev.emails.filter(e => e.id !== emailId),
						total: prev.total - 1,
					};
				}

				if (!willBeSpam && folder === "spam") {
					return {
						...prev,
						emails: prev.emails.filter(e => e.id !== emailId),
						total: prev.total - 1,
					};
				}

				return {
					...prev,
					emails: prev.emails.map(e => {
						if (e.id === emailId) {
							const newTags = willBeSpam
								? [...currentTags, "spam"]
								: currentTags.filter(tag => tag !== "spam");
							return { ...e, tags: newTags.length > 0 ? newTags : null, category: willBeSpam ? "spam" : null };
						}
						return e;
					}),
				};
			});

			if (selectedEmail?.id === emailId && ((willBeSpam && folder !== "spam") || (!willBeSpam && folder === "spam"))) {
				setSelectedEmail(null);
				setEmailContent(null);
				selectedEmailRef.current = null;
			}

			const result = await toggleSpamEmailAction(emailId);
			if (result.success) {
				toast.success(willBeSpam ? "Email marked as spam" : "Email removed from spam");
				window.dispatchEvent(new CustomEvent("email-spam-toggled"));
			} else {
				fetchEmails(false);
				toast.error("Failed to update spam status");
			}
		} catch {
			fetchEmails(false);
			toast.error("Failed to update spam status");
		}
	}, [fetchEmails, selectedEmail, folder, emails]);

	const handleStar = useCallback(async (emailId: string) => {
		try {
			const emailToUpdate = emails?.emails.find(e => e.id === emailId);
			const currentTags = (emailToUpdate?.tags as string[]) || [];
			const isStarred = currentTags.includes("starred");
			const willBeStarred = !isStarred;

			setEmails(prev => {
				const updatedEmails = prev.emails.map(e => {
					if (e.id === emailId) {
						const newTags = willBeStarred
							? [...currentTags, "starred"]
							: currentTags.filter(tag => tag !== "starred");
						return { ...e, tags: newTags.length > 0 ? newTags : null };
					}
					return e;
				});

				if (folder === "starred") {
					const filteredEmails = updatedEmails.filter(e => {
						const tags = (e.tags as string[]) || [];
						return tags.includes("starred");
					});
					return { ...prev, emails: filteredEmails, total: filteredEmails.length };
				}

				return { ...prev, emails: updatedEmails };
			});

			if (selectedEmail?.id === emailId) {
				const newTags = willBeStarred
					? [...currentTags, "starred"]
					: currentTags.filter(tag => tag !== "starred");
				setSelectedEmail({ ...selectedEmail, tags: newTags.length > 0 ? newTags : null });

				if (folder === "starred" && !willBeStarred) {
					setSelectedEmail(null);
					setEmailContent(null);
				}
			}

			const result = await toggleStarEmailAction(emailId);
			if (result.success) {
				window.dispatchEvent(new CustomEvent("email-starred-toggled"));
			} else {
				fetchEmails(false);
				toast.error("Failed to star email");
			}
		} catch {
			fetchEmails(false);
			toast.error("Failed to star email");
		}
	}, [fetchEmails, selectedEmail, folder, emails]);

	const handlePrintEmail = useCallback(() => {
		if (!selectedEmail) return;

		const printContent = `
			<!DOCTYPE html>
			<html>
			<head>
				<title>${selectedEmail.subject || 'Email'}</title>
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
					<div class="subject">${selectedEmail.subject || 'No Subject'}</div>
					<div class="meta">
						<div class="meta-row"><strong>From:</strong> ${selectedEmail.from_name || ''} &lt;${selectedEmail.from_address || 'Unknown'}&gt;</div>
						<div class="meta-row"><strong>To:</strong> ${selectedEmail.to_address || 'Unknown'}</div>
						<div class="meta-row"><strong>Date:</strong> ${new Date(selectedEmail.created_at).toLocaleString()}</div>
					</div>
				</div>
				<div class="body">
					${emailContent?.html || selectedEmail.body_html || emailContent?.text || selectedEmail.body || 'No content'}
				</div>
			</body>
			</html>
		`;

		const printWindow = window.open('', '_blank');
		if (printWindow) {
			printWindow.document.write(printContent);
			printWindow.document.close();
			printWindow.focus();
			setTimeout(() => printWindow.print(), 250);
		}
	}, [selectedEmail, emailContent]);

	const handleDownloadEml = useCallback(() => {
		if (!selectedEmail) return;

		const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).slice(2)}`;
		const date = new Date(selectedEmail.created_at).toUTCString();

		const emlContent = `MIME-Version: 1.0
Date: ${date}
Subject: ${selectedEmail.subject || 'No Subject'}
From: ${selectedEmail.from_name ? `${selectedEmail.from_name} <${selectedEmail.from_address}>` : selectedEmail.from_address || 'Unknown'}
To: ${selectedEmail.to_address || 'Unknown'}
Content-Type: multipart/alternative; boundary="${boundary}"

--${boundary}
Content-Type: text/plain; charset="UTF-8"
Content-Transfer-Encoding: 7bit

${emailContent?.text || selectedEmail.body || 'No content'}

--${boundary}
Content-Type: text/html; charset="UTF-8"
Content-Transfer-Encoding: 7bit

${emailContent?.html || selectedEmail.body_html || '<p>No content</p>'}

--${boundary}--
`;

		const blob = new Blob([emlContent], { type: 'message/rfc822' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		// Safely sanitize filename - replace non-alphanumeric chars, handle empty/invalid subjects
		const safeSubject = (selectedEmail.subject || 'email')
			.replace(/[^a-z0-9\s-]/gi, '_')
			.replace(/\s+/g, '_')
			.slice(0, 50) || 'email';
		link.download = `${safeSubject}.eml`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		toast.success("Email downloaded");
	}, [selectedEmail, emailContent]);

	const handleDelete = useCallback(async (emailId: string) => {
		try {
			setEmails(prev => ({
				...prev,
				emails: prev.emails.filter(e => e.id !== emailId),
				total: prev.total - 1,
			}));

			if (selectedEmail?.id === emailId) {
				setSelectedEmail(null);
				setEmailContent(null);
				selectedEmailRef.current = null;
				const params = new URLSearchParams();
				if (folder && folder !== "inbox") params.set("folder", folder);
				router.replace(`/dashboard/communication/email?${params.toString()}`, { scroll: false });
			}

			toast.success("Email moved to trash");
		} catch {
			fetchEmails(false);
			toast.error("Failed to delete email");
		}
	}, [fetchEmails, selectedEmail, folder, router]);

	const handleRetry = useCallback(async (emailId: string) => {
		if (!emailId) return;

		setRetrying(true);
		try {
			const result = await retryFailedEmailAction(emailId);

			if (result.success) {
				toast.success("Email sent successfully!");
				// Refresh emails to get updated status
				fetchEmails(true);
			} else {
				toast.error("Failed to send email", {
					description: result.error || "Please try again later",
				});
			}
		} catch (err) {
			console.error("Failed to retry email:", err);
			toast.error("Failed to send email", {
				description: err instanceof Error ? err.message : "Unknown error occurred",
			});
		} finally {
			setRetrying(false);
		}
	}, [fetchEmails]);

	// Mobile: show list when no email selected, show detail when email selected
	// Desktop: always show both panels side by side
	const showListOnMobile = !selectedEmail && !composeMode;
	const showDetailOnMobile = selectedEmail || composeMode;

	return (
		<div className="flex h-full w-full flex-col overflow-hidden bg-sidebar">
			<div className="flex flex-1 overflow-hidden min-h-0 md:gap-2">
				{/* Email List Panel - Hidden on mobile when email is selected */}
				<div className={cn(
					"bg-card mb-1 shadow-sm flex flex-col overflow-hidden",
					"w-full h-full", // Mobile: full width/height
					"md:w-[400px] lg:w-[480px] md:rounded-tr-2xl", // Desktop: fixed width with rounded corner
					// Mobile visibility logic
					showListOnMobile ? "flex" : "hidden md:flex"
				)}>
					<div className="w-full h-full flex flex-col">
						<div className="sticky top-0 z-15 flex items-center justify-between gap-1.5 p-2 pb-0 transition-colors bg-card">
							<div className="w-full">
								<div className="grid grid-cols-12 gap-2 mt-1">
									<div className="col-span-12 flex gap-2">
										{/* Sidebar toggle - larger on mobile for touch */}
										<Button
											variant="ghost"
											size="sm"
											onClick={toggleSidebar}
											className="h-10 w-10 p-0 md:h-8 md:w-8 shrink-0"
											title="Toggle sidebar"
										>
											<PanelLeft className="h-5 w-5 md:h-4 md:w-4 text-muted-foreground" />
										</Button>
										<div className="relative flex-1">
											{/* Search input - text-base on mobile to prevent iOS zoom */}
											<Input
												type="search"
												placeholder="Search emails..."
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
													onClick={() => setSearchInput("")}
													className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
												>
													<X className="h-3 w-3" />
												</button>
											)}
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={handleRefresh}
											disabled={refreshing}
											className="h-10 w-10 p-0 md:h-8 md:w-8"
											title="Refresh"
										>
											<RefreshCw className={`h-5 w-5 md:h-4 md:w-4 text-muted-foreground ${refreshing ? 'animate-spin' : ''}`} />
										</Button>
										{/* Archive All - Owner only, icon button with confirmation dialog */}
										{isOwner && folder !== "archive" && emails?.emails && emails.emails.length > 0 && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => setArchiveAllDialogOpen(true)}
												disabled={refreshing}
												className="h-8 w-8 p-0 group/archive-all hover:bg-destructive/10"
												title="Archive all emails"
											>
												<Archive className="h-4 w-4 text-muted-foreground group-hover/archive-all:text-destructive transition-colors" />
											</Button>
										)}
									</div>
								</div>
							</div>
						</div>
						{/* Subtle progress bar when refreshing - visible only during fetch */}
						<div className={cn(
							"bg-[#006FFE] relative z-5 h-0.5 w-full transition-opacity",
							refreshing ? "opacity-100 animate-pulse" : "opacity-0"
						)} />

						{/* Email Items */}
						<div className="relative z-1 flex-1 overflow-hidden pt-0 min-h-0">
							<div className="hide-link-indicator flex h-full w-full">
								<div className="flex flex-1 flex-col" id="mail-list-scroll">
									<ScrollArea className="scrollbar-none flex-1 overflow-x-hidden h-full">
										{/* Only show error when there's no data at all - otherwise show existing emails optimistically */}
										{error && (!emails?.emails || emails.emails.length === 0) ? (
											<div className="flex items-center justify-center p-8">
												<div className="text-center">
													<AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
													<p className="text-sm text-destructive mb-2 font-medium">Failed to load emails</p>
													<p className="text-xs text-muted-foreground mb-4">{error}</p>
													<Button variant="outline" size="sm" onClick={() => fetchEmails()}>
														Try Again
													</Button>
												</div>
											</div>
										) : emails?.emails?.length ? (
											<div className="min-h-[200px] px-2">
												{emails.emails.map((email) => {
													const isSelected = selectedEmail?.id === email.id;
													return (
														<div key={email.id} className="select-none md:my-1">
															<div
																className={cn(
																	"hover:bg-accent group flex cursor-pointer flex-col items-start rounded-lg py-2 text-left text-sm transition-all hover:opacity-100 relative",
																	isSelected ? "bg-accent opacity-100" : "",
																	!email.read_at ? "opacity-100" : "opacity-60"
																)}
																onClick={() => handleEmailSelect(email)}
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
																			handleStar(email.id);
																		}}
																		title={email.tags && Array.isArray(email.tags) && email.tags.includes("starred") ? "Unstar" : "Star"}
																	>
																		<Star className={cn(
																			"h-4 w-4 transition-colors group-hover/star:text-yellow-500",
																			email.tags && Array.isArray(email.tags) && email.tags.includes("starred")
																				? "fill-yellow-500 text-yellow-500"
																				: "text-muted-foreground"
																		)} />
																	</Button>
																	<Button
																		variant="ghost"
																		size="sm"
																		className="h-6 w-6 p-0 hover:bg-accent group/spam"
																		onClick={(e) => {
																			e.stopPropagation();
																			handleToggleSpam(email.id);
																		}}
																		title={email.category === "spam" ? "Not spam" : "Spam"}
																	>
																		<Flag className={cn(
																			"h-4 w-4 transition-colors group-hover/spam:text-orange-500",
																			email.category === "spam"
																				? "fill-orange-500 text-orange-500"
																				: "text-muted-foreground"
																		)} />
																	</Button>
																	<Button
																		variant="ghost"
																		size="sm"
																		className="h-6 w-6 p-0 hover:bg-accent group/archive"
																		onClick={(e) => {
																			e.stopPropagation();
																			handleArchive(email.id);
																		}}
																		title="Archive"
																	>
																		<Archive className="h-4 w-4 text-muted-foreground transition-colors group-hover/archive:text-blue-500" />
																	</Button>
																</div>

																{/* Email Card Content */}
																<div className="relative flex w-full items-center justify-between gap-4 px-2">
																	<Avatar className="h-8 w-8 shrink-0 rounded-full border">
																		<AvatarFallback className="bg-white dark:bg-[#373737] text-[#9F9F9D] font-bold text-xs">
																			{email.from_address?.[0]?.toUpperCase() || "U"}
																		</AvatarFallback>
																	</Avatar>

																	<div className="flex w-full justify-between">
																		<div className="w-full">
																			<div className="flex w-full flex-row items-center justify-between">
																				<div className="flex flex-row items-center gap-[4px]">
																					<span className="font-bold text-md flex items-baseline gap-1 group-hover:opacity-100">
																						<div className="flex items-center gap-1">
																							<span className="line-clamp-1 overflow-hidden text-sm">
																								{email.direction === "outbound"
																									? (email.to_address || "Unknown recipient")
																									: (email.from_name || email.from_address || "Unknown sender")
																								}
																							</span>
																							{!email.read_at && (
																								<span className="ml-0.5 size-2 rounded-full bg-[#006FFE]"></span>
																							)}
																						</div>
																					</span>
																				</div>
																				<p className="text-muted-foreground text-nowrap text-xs font-normal opacity-70 transition-opacity group-hover:opacity-100 dark:text-[#8C8C8C]">
																					{email.created_at ? new Date(email.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
																				</p>
																			</div>

																			<div className="flex justify-between items-center gap-2">
																				<p className="mt-1 line-clamp-1 min-w-0 overflow-hidden text-sm text-[#8C8C8C] flex-1">
																					{email.subject || "No subject"}
																				</p>
																				{/* Status badges */}
																				<div className="flex items-center gap-1 shrink-0">
																					{/* Customer link badge */}
																					{email.customer?.id && (
																						<Link
																							href={`/dashboard/customers/${email.customer.id}`}
																							onClick={(e) => e.stopPropagation()}
																							className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-0.5"
																							title={`View ${getCustomerDisplayName(email.customer)} profile`}
																						>
																							<User className="h-2.5 w-2.5" />
																							<span className="hidden sm:inline">
																								{getCustomerDisplayName(email.customer)}
																							</span>
																						</Link>
																					)}
																					{email.status === "draft" && (
																						<span className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground">
																							Draft
																						</span>
																					)}
																					{email.status === "failed" && (
																						<Tooltip>
																							<TooltipTrigger asChild>
																								<span className="px-1.5 py-0.5 rounded text-[10px] bg-destructive/10 text-destructive cursor-help flex items-center gap-0.5">
																									<AlertTriangle className="h-2.5 w-2.5" />
																									Failed
																								</span>
																							</TooltipTrigger>
																							<TooltipContent>
																								<p className="font-medium">Email failed to send</p>
																								<p className="text-xs text-muted-foreground mt-1">Click email to retry or view details</p>
																							</TooltipContent>
																						</Tooltip>
																					)}
																					{email.direction === "outbound" && email.status !== "draft" && email.status !== "failed" && (
																						<span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-600">
																							Sent
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
													{refreshing ? (
														<>
															<Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-3" />
															<p className="text-sm text-muted-foreground">Loading emails...</p>
														</>
													) : (
														<>
															<p className="text-sm font-medium text-muted-foreground mb-1">
																{searchQuery ? "No emails found" : "No emails yet"}
															</p>
															<p className="text-xs text-muted-foreground">
																{searchQuery ? "Try adjusting your search terms" : "Emails will appear here when received"}
															</p>
														</>
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

				{/* Right Panel - Email Composer OR Email Detail */}
			{/* Mobile: shown when email selected or compose mode, Desktop: always visible as flex-1 */}
				{composeMode ? (
					<div className={cn(
						"bg-card mb-1 shadow-sm flex flex-col min-w-0 overflow-hidden",
						"w-full h-full", // Mobile: full width/height
						"md:rounded-tl-2xl md:flex-1", // Desktop: rounded corner and flex
						showDetailOnMobile ? "flex" : "hidden md:flex"
					)}>
						<EmailFullComposer
							companyId={companyId}
							onClose={() => setComposeMode(false)}
							onSent={() => {
								setComposeMode(false);
								fetchEmails(true);
							}}
							className="h-full"
						/>
					</div>
				) : selectedEmail ? (
					<div className={cn(
						"bg-card mb-1 shadow-sm flex flex-col min-w-0 overflow-hidden",
						"w-full h-full", // Mobile: full width/height
						"md:rounded-tl-2xl md:flex-1", // Desktop: rounded corner and flex
						showDetailOnMobile ? "flex" : "hidden md:flex"
					)}>
						<div className="relative flex-1 min-h-0 flex flex-col">
							<div className="bg-card relative flex flex-col overflow-hidden transition-all duration-300 h-full flex-1 min-h-0">
								{/* Email Header Toolbar */}
								<div className="sticky top-0 z-15 flex shrink-0 items-center justify-between gap-1.5 p-2 pb-0 transition-colors bg-card">
									<div className="flex flex-1 items-center gap-2">
										{/* Back button (mobile) / Close button (desktop) */}
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												setSelectedEmail(null);
												setEmailContent(null);
												selectedEmailRef.current = null;
												const params = new URLSearchParams();
												if (folder && folder !== "inbox") params.set("folder", folder);
												router.push(`/dashboard/communication/email?${params.toString()}`, { scroll: false });
											}}
											className="h-10 w-10 p-0 md:h-8 md:w-8"
											title="Back to list"
										>
											{/* Arrow on mobile, X on desktop */}
											<ArrowLeft className="h-5 w-5 md:hidden text-muted-foreground" />
											<X className="h-4 w-4 hidden md:block text-muted-foreground" />
										</Button>
										<Separator orientation="vertical" className="h-4 bg-border/60 hidden md:block" />
									</div>
									<div className="flex items-center gap-1">
										{/* Reply all - hidden text on mobile */}
										<Button
											variant="ghost"
											size="sm"
											className="h-10 w-10 p-0 md:h-8 md:w-auto md:px-2"
											onClick={() => setReplyMode("reply-all")}
											title="Reply all"
										>
											<ReplyAll className="h-5 w-5 md:h-4 md:w-4 md:mr-1.5 text-muted-foreground" />
											<span className="text-sm leading-none font-medium hidden md:inline">Reply all</span>
										</Button>
										{/* Notes - hidden on mobile, accessible via more menu */}
										<Sheet open={notesOpen} onOpenChange={setNotesOpen}>
											<SheetTrigger asChild>
												<Button variant="ghost" size="sm" className="h-10 w-10 p-0 md:h-8 md:w-8 hidden md:flex" title="Notes">
													<StickyNote className="h-4 w-4 text-muted-foreground" />
												</Button>
											</SheetTrigger>
											<SheetContent>
												<SheetHeader>
													<SheetTitle>Email Notes</SheetTitle>
													<SheetDescription>
														Add private notes about this email.
													</SheetDescription>
												</SheetHeader>
												<div className="py-4">
													<Textarea
														placeholder="Add your notes here..."
														value={emailNotes}
														onChange={(e) => setEmailNotes(e.target.value)}
														className="min-h-[200px] resize-none"
													/>
													<div className="mt-4 flex justify-end gap-2">
														<Button variant="outline" size="sm" onClick={() => setNotesOpen(false)}>
															Cancel
														</Button>
														<Button size="sm" onClick={() => { toast.success("Notes saved"); setNotesOpen(false); }}>
															Save Notes
														</Button>
													</div>
												</div>
											</SheetContent>
										</Sheet>
										{/* Star - visible on all sizes */}
										<Button
											variant="ghost"
											size="sm"
											className="h-10 w-10 p-0 md:h-8 md:w-8 group/star"
											title={selectedEmail?.tags?.includes("starred") ? "Unstar" : "Star"}
											onClick={() => selectedEmail && handleStar(selectedEmail.id)}
										>
											<Star className={cn(
												"h-5 w-5 md:h-4 md:w-4 transition-colors group-hover/star:text-yellow-500",
												selectedEmail?.tags?.includes("starred")
													? "fill-yellow-500 text-yellow-500"
													: "text-muted-foreground"
											)} />
										</Button>
										{/* Spam - hidden on mobile, in more menu */}
										<Button
											variant="ghost"
											size="sm"
											className="h-10 w-10 p-0 md:h-8 md:w-8 hidden md:flex group/spam"
											title={selectedEmail?.category === "spam" ? "Not spam" : "Spam"}
											onClick={() => selectedEmail && handleToggleSpam(selectedEmail.id)}
										>
											<Flag className={cn(
												"h-4 w-4 transition-colors group-hover/spam:text-orange-500",
												selectedEmail?.category === "spam"
													? "fill-orange-500 text-orange-500"
													: "text-muted-foreground"
											)} />
										</Button>
										{/* Archive - visible on all sizes */}
										<Button
											variant="destructive"
											size="sm"
											className="h-10 w-10 p-0 md:h-8 md:w-8"
											title="Archive"
											onClick={() => selectedEmail && handleArchive(selectedEmail.id)}
										>
											<Archive className="h-5 w-5 md:h-4 md:w-4" />
										</Button>
										{/* More menu */}
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="sm" className="h-10 w-10 p-0 md:h-8 md:w-8" title="More">
													<MoreHorizontal className="h-5 w-5 md:h-4 md:w-4 text-muted-foreground" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-48">
												{/* Mobile-only options */}
												<DropdownMenuItem
													onClick={() => selectedEmail && handleToggleSpam(selectedEmail.id)}
													className="md:hidden"
												>
													<Flag className="h-4 w-4 mr-2" />
													{selectedEmail?.category === "spam" ? "Not spam" : "Mark as spam"}
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => setNotesOpen(true)}
													className="md:hidden"
												>
													<StickyNote className="h-4 w-4 mr-2" />
													Notes
												</DropdownMenuItem>
												<DropdownMenuSeparator className="md:hidden" />
												<DropdownMenuItem onClick={handlePrintEmail}>
													<Printer className="h-4 w-4 mr-2" />
													Print
												</DropdownMenuItem>
												<DropdownMenuItem onClick={handleDownloadEml}>
													<Download className="h-4 w-4 mr-2" />
													Download as .eml
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => selectedEmail && handleDelete(selectedEmail.id)}
													className="text-destructive focus:text-destructive"
												>
													<Trash2 className="h-4 w-4 mr-2" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>

								{/* Email Content */}
								<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
									<div className="relative overflow-hidden flex-1 h-full min-h-0 flex flex-col">
										<TooltipProvider delayDuration={100}>
											<div className="border-b border-border/50 px-2 py-4 space-y-3">
												<h1 className="text-base font-semibold text-foreground">
													{selectedEmail.subject || "No Subject"}
												</h1>

												<div className="flex items-center gap-3">
													<Avatar className="h-9 w-9 shrink-0 rounded-md cursor-pointer">
														<AvatarFallback className="bg-muted text-muted-foreground font-semibold text-sm rounded-md">
															{selectedEmail.from_address?.[0]?.toUpperCase() || "U"}
														</AvatarFallback>
													</Avatar>

													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2">
															<span className="font-semibold text-sm text-foreground">
																{selectedEmail.from_name || selectedEmail.from_address || "Unknown"}
															</span>
															{!selectedEmail.read_at && (
																<div className="h-2 w-2 rounded-full bg-primary" />
															)}
														</div>
														<div className="flex items-center gap-2 text-xs text-muted-foreground">
															<span>to {selectedEmail.to_address?.split('@')[0] || 'you'}</span>
															<CustomerInfoPill
																customer={selectedEmail.customer}
																fallbackName={selectedEmail.from_name || undefined}
																fallbackEmail={selectedEmail.from_address || undefined}
																size="sm"
															/>
														</div>
													</div>

													<div className="flex items-center gap-2">
														<span className="text-xs text-muted-foreground whitespace-nowrap">
															{new Date(selectedEmail.created_at).toLocaleTimeString('en-US', {
																hour: 'numeric',
																minute: '2-digit'
															})}
														</span>
													</div>
												</div>

												{/* Email Tracking Status - Only for outbound */}
												{selectedEmail.direction === "outbound" && (
													<div className="flex flex-col gap-2 pt-2">
														<div className="flex items-center gap-1 flex-wrap">
															<Tooltip>
																<TooltipTrigger asChild>
																	<div className={cn(
																		"flex items-center gap-1.5 px-2 py-1 rounded-full text-xs",
																		selectedEmail.sent_at ? "bg-blue-500/10 text-blue-600" : "bg-muted text-muted-foreground"
																	)}>
																		<Send className="h-3 w-3" />
																		<span>Sent</span>
																	</div>
																</TooltipTrigger>
																<TooltipContent>
																	<p>{selectedEmail.sent_at ? `Sent ${new Date(selectedEmail.sent_at).toLocaleString()}` : "Not sent yet"}</p>
																</TooltipContent>
															</Tooltip>

															{selectedEmail.sent_at && <ChevronRight className="h-3 w-3 text-muted-foreground" />}

															{selectedEmail.sent_at && (
																<Tooltip>
																	<TooltipTrigger asChild>
																		<div className={cn(
																			"flex items-center gap-1.5 px-2 py-1 rounded-full text-xs",
																			selectedEmail.delivered_at ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"
																		)}>
																			<CheckCheck className="h-3 w-3" />
																			<span>Delivered</span>
																		</div>
																	</TooltipTrigger>
																	<TooltipContent>
																		<p>{selectedEmail.delivered_at ? `Delivered ${new Date(selectedEmail.delivered_at).toLocaleString()}` : "Waiting..."}</p>
																	</TooltipContent>
																</Tooltip>
															)}

															{selectedEmail.delivered_at && <ChevronRight className="h-3 w-3 text-muted-foreground" />}

															{selectedEmail.delivered_at && (
																<Tooltip>
																	<TooltipTrigger asChild>
																		<div className={cn(
																			"flex items-center gap-1.5 px-2 py-1 rounded-full text-xs",
																			selectedEmail.opened_at ? "bg-purple-500/10 text-purple-600" : "bg-muted/50 text-muted-foreground/70"
																		)}>
																			<Eye className="h-3 w-3" />
																			<span>Opened{selectedEmail.open_count && selectedEmail.open_count > 1 ? ` (${selectedEmail.open_count})` : ""}</span>
																			<AlertTriangle className="h-3 w-3 text-amber-500" />
																		</div>
																	</TooltipTrigger>
																	<TooltipContent>
																		<p>{selectedEmail.opened_at ? `Opened ${new Date(selectedEmail.opened_at).toLocaleString()}` : "Not opened"}</p>
																		<p className="text-xs text-amber-500 mt-1">⚠️ Unreliable metric</p>
																	</TooltipContent>
																</Tooltip>
															)}

															{selectedEmail.delivered_at && <ChevronRight className="h-3 w-3 text-muted-foreground" />}

															{selectedEmail.delivered_at && (
																<Tooltip>
																	<TooltipTrigger asChild>
																		<div className={cn(
																			"flex items-center gap-1.5 px-2 py-1 rounded-full text-xs",
																			selectedEmail.clicked_at ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground"
																		)}>
																			<MousePointerClick className="h-3 w-3" />
																			<span>Clicked{selectedEmail.click_count && selectedEmail.click_count > 1 ? ` (${selectedEmail.click_count})` : ""}</span>
																		</div>
																	</TooltipTrigger>
																	<TooltipContent>
																		<p>{selectedEmail.clicked_at ? `Clicked ${new Date(selectedEmail.clicked_at).toLocaleString()}` : "No clicks"}</p>
																	</TooltipContent>
																</Tooltip>
															)}
														</div>
													</div>
												)}
											</div>
										</TooltipProvider>

										{/* Email Body */}
										<div className="flex-1 overflow-hidden flex flex-col min-h-0">
											<div className="flex-1 overflow-y-auto px-2 py-4">
												{loadingContent ? (
													<div className="flex items-center justify-center py-12">
														<div className="text-center">
															<Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
															<p className="text-sm text-muted-foreground">Loading email content...</p>
														</div>
													</div>
												) : (
													<EmailContent
														html={emailContent?.html || selectedEmail.body_html || null}
														text={emailContent?.text || selectedEmail.body || null}
														attachments={null}
													/>
												)}
											</div>

											{/* Reply Composer or Action Bar */}
											<div className="px-2 py-4 pb-safe">
												{replyMode ? (
													<EmailReplyComposer
														mode={replyMode}
														selectedEmail={selectedEmail as any}
														companyId={companyId}
														onClose={() => setReplyMode(null)}
														onSent={() => {
															setReplyMode(null);
															fetchEmails(true);
														}}
													/>
												) : selectedEmail.status === "failed" ? (
													<div className="flex items-center gap-2 flex-wrap">
														{/* Retry button for failed emails */}
														<Button
															variant="default"
															size="sm"
															className="h-11 px-4 flex-1 md:flex-none md:h-9"
															onClick={() => handleRetry(selectedEmail.id)}
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
														{/* Show failure reason if available */}
														{selectedEmail.failure_reason && (
															<div className="w-full flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
																<AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
																<div className="flex-1 min-w-0">
																	<p className="text-sm font-medium text-destructive">Failed to send</p>
																	<p className="text-xs text-muted-foreground mt-0.5">{selectedEmail.failure_reason}</p>
																</div>
															</div>
														)}
													</div>
												) : (
													<div className="flex items-center gap-2 flex-wrap">
														{/* Reply - primary action, larger on mobile */}
														<Button
															variant="default"
															size="sm"
															className="h-11 px-4 flex-1 md:flex-none md:h-9"
															onClick={() => setReplyMode("reply")}
														>
															<Reply className="h-5 w-5 md:h-4 md:w-4 mr-2" />
															Reply
														</Button>
														{/* Reply All - secondary on mobile */}
														<Button
															variant="outline"
															size="sm"
															className="h-11 px-3 flex-1 md:flex-none md:h-9 md:px-4"
															onClick={() => setReplyMode("reply-all")}
														>
															<ReplyAll className="h-5 w-5 md:h-4 md:w-4 mr-2" />
															<span className="hidden xs:inline">Reply All</span>
															<span className="xs:hidden">All</span>
														</Button>
														{/* Forward - secondary on mobile */}
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
									</div>
								</div>
							</div>
						</div>
					</div>
				) : null}
			</div>

			{/* Archive All Confirmation Dialog - Owner only */}
			<AlertDialog open={archiveAllDialogOpen} onOpenChange={setArchiveAllDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2">
							<AlertTriangle className="h-5 w-5 text-destructive" />
							Archive All {folder ? folder.charAt(0).toUpperCase() + folder.slice(1) : 'Inbox'} Emails
						</AlertDialogTitle>
						<AlertDialogDescription>
							This will archive <strong>{emails?.emails?.length || 0}</strong> email{(emails?.emails?.length || 0) !== 1 ? 's' : ''} from your <strong>{folder || 'inbox'}</strong> folder.
							This action can be undone by viewing the Archive folder.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmArchiveAll}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Archive All
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
