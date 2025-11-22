/**
 * Email Communication Page
 * 
 * Single page for all email folders with filter-based navigation
 * Route: /dashboard/communication/email?folder=inbox
 * 
 * Shows email list on left, detail panel on right when email is selected
 */

"use client";

import type { CompanyEmail, GetEmailsResult } from "@/actions/email-actions";
import {
    archiveEmailAction,
    archiveAllEmailsAction,
    fetchEmailContentAction,
    getEmailsAction,
    markEmailAsReadAction,
    toggleSpamEmailAction,
    toggleStarEmailAction,
} from "@/actions/email-actions";
import { EmailContent } from "@/components/communication/email-content";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    AlertTriangle,
    Archive,
    ChevronLeft,
    ChevronRight,
    Forward,
    Loader2,
    Lock,
    MoreHorizontal,
    RefreshCw,
    Reply,
    ReplyAll,
    Star,
    StickyNote,
    X
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeft } from "lucide-react";

export default function EmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams();
    const folder = (searchParams.get("folder") as string) || "inbox";
    // Get ID from either path params ([id] route) or query params
    const emailIdFromPath = params?.id as string | undefined;
    const emailIdFromQuery = searchParams.get("id");
    const emailId = emailIdFromPath || emailIdFromQuery || null;
    const [isPending, startTransition] = useTransition();
    const [emails, setEmails] = useState<GetEmailsResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedEmail, setSelectedEmail] = useState<CompanyEmail | null>(null);
    const [emailContent, setEmailContent] = useState<{ html?: string | null; text?: string | null } | null>(null);
    const [loadingContent, setLoadingContent] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const selectedEmailRef = useRef<CompanyEmail | null>(null);
    const autoRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const { toggleSidebar } = useSidebar();

    // Fetch emails function with optimistic loading
    const fetchEmails = useCallback(async (showRefreshing = false) => {
        if (showRefreshing) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);
        
        startTransition(async () => {
            try {
                const result = await getEmailsAction({ 
                    limit: 50, 
                    offset: 0,
                    type: "all",
                    folder: folder === "inbox" ? undefined : folder,
                    search: searchQuery || undefined,
                    sortBy: "created_at",
                    sortOrder: "desc"
                });
                
                // Parse to_address if it's a JSON string
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
                            } catch (e) {
                                // Keep original if parsing fails
                            }
                        }
                    }
                    return {
                        ...email,
                        to_address: parsedToAddress,
                    };
                });
                
                setEmails({
                    ...result,
                    emails: normalizedEmails,
                });
                
                // Update selected email if it still exists (preserve selection)
                const currentSelected = selectedEmailRef.current;
                if (currentSelected) {
                    const updatedEmail = result.emails.find(e => e.id === currentSelected.id);
                    if (updatedEmail) {
                        // Update selected email with fresh data, but keep emailContent if it exists
                        setSelectedEmail(updatedEmail);
                        selectedEmailRef.current = updatedEmail;
                    } else {
                        // Selected email no longer in list, clear selection
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
                setLoading(false);
                setRefreshing(false);
            }
        });
    }, [searchQuery, folder]); // Removed selectedEmail from deps - using ref instead

    // Initial fetch and refetch when folder or search changes
    useEffect(() => {
        fetchEmails();
    }, [folder, searchQuery]);

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

    // Handle email selection - update URL but stay on same page (no refresh)
    const handleEmailSelect = useCallback((email: CompanyEmail) => {
        // Optimistic: Update state immediately (no waiting for navigation)
        setSelectedEmail(email);
        selectedEmailRef.current = email;
        
        // Update URL using replace (not push) to avoid page refresh
        const queryParams = new URLSearchParams();
        if (folder && folder !== "inbox") queryParams.set("folder", folder);
        queryParams.set("id", email.id);
        
        // Use query parameter for instant loading (same route, no page refresh)
        router.replace(`/dashboard/communication/email?${queryParams.toString()}`, { scroll: false });
        
        // Set email content immediately (optimistic - show what we have)
        // Always set content from email object first, then fetch if needed
        const hasContent = email.body_html || email.body;
        if (hasContent) {
            setEmailContent({
                html: email.body_html || null,
                text: email.body || null,
            });
            setLoadingContent(false);
        } else {
            // No content in email object, fetch it immediately
            setLoadingContent(true);
            // Fetch in background without blocking UI
            fetchEmailContentAction(email.id)
                .then((result) => {
                    if (result.success) {
                        setEmailContent({
                            html: result.html || null,
                            text: result.text || null,
                        });
                    } else {
                        // Fallback: set empty content
                        console.warn("Failed to fetch email content:", result.error);
                        setEmailContent({ html: null, text: null });
                    }
                })
                .catch((err) => {
                    console.error("Failed to fetch email content:", err);
                    setEmailContent({ html: null, text: null });
                })
                .finally(() => {
                    setLoadingContent(false);
                });
        }

        // Optimistic update for read status (after content is set)
        if (!email.read_at) {
            setEmails(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    emails: prev.emails.map(e => 
                        e.id === email.id ? { ...e, read_at: new Date().toISOString() } : e
                    )
                };
            });
            // Mark as read in background (don't wait, don't reload list)
            markEmailAsReadAction({ emailId: email.id })
                .then((result) => {
                    if (result.success) {
                        // Only update the specific email in the list, don't reload everything
                        setEmails(prev => {
                            if (!prev) return prev;
                            return {
                                ...prev,
                                emails: prev.emails.map(e => 
                                    e.id === email.id ? { ...e, read_at: new Date().toISOString() } : e
                                )
                            };
                        });
                        // Notify sidebar to refresh counts (but don't reload email list)
                        window.dispatchEvent(new CustomEvent("email-read"));
                    } else {
                        console.error("Failed to mark email as read:", { emailId: email.id, error: result.error });
                    }
                })
                .catch((err) => {
                    console.error("Error marking email as read:", { emailId: email.id, error: err });
                });
        }
    }, [router, folder]);

    // Load email from URL if ID is present (from path or query)
    // Only run if emailId changed and email isn't already selected (prevents double-loading)
    // This handles direct URL navigation (e.g., sharing a link)
    useEffect(() => {
        // Skip if email is already selected (handleEmailSelect already handled it)
        if (emailId && emailId === selectedEmailRef.current?.id) {
            return;
        }

        if (emailId && emails?.emails) {
            const email = emails.emails.find(e => e.id === emailId);
            if (email) {
                // Update state directly without calling handleEmailSelect (to avoid URL update loop)
                setSelectedEmail(email);
                selectedEmailRef.current = email;
                
                // Set email content immediately (optimistic)
                const hasContent = email.body_html || email.body;
                if (hasContent) {
                    setEmailContent({
                        html: email.body_html || null,
                        text: email.body || null,
                    });
                    setLoadingContent(false);
                } else {
                    // No content, fetch it immediately
                    setLoadingContent(true);
                    fetchEmailContentAction(email.id)
                        .then((result) => {
                            if (result.success) {
                                setEmailContent({
                                    html: result.html || null,
                                    text: result.text || null,
                                });
                            } else {
                                console.warn("Failed to fetch email content:", result.error);
                                setEmailContent({ html: null, text: null });
                            }
                        })
                        .catch((err) => {
                            console.error("Failed to fetch email content:", err);
                            setEmailContent({ html: null, text: null });
                        })
                        .finally(() => {
                            setLoadingContent(false);
                        });
                }

                // Optimistic update for read status (after content is set)
                if (!email.read_at) {
                    setEmails(prev => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            emails: prev.emails.map(e => 
                                e.id === email.id ? { ...e, read_at: new Date().toISOString() } : e
                            )
                        };
                    });
                    markEmailAsReadAction({ emailId: email.id })
                        .then((result) => {
                            if (result.success) {
                                // Only update the specific email in the list, don't reload everything
                                setEmails(prev => {
                                    if (!prev) return prev;
                                    return {
                                        ...prev,
                                        emails: prev.emails.map(e => 
                                            e.id === email.id ? { ...e, read_at: new Date().toISOString() } : e
                                        )
                                    };
                                });
                                // Notify sidebar to refresh counts (but don't reload email list)
                                window.dispatchEvent(new CustomEvent("email-read"));
                            } else {
                                console.error("Failed to mark email as read:", { emailId: email.id, error: result.error });
                            }
                        })
                        .catch((err) => {
                            console.error("Error marking email as read:", { emailId: email.id, error: err });
                        });
                }
            } else if (!email) {
                // Email not in current list, try to fetch it
                startTransition(async () => {
                    try {
                        const { getEmailByIdAction } = await import("@/actions/email-actions");
                        const result = await getEmailByIdAction(emailId);
                        if (result.success && result.email) {
                            setSelectedEmail(result.email);
                            selectedEmailRef.current = result.email;
                            const emailData = result.email;
                            const hasContent = emailData.body_html || emailData.body;
                            if (hasContent) {
                                setEmailContent({
                                    html: emailData.body_html || null,
                                    text: emailData.body || null,
                                });
                                setLoadingContent(false);
                            } else {
                                setLoadingContent(true);
                                fetchEmailContentAction(emailId)
                                    .then((contentResult) => {
                                        if (contentResult.success) {
                                            setEmailContent({
                                                html: contentResult.html || null,
                                                text: contentResult.text || null,
                                            });
                                        } else {
                                            console.warn("Failed to fetch email content:", contentResult.error);
                                            setEmailContent({ html: null, text: null });
                                        }
                                    })
                                    .catch((err) => {
                                        console.error("Failed to fetch email content:", err);
                                        setEmailContent({ html: null, text: null });
                                    })
                                    .finally(() => {
                                        setLoadingContent(false);
                                    });
                            }
                        }
                    } catch (err) {
                        console.error("Failed to fetch email:", err);
                    }
                });
            }
        } else if (!emailId && selectedEmail) {
            // Clear selection if ID is removed from URL
            setSelectedEmail(null);
            selectedEmailRef.current = null;
            setEmailContent(null);
            setLoadingContent(false);
        }
    }, [emailId, emails?.emails]);

    // Handle refresh
    const handleRefresh = useCallback(() => {
        fetchEmails(true);
        toast.success("Refreshing emails...");
    }, [fetchEmails]);

    // Handle archive
    const handleArchive = useCallback(async (emailId: string) => {
        try {
            const result = await archiveEmailAction(emailId);
            if (result.success) {
                toast.success("Email archived");
                // Refresh emails list
                fetchEmails(false);
                // Notify sidebar to refresh counts
                window.dispatchEvent(new CustomEvent("email-read"));
            } else {
                toast.error("Failed to archive email", { 
                    description: result.error || "Unknown error" 
                });
            }
        } catch (err) {
            console.error("Failed to archive email:", err);
            toast.error("Failed to archive email", { 
                description: err instanceof Error ? err.message : "Unknown error" 
            });
        }
    }, [fetchEmails]);

    // Handle archive all
    const handleArchiveAll = useCallback(async () => {
        if (!emails?.emails || emails.emails.length === 0) {
            toast.info("No emails to archive");
            return;
        }

        const confirmMessage = `Are you sure you want to archive all ${emails.emails.length} email${emails.emails.length === 1 ? '' : 's'} in this folder?`;
        if (!confirm(confirmMessage)) {
            return;
        }

        try {
            setRefreshing(true);
            const result = await archiveAllEmailsAction(folder === "inbox" ? undefined : folder);
            if (result.success) {
                toast.success(`Archived ${result.archived} email${result.archived === 1 ? '' : 's'}`);
                // Refresh emails list
                fetchEmails(false);
                // Clear selection if email was archived
                setSelectedEmail(null);
                setEmailContent(null);
                // Notify sidebar to refresh counts
                window.dispatchEvent(new CustomEvent("email-read"));
            } else {
                toast.error("Failed to archive emails", { 
                    description: result.error || "Unknown error" 
                });
            }
        } catch (err) {
            console.error("Failed to archive all emails:", err);
            toast.error("Failed to archive emails", { 
                description: err instanceof Error ? err.message : "Unknown error" 
            });
        } finally {
            setRefreshing(false);
        }
    }, [emails, folder, fetchEmails]);

    // Handle toggle spam (similar to star toggle)
    const handleToggleSpam = useCallback(async (emailId: string) => {
        try {
            // Get the email being marked/unmarked as spam
            const emailToUpdate = emails?.emails.find(e => e.id === emailId);
            const currentTags = (emailToUpdate?.tags as string[]) || [];
            const isSpam = currentTags.includes("spam") || emailToUpdate?.category === "spam";
            const willBeSpam = !isSpam;
            
            // Optimistic update - update tags and category in email list
            setEmails(prev => {
                if (!prev) return prev;
                
                const updatedEmails = prev.emails.map(e => {
                    if (e.id === emailId) {
                        const newTags = willBeSpam 
                            ? [...currentTags, "spam"]
                            : currentTags.filter(tag => tag !== "spam");
                        return { 
                            ...e, 
                            tags: newTags.length > 0 ? newTags : null,
                            category: willBeSpam ? "spam" : null
                        };
                    }
                    return e;
                });
                
                // If viewing spam folder, filter the list immediately
                if (folder === "spam") {
                    const filteredEmails = updatedEmails.filter(e => {
                        const tags = (e.tags as string[]) || [];
                        return tags.includes("spam") || e.category === "spam";
                    });
                    
                    return {
                        ...prev,
                        emails: filteredEmails,
                        total: filteredEmails.length,
                    };
                }
                
                return {
                    ...prev,
                    emails: updatedEmails,
                };
            });
            
            // Update selected email if it's the one being toggled
            if (selectedEmail?.id === emailId) {
                const newTags = willBeSpam 
                    ? [...currentTags, "spam"]
                    : currentTags.filter(tag => tag !== "spam");
                setSelectedEmail({ 
                    ...selectedEmail, 
                    tags: newTags.length > 0 ? newTags : null,
                    category: willBeSpam ? "spam" : null
                });
                
                // If unmarking spam and viewing spam folder, clear selection
                if (folder === "spam" && !willBeSpam) {
                    setSelectedEmail(null);
                    setEmailContent(null);
                    const params = new URLSearchParams();
                    if (folder && folder !== "inbox") params.set("folder", folder);
                    router.replace(`/dashboard/communication/email?${params.toString()}`, { scroll: false });
                }
            }
            
            const result = await toggleSpamEmailAction(emailId);
            if (result.success) {
                toast.success(willBeSpam ? "Email marked as spam" : "Email removed from spam");
                // Notify sidebar to refresh counts immediately
                window.dispatchEvent(new CustomEvent("email-read"));
            } else {
                // Revert optimistic update on error
                fetchEmails(false);
                toast.error("Failed to update spam status", { 
                    description: result.error || "Unknown error" 
                });
            }
        } catch (err) {
            console.error("Failed to toggle spam:", err);
            // Revert optimistic update on error
            fetchEmails(false);
            toast.error("Failed to update spam status", { 
                description: err instanceof Error ? err.message : "Unknown error" 
            });
        }
    }, [fetchEmails, selectedEmail, folder, emails, router]);

    // Handle star (using tags)
    const handleStar = useCallback(async (emailId: string) => {
        try {
            // Get the email being starred/unstarred
            const emailToUpdate = emails?.emails.find(e => e.id === emailId);
            const currentTags = (emailToUpdate?.tags as string[]) || [];
            const isStarred = currentTags.includes("starred");
            const willBeStarred = !isStarred;
            
            // Optimistic update - update tags in email list
            setEmails(prev => {
                if (!prev) return prev;
                
                const updatedEmails = prev.emails.map(e => {
                    if (e.id === emailId) {
                        const newTags = willBeStarred 
                            ? [...currentTags, "starred"]
                            : currentTags.filter(tag => tag !== "starred");
                        return { ...e, tags: newTags.length > 0 ? newTags : null };
                    }
                    return e;
                });
                
                // If viewing starred folder, filter the list immediately
                if (folder === "starred") {
                    const filteredEmails = updatedEmails.filter(e => {
                        const tags = (e.tags as string[]) || [];
                        return tags.includes("starred");
                    });
                    
                    return {
                        ...prev,
                        emails: filteredEmails,
                        total: filteredEmails.length,
                    };
                }
                
                return {
                    ...prev,
                    emails: updatedEmails,
                };
            });
            
            // Update selected email if it's the one being starred
            if (selectedEmail?.id === emailId) {
                const newTags = willBeStarred 
                    ? [...currentTags, "starred"]
                    : currentTags.filter(tag => tag !== "starred");
                setSelectedEmail({ ...selectedEmail, tags: newTags.length > 0 ? newTags : null });
                
                // If unstarring and viewing starred folder, clear selection
                if (folder === "starred" && !willBeStarred) {
                    setSelectedEmail(null);
                    setEmailContent(null);
                    const params = new URLSearchParams();
                    if (folder && folder !== "inbox") params.set("folder", folder);
                    router.replace(`/dashboard/communication/email?${params.toString()}`, { scroll: false });
                }
            }
            
            const result = await toggleStarEmailAction(emailId);
            if (result.success) {
                // Notify sidebar to refresh counts immediately
                window.dispatchEvent(new CustomEvent("email-read"));
            } else {
                // Revert optimistic update on error
                fetchEmails(false);
                toast.error("Failed to star email", { 
                    description: result.error || "Unknown error" 
                });
            }
        } catch (err) {
            console.error("Failed to star email:", err);
            // Revert optimistic update on error
            fetchEmails(false);
            toast.error("Failed to star email", { 
                description: err instanceof Error ? err.message : "Unknown error" 
            });
        }
    }, [fetchEmails, selectedEmail, folder, emails, router]);

    return (
        <div className="flex h-full w-full flex-col overflow-hidden bg-sidebar">
            <div className="flex flex-1 overflow-hidden min-h-0 gap-2">
                {/* Email List Panel */}
                <div className="bg-card mb-1 w-full md:w-[400px] lg:w-[480px] shadow-sm lg:h-full lg:shadow-sm flex flex-col rounded-tr-2xl overflow-hidden">
                    <div className="w-full h-full flex flex-col">
                        <div className="sticky top-0 z-15 flex items-center justify-between gap-1.5 p-2 pb-0 transition-colors bg-card">
                            <div className="w-full">
                                <div className="grid grid-cols-12 gap-2 mt-1">
                                    <div className="col-span-12 flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={toggleSidebar}
                                            className="h-8 px-2 py-2 md:h-8 md:px-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 aria-busy:cursor-progress hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 shrink-0"
                                            title="Toggle sidebar"
                                        >
                                            <PanelLeft className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                        <div className="relative flex-1">
                                            <Input
                                                type="search"
                                                placeholder="Search emails..."
                                                value={searchInput}
                                                onChange={(e) => setSearchInput(e.target.value)}
                                                className="h-8 pl-9 pr-20 border-input bg-white dark:bg-[#141414] dark:border-none"
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
                                            className="col-span-1 h-8 px-2 py-2 md:h-8 md:px-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 aria-busy:cursor-progress hover:bg-accent hover:text-accent-foreground"
                                            title="Refresh"
                                        >
                                            <RefreshCw className={`h-4 w-4 text-muted-foreground ${refreshing ? 'animate-spin' : ''}`} />
                                        </Button>
                                        {/* Archive All button - only show for folders that can be archived */}
                                        {folder !== "archive" && folder !== "spam" && folder !== "trash" && folder !== "drafts" && emails?.emails && emails.emails.length > 0 && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={handleArchiveAll}
                                                disabled={refreshing}
                                                className="h-8 px-2 py-2 md:h-8 md:px-2 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 aria-busy:cursor-progress text-destructive-foreground [&_svg]:text-destructive-foreground"
                                                title="Archive all emails in this folder"
                                            >
                                                <Archive className="h-4 w-4 mr-1" />
                                                <span className="text-xs">Archive All</span>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#006FFE] relative z-5 h-0.5 w-full transition-opacity opacity-0"></div>

                        {/* Email Items */}
                        <div className="relative z-1 flex-1 overflow-hidden pt-0 min-h-0">
                            <div className="hide-link-indicator flex h-full w-full">
                                <div className="flex flex-1 flex-col" id="mail-list-scroll">
                                    <ScrollArea className="scrollbar-none flex-1 overflow-x-hidden h-full">
                                        {loading ? (
                                            <div className="flex items-center justify-center p-8">
                                                <div className="text-center">
                                                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                                                    <p className="text-sm text-muted-foreground">Loading emails...</p>
                                                </div>
                                            </div>
                                        ) : error ? (
                                            <div className="flex items-center justify-center p-8">
                                                <div className="text-center">
                                                    <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
                                                    <p className="text-sm text-destructive mb-2 font-medium">Failed to load emails</p>
                                                    <p className="text-xs text-muted-foreground mb-4">{error}</p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => fetchEmails()}
                                                    >
                                                        Try Again
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : emails?.emails?.length ? (
                                            <div className="min-h-[200px] px-2">
                                                {emails.emails.map((email) => {
                                                    const isSelected = selectedEmail?.id === email.id;
                                                    return (
                                                        <div
                                                            key={email.id}
                                                            className="select-none md:my-1"
                                                        >
                                                            <div
                                                                className={`hover:bg-accent group flex cursor-pointer flex-col items-start rounded-lg py-2 text-left text-sm transition-all hover:opacity-100 relative ${
                                                                    isSelected 
                                                                        ? 'bg-accent opacity-100' 
                                                                        : ''
                                                                } ${!email.read_at ? 'opacity-100' : 'opacity-60'}`}
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
                                                                            "h-4 w-4 transition-colors group-hover/star:text-yellow-500 dark:group-hover/star:text-yellow-400",
                                                                            email.tags && Array.isArray(email.tags) && email.tags.includes("starred")
                                                                                ? "fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400"
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
                                                                        title={email.tags && Array.isArray(email.tags) && email.tags.includes("spam") || email.category === "spam" ? "Remove from spam" : "Mark as spam"}
                                                                    >
                                                                        <AlertTriangle className={cn(
                                                                            "h-4 w-4 transition-colors group-hover/spam:text-orange-500 dark:group-hover/spam:text-orange-400",
                                                                            (email.tags && Array.isArray(email.tags) && email.tags.includes("spam")) || email.category === "spam"
                                                                                ? "fill-orange-500 text-orange-500 dark:fill-orange-400 dark:text-orange-400"
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
                                                                        <Archive className="h-4 w-4 text-muted-foreground transition-colors group-hover/archive:text-blue-500 dark:group-hover/archive:text-blue-400" />
                                                                    </Button>
                                                                </div>

                                                                {/* Email Card Content */}
                                                                <div className="relative flex w-full items-center justify-between gap-4 px-2">
                                                                    {/* Avatar */}
                                                                    <Avatar className="h-8 w-8 shrink-0 rounded-full border">
                                                                        <AvatarFallback className="bg-white dark:bg-[#373737] text-[#9F9F9D] font-bold text-xs">
                                                                            {email.from_address?.[0]?.toUpperCase() || "U"}
                                                                        </AvatarFallback>
                                                                    </Avatar>

                                                                    {/* Email Info */}
                                                                    <div className="flex w-full justify-between">
                                                                        <div className="w-full">
                                                                            {/* Sender Name + Time */}
                                                                            <div className="flex w-full flex-row items-center justify-between">
                                                                                <div className="flex flex-row items-center gap-[4px]">
                                                                                    <span className={`font-${!email.read_at ? 'bold' : 'bold'} text-md flex items-baseline gap-1 group-hover:opacity-100`}>
                                                                                        <div className="flex items-center gap-1">
                                                                                            <span className="line-clamp-1 overflow-hidden text-sm">
                                                                                                {email.from_address || email.from_name || "Unknown"}
                                                                                            </span>
                                                                                            {/* Unread Indicator */}
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

                                                                            {/* Subject */}
                                                                            <div className="flex justify-between">
                                                                                <p className="mt-1 line-clamp-1 w-[95%] min-w-0 overflow-hidden text-sm text-[#8C8C8C]">
                                                                                    {email.subject || "No subject"}
                                                                                </p>
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
                                                    <svg
                                                        width="64"
                                                        height="64"
                                                        viewBox="0 0 192 192"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="mx-auto mb-4 opacity-50"
                                                    >
                                                        <rect
                                                            width="192"
                                                            height="192"
                                                            rx="96"
                                                            fill="#141414"
                                                            fillOpacity="0.25"
                                                        />
                                                    </svg>
                                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                                        {searchQuery ? "No emails found" : "No emails yet"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {searchQuery 
                                                            ? "Try adjusting your search terms" 
                                                            : "Emails will appear here when received"}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email Detail - Right Panel (only shown when email is selected) */}
                {selectedEmail && (
                    <div className="bg-card mb-1 rounded-tl-2xl shadow-sm lg:h-full flex flex-col min-w-0 flex-1 overflow-hidden">
                        <div className="relative flex-1 min-h-0 flex flex-col">
                            <div className="bg-card relative flex flex-col overflow-hidden transition-all duration-300 h-full flex-1 min-h-0">
                                {/* Email Header Toolbar */}
                                <div className="sticky top-0 z-15 flex shrink-0 items-center justify-between gap-1.5 p-2 pb-0 transition-colors bg-card">
                                    <div className="flex flex-1 items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                const params = new URLSearchParams();
                                                if (folder && folder !== "inbox") params.set("folder", folder);
                                                router.push(`/dashboard/communication/email?${params.toString()}`, { scroll: false });
                                            }}
                                            className="h-8 w-8 p-0 hover:bg-accent/80 active:bg-accent transition-colors"
                                        >
                                            <X className="h-4 w-4 text-muted-foreground" />
                                            <span className="sr-only">Close</span>
                                        </Button>
                                        <Separator orientation="vertical" className="h-4 bg-border/60" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-accent/80 active:bg-accent transition-colors">
                                            <ReplyAll className="h-4 w-4 mr-1.5 text-muted-foreground" />
                                            <span className="text-sm leading-none font-medium">Reply all</span>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-accent/80 active:bg-accent transition-colors" title="Notes">
                                            <StickyNote className="h-4 w-4 text-muted-foreground" />
                                            <span className="sr-only">Notes</span>
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0 hover:bg-accent/80 active:bg-accent transition-colors group/star" 
                                            title={selectedEmail?.tags && Array.isArray(selectedEmail.tags) && selectedEmail.tags.includes("starred") ? "Unstar" : "Star"}
                                            onClick={() => selectedEmail && handleStar(selectedEmail.id)}
                                        >
                                            <Star className={cn(
                                                "h-4 w-4 transition-colors group-hover/star:text-yellow-500 dark:group-hover/star:text-yellow-400",
                                                selectedEmail?.tags && Array.isArray(selectedEmail.tags) && selectedEmail.tags.includes("starred")
                                                    ? "fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400"
                                                    : "text-muted-foreground"
                                            )} />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0 hover:bg-accent/80 active:bg-accent transition-colors group/spam" 
                                            title={selectedEmail?.tags && Array.isArray(selectedEmail.tags) && selectedEmail.tags.includes("spam") || selectedEmail?.category === "spam" ? "Remove from spam" : "Mark as spam"}
                                            onClick={() => selectedEmail && handleToggleSpam(selectedEmail.id)}
                                        >
                                            <AlertTriangle className={cn(
                                                "h-4 w-4 transition-colors group-hover/spam:text-orange-500 dark:group-hover/spam:text-orange-400",
                                                (selectedEmail?.tags && Array.isArray(selectedEmail.tags) && selectedEmail.tags.includes("spam")) || selectedEmail?.category === "spam"
                                                    ? "fill-orange-500 text-orange-500 dark:fill-orange-400 dark:text-orange-400"
                                                    : "text-muted-foreground"
                                            )} />
                                        </Button>
                                        <Button 
                                            variant="destructive" 
                                            size="sm" 
                                            className="h-8 w-8 p-0 text-destructive-foreground [&_svg]:text-destructive-foreground" 
                                            title="Archive"
                                            onClick={() => selectedEmail && handleArchive(selectedEmail.id)}
                                        >
                                            <Archive className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-accent/80 active:bg-accent transition-colors" title="More options">
                                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Email Content */}
                                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                                    <div className="relative overflow-hidden flex-1 h-full min-h-0 flex flex-col">
                                        {/* Email Header */}
                                        <TooltipProvider>
                                            <div className="border-b border-border/50 px-2 py-4 space-y-3">
                                                {/* Subject */}
                                                <h1 className="text-base font-semibold text-foreground">
                                                    {selectedEmail.subject || "No Subject"}
                                                </h1>
                                                
                                                {/* Sender Info Row */}
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
                                                        <div className="text-xs text-muted-foreground">
                                                            to {selectedEmail.to_address?.includes('@') 
                                                                ? (selectedEmail.to_address.split('@')[0] === 'me' ? 'you' : selectedEmail.to_address.split('@')[0])
                                                                : 'you'}
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
                                            
                                            {/* Reply Action Bar */}
                                            <div className="px-2 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="default" size="sm" className="h-9 px-4">
                                                        <Reply className="h-4 w-4 mr-2" />
                                                        Reply
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="h-9 px-4">
                                                        <ReplyAll className="h-4 w-4 mr-2" />
                                                        Reply All
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="h-9 px-4">
                                                        <Forward className="h-4 w-4 mr-2" />
                                                        Forward
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

