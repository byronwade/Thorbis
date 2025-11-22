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
    getEmailByIdAction,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    AlertTriangle,
    Archive,
    ChevronLeft,
    ChevronRight,
    Forward,
    Info,
    Inbox,
    Loader2,
    Lock,
    Mail,
    MoreHorizontal,
    Plus,
    RefreshCw,
    Reply,
    ReplyAll,
    Star,
    StickyNote,
    Trash2,
    X
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition, useMemo } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { EmailListItem } from "@/components/communication/email-list-item";
import { useOptimisticEmailActions } from "@/hooks/use-optimistic-email-actions";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

/**
 * Safely extract full email address from various formats
 * NEVER truncates - always returns the complete email address
 * 
 * Handles:
 * - String: "email@domain.com" or "Name <email@domain.com>"
 * - Array: ["email@domain.com"] or [{email: "email@domain.com", name: "Name"}]
 * - Object: {email: "email@domain.com", name: "Name"}
 * - Provider metadata fallback
 */
function extractFullEmailAddress(
    value: unknown,
    providerMetadata?: Record<string, unknown> | null,
    metadataKey?: string
): string {
    // Extract email from "Name <email@domain.com>" format
    const extractEmailFromFormat = (str: string): string => {
        const emailMatch = str.match(/<([^>]+)>/); // Extract email from <email@domain.com>
        if (emailMatch && emailMatch[1]) {
            return emailMatch[1].trim();
        }
        // If no angle brackets, check if it's a valid email
        if (str.includes("@") && str.length > 3) {
            return str.trim();
        }
        return str.trim();
    };

    // Try direct value first
    if (typeof value === "string" && value.length > 0) {
        const extracted = extractEmailFromFormat(value);
        if (extracted.length > 1 && extracted.includes("@")) {
            return extracted;
        }
    }

    // Handle array format
    if (Array.isArray(value) && value.length > 0) {
        const first = value[0];
        if (typeof first === "string" && first.length > 0) {
            const extracted = extractEmailFromFormat(first);
            if (extracted.length > 1 && extracted.includes("@")) {
                return extracted;
            }
        }
        if (first && typeof first === "object" && "email" in first) {
            const email = (first as { email?: string }).email;
            if (email && typeof email === "string" && email.length > 0) {
                return extractEmailFromFormat(email);
            }
        }
    }

    // Handle object format
    if (value && typeof value === "object" && !Array.isArray(value)) {
        const obj = value as Record<string, unknown>;
        if ("email" in obj && typeof obj.email === "string" && obj.email.length > 0) {
            return extractEmailFromFormat(obj.email);
        }
    }

    // Fallback to provider metadata if available
    if (providerMetadata && metadataKey) {
        const metadataValue = providerMetadata[metadataKey];
        if (metadataValue) {
            const extracted = extractFullEmailAddress(metadataValue);
            if (extracted && extracted.includes("@")) {
                return extracted;
            }
        }
    }

    // Try extracting from provider_metadata.data if available
    if (providerMetadata && typeof providerMetadata === "object") {
        const data = (providerMetadata as any).data;
        if (data && metadataKey && data[metadataKey]) {
            const extracted = extractFullEmailAddress(data[metadataKey]);
            if (extracted && extracted.includes("@")) {
                return extracted;
            }
        }
    }

    return "Unknown";
}

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
    const [searchInput, setSearchInput] = useState("");
    // Use debounced hook instead of manual setTimeout
    const searchQuery = useDebouncedValue(searchInput, 300);
    const selectedEmailRef = useRef<CompanyEmail | null>(null);
    const autoRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const realtimeChannelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null);
    const [companyId, setCompanyId] = useState<string | null>(null);
    const mostRecentEmailTimeRef = useRef<string | null>(null);
    const { toggleSidebar } = useSidebar();

    // Optimistic email actions hook
    const {
        emails: optimisticEmails,
        isPending: isOptimisticPending,
        updateEmails: updateOptimisticEmails,
        optimisticStar,
        optimisticToggleSpam,
        optimisticArchive,
        optimisticRead,
        optimisticAdd,
    } = useOptimisticEmailActions(emails);

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
                
                const updatedResult = {
                    ...result,
                    emails: normalizedEmails,
                };
                
                setEmails(updatedResult);
                // Update optimistic state immediately
                updateOptimisticEmails(updatedResult);
                
                // Debug logging
                console.log("📧 Fetched emails:", {
                    count: normalizedEmails.length,
                    folder,
                    firstEmail: normalizedEmails[0]?.subject,
                    total: updatedResult.total,
                });
                
                // Track most recent email time for incremental fetching
                if (normalizedEmails.length > 0) {
                    mostRecentEmailTimeRef.current = normalizedEmails[0].created_at;
                }
                
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
    }, [searchQuery, folder, updateOptimisticEmails]); // Removed selectedEmail from deps - using ref instead

    // Helper function to check if an email matches the current folder
    const emailMatchesFolder = useCallback((email: CompanyEmail & { is_archived?: boolean; deleted_at?: string | null; snoozed_until?: string | null; category?: string | null }, currentFolder: string): boolean => {
        const tags = (email.tags as string[]) || [];
        const isSpam = email.category === "spam" || tags.includes("spam");
        const isStarred = tags.includes("starred");
        const isArchived = (email as any).is_archived || false;
        const isDeleted = !!(email as any).deleted_at;
        const isDraft = email.status === "draft";
        const now = new Date().toISOString();
        const isSnoozed = (email as any).snoozed_until && (email as any).snoozed_until > now;

        switch (currentFolder) {
            case "inbox":
                return email.direction === "inbound" && !isArchived && !isDeleted && !isDraft && !isSnoozed && !isSpam;
            case "drafts":
                return isDraft && !isDeleted && !isSpam;
            case "sent":
                return email.direction === "outbound" && !isArchived && !isDeleted && !isDraft && !isSpam;
            case "archive":
                return isArchived && !isDeleted;
            case "snoozed":
                return isSnoozed && !isDeleted && !isSpam;
            case "spam":
                return isSpam && !isDeleted;
            case "trash":
            case "bin":
                return isDeleted;
            case "starred":
                return isStarred && !isDeleted && !isSpam;
            default:
                // Custom folder - check if tags include the folder name
                return tags.includes(currentFolder) && !isDeleted && !isSpam;
        }
    }, []);

    // Fetch company ID for real-time subscriptions
    useEffect(() => {
        async function fetchCompanyId() {
            const supabase = createClient();
            if (!supabase) return;

            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                    .from("company_memberships")
                    .select("company_id")
                    .eq("user_id", user.id)
                    .eq("status", "active")
                    .order("updated_at", { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (!error && data?.company_id) {
                    setCompanyId(data.company_id);
                }
            } catch (err) {
                console.error("Failed to fetch company ID:", err);
            }
        }
        fetchCompanyId();
    }, []);

    // Real-time subscription for new emails and updates
    useEffect(() => {
        if (!companyId) return;

        const supabase = createClient();
        if (!supabase) return;

        // Clean up existing subscription
        if (realtimeChannelRef.current) {
            supabase.removeChannel(realtimeChannelRef.current);
        }

        const channel = supabase
            .channel(`emails:company:${companyId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "communications",
                    filter: `company_id=eq.${companyId}`,
                },
                async (payload) => {
                    const newEmail = payload.new as any;
                    
                    // Only process email type communications
                    if (newEmail.type !== "email") return;
                    
                    // Check if email matches current folder
                    try {
                        const emailResult = await getEmailByIdAction(newEmail.id);
                        if (emailResult.success && emailResult.email) {
                            const email = emailResult.email;
                            
                            // Normalize to_address
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
                            const normalizedEmail = { ...email, to_address: parsedToAddress };
                            
                            // Only add if it matches the current folder and search query
                            if (emailMatchesFolder(normalizedEmail, folder)) {
                                // Check search query if present
                                if (!searchQuery || 
                                    normalizedEmail.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    normalizedEmail.from_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    normalizedEmail.body?.toLowerCase().includes(searchQuery.toLowerCase())
                                ) {
                                    // Add to the beginning of the list (newest first)
                                    setEmails(prev => {
                                        if (!prev) return prev;
                                        
                                        // Check if email already exists (prevent duplicates)
                                        if (prev.emails.some(e => e.id === normalizedEmail.id)) {
                                            return prev;
                                        }
                                        
                                        const updated = {
                                            ...prev,
                                            emails: [normalizedEmail, ...prev.emails],
                                            total: prev.total + 1,
                                        };
                                        
                                        // Update optimistic state too
                                        updateOptimisticEmails(updated);
                                        
                                        return updated;
                                    });
                                    
                                    // Update most recent email time
                                    if (!mostRecentEmailTimeRef.current || normalizedEmail.created_at > mostRecentEmailTimeRef.current) {
                                        mostRecentEmailTimeRef.current = normalizedEmail.created_at;
                                    }
                                    
                                    // Dispatch event to update sidebar counts
                                    window.dispatchEvent(new CustomEvent("email-read"));
                                }
                            }
                        }
                    } catch (err) {
                        console.error("Failed to fetch new email:", err);
                    }
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "communications",
                    filter: `company_id=eq.${companyId}`,
                },
                async (payload) => {
                    const updatedEmail = payload.new as any;
                    const oldEmail = payload.old as any;
                    
                    // Only process email type communications
                    if (updatedEmail.type !== "email") return;
                    
                    // Fetch full email data to get normalized format
                    try {
                        const emailResult = await getEmailByIdAction(updatedEmail.id);
                        if (emailResult.success && emailResult.email) {
                            const email = emailResult.email;
                            
                            // Normalize to_address
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
                            const normalizedEmail = { ...email, to_address: parsedToAddress };
                            
                            // Update emails list
                            setEmails(prev => {
                                if (!prev) return prev;
                                
                                const emailIndex = prev.emails.findIndex(e => e.id === normalizedEmail.id);
                                const emailExists = emailIndex !== -1;
                                const matchesFolder = emailMatchesFolder(normalizedEmail, folder);
                                
                                let updated;
                                
                                // If email exists in list
                                if (emailExists) {
                                    // If it no longer matches folder (e.g., was archived), remove it
                                    if (!matchesFolder) {
                                        updated = {
                                            ...prev,
                                            emails: prev.emails.filter(e => e.id !== normalizedEmail.id),
                                            total: Math.max(0, prev.total - 1),
                                        };
                                    } else {
                                        // Otherwise, update it in place
                                        const updatedEmails = [...prev.emails];
                                        updatedEmails[emailIndex] = normalizedEmail;
                                        
                                        updated = {
                                            ...prev,
                                            emails: updatedEmails,
                                        };
                                    }
                                } else if (matchesFolder) {
                                    // Email doesn't exist but now matches folder, add it
                                    // Check search query if present
                                    if (!searchQuery || 
                                        normalizedEmail.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        normalizedEmail.from_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        normalizedEmail.body?.toLowerCase().includes(searchQuery.toLowerCase())
                                    ) {
                                        updated = {
                                            ...prev,
                                            emails: [normalizedEmail, ...prev.emails],
                                            total: prev.total + 1,
                                        };
                                    } else {
                                        return prev; // Don't add if search doesn't match
                                    }
                                } else {
                                    // Email doesn't match folder - don't add it
                                    return prev;
                                }
                                
                                // Update optimistic state too
                                updateOptimisticEmails(updated);
                                
                                // Update selected email if it's the one being updated
                                if (selectedEmail?.id === normalizedEmail.id) {
                                    setSelectedEmail(normalizedEmail);
                                }
                                
                                return updated;
                            });
                            
                            // Dispatch event to update sidebar counts
                            window.dispatchEvent(new CustomEvent("email-read"));
                        }
                    } catch (err) {
                        console.error("Failed to fetch updated email:", err);
                    }
                }
            )
            .subscribe((status, err) => {
                if (status === "SUBSCRIBED") {
                    console.log("✅ Real-time email subscription active");
                } else if (status === "CHANNEL_ERROR") {
                    console.warn("⚠️ Real-time subscription channel error:", err);
                } else if (status === "TIMED_OUT") {
                    console.warn("⚠️ Real-time subscription timed out");
                }
                // CLOSED status is expected during cleanup/unmount - no need to log
            });

        realtimeChannelRef.current = channel;

        return () => {
            if (realtimeChannelRef.current) {
                supabase.removeChannel(realtimeChannelRef.current);
                realtimeChannelRef.current = null;
            }
        };
    }, [companyId, folder, searchQuery, emailMatchesFolder, selectedEmail, updateOptimisticEmails]);

    // Polling backup: Check for new emails every 60 seconds (reduced frequency for performance)
    // Only runs if real-time subscription might have missed something
    useEffect(() => {
        if (!companyId || !mostRecentEmailTimeRef.current) return;

        const pollForNewEmails = async () => {
            try {
                // Fetch only the latest 10 emails (smaller query for performance)
                const result = await getEmailsAction({
                    limit: 10,
                    offset: 0,
                    type: "all",
                    folder: folder === "inbox" ? undefined : folder,
                    search: searchQuery || undefined,
                    sortBy: "created_at",
                    sortOrder: "desc",
                });

                if (result.emails && result.emails.length > 0) {
                    // Find emails newer than our most recent
                    const newEmails = result.emails.filter(
                        email => !mostRecentEmailTimeRef.current || email.created_at > mostRecentEmailTimeRef.current
                    );

                    if (newEmails.length > 0) {
                        // Normalize to_address for new emails (memoize this)
                        const normalizedNewEmails = newEmails.map(email => {
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
                            return { ...email, to_address: parsedToAddress };
                        });

                        // Use optimistic add for instant UI updates
                        normalizedNewEmails.forEach(email => {
                            if (emailMatchesFolder(email, folder)) {
                                optimisticAdd(email);
                            }
                        });

                        // Also update regular state for consistency
                        setEmails(prev => {
                            if (!prev) return { emails: normalizedNewEmails, total: normalizedNewEmails.length, hasMore: false };
                            
                            const existingIds = new Set(prev.emails.map(e => e.id));
                            const uniqueNewEmails = normalizedNewEmails.filter(e => !existingIds.has(e.id));
                            
                            if (uniqueNewEmails.length === 0) return prev;
                            
                            // Sort by created_at desc and add to beginning, keep only latest 50
                            const allEmails = [...uniqueNewEmails, ...prev.emails]
                                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                .slice(0, 50);
                            
                            // Update most recent email time
                            if (allEmails.length > 0) {
                                mostRecentEmailTimeRef.current = allEmails[0].created_at;
                            }
                            
                            return {
                                ...prev,
                                emails: allEmails,
                                total: prev.total + uniqueNewEmails.length,
                            };
                        });
                        
                        // Dispatch event to update sidebar counts
                        window.dispatchEvent(new CustomEvent("email-read"));
                    }
                }
            } catch (err) {
                console.error("Failed to poll for new emails:", err);
            }
        };

        // Poll every 60 seconds (reduced from 30s for better performance)
        const interval = setInterval(pollForNewEmails, 60000);
        
        return () => clearInterval(interval);
    }, [companyId, folder, searchQuery, emailMatchesFolder, optimisticAdd]);

    // Initial fetch and refetch when folder or search changes
    useEffect(() => {
        fetchEmails();
    }, [folder, searchQuery, fetchEmails]);

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
            // Instant optimistic update
            optimisticRead(email.id);
            // Mark as read in background (don't wait, don't reload list)
            markEmailAsReadAction({ emailId: email.id })
                .then((result) => {
                    if (result.success) {
                        // Update the email in state
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
                        // Revert optimistic update on error
                        fetchEmails(false);
                    }
                })
                .catch((err) => {
                    console.error("Error marking email as read:", { emailId: email.id, error: err });
                    // Revert optimistic update on error
                    fetchEmails(false);
                });
        }
    }, [router, folder, optimisticRead, fetchEmails]);

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
                    // Instant optimistic update
                    optimisticRead(email.id);
                    // Mark as read in background
                    markEmailAsReadAction({ emailId: email.id })
                        .then((result) => {
                            if (result.success) {
                                // Update the email in state
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
                                // Revert optimistic update on error
                                fetchEmails(false);
                            }
                        })
                        .catch((err) => {
                            console.error("Error marking email as read:", { emailId: email.id, error: err });
                            // Revert optimistic update on error
                            fetchEmails(false);
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
    }, [emailId, emails?.emails, optimisticRead, fetchEmails]);

    // Handle refresh
    const handleRefresh = useCallback(() => {
        fetchEmails(true);
        toast.success("Refreshing emails...");
    }, [fetchEmails]);

    // Handle archive - with optimistic updates
    const handleArchive = useCallback(async (emailId: string) => {
        try {
            // Instant optimistic update - remove from list immediately
            optimisticArchive(emailId);
            
            // Clear selection if archived email was selected - do this immediately
            if (selectedEmail?.id === emailId) {
                setSelectedEmail(null);
                setEmailContent(null);
                const params = new URLSearchParams();
                if (folder && folder !== "inbox") params.set("folder", folder);
                router.replace(`/dashboard/communication/email?${params.toString()}`, { scroll: false });
            }
            
            // Execute server action in background
            const result = await archiveEmailAction(emailId);
            if (result.success) {
                // Double-check: ensure email is removed from list if it somehow got re-added
                setEmails(prev => {
                    if (!prev) return prev;
                    const stillExists = prev.emails.some(e => e.id === emailId);
                    if (stillExists) {
                        // Remove it and update optimistic state
                        const updated = {
                            ...prev,
                            emails: prev.emails.filter(e => e.id !== emailId),
                            total: Math.max(0, prev.total - 1),
                        };
                        updateOptimisticEmails(updated);
                        return updated;
                    }
                    return prev;
                });
                
                // Notify sidebar to refresh counts
                window.dispatchEvent(new CustomEvent("email-read"));
            } else {
                // Revert optimistic update on error
                fetchEmails(false);
                toast.error("Failed to archive email", { 
                    description: result.error || "Unknown error" 
                });
            }
        } catch (err) {
            console.error("Failed to archive email:", err);
            // Revert optimistic update on error
            fetchEmails(false);
            toast.error("Failed to archive email", { 
                description: err instanceof Error ? err.message : "Unknown error" 
            });
        }
    }, [optimisticArchive, selectedEmail, folder, router, fetchEmails]);

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

    // Handle toggle spam - with optimistic updates
    const handleToggleSpam = useCallback(async (emailId: string) => {
        try {
            // Calculate the updated email state BEFORE optimistic update
            // Read from both optimistic and regular state to get current email
            const currentEmail = optimisticEmails?.emails.find(e => e.id === emailId) 
                || emails?.emails.find(e => e.id === emailId) 
                || selectedEmail;
            const currentTags = (currentEmail?.tags as string[]) || [];
            const isSpam = currentTags.includes("spam") || currentEmail?.category === "spam";
            
            // Instant optimistic update - update list immediately
            optimisticToggleSpam(emailId);
            
            // Update selected email immediately if it's the one being toggled
            if (selectedEmail?.id === emailId && currentEmail) {
                const updatedTags = isSpam 
                    ? currentTags.filter(tag => tag !== "spam")
                    : [...currentTags, "spam"];
                
                const updatedEmail: CompanyEmail = {
                    ...currentEmail,
                    tags: updatedTags.length > 0 ? updatedTags : undefined,
                    category: isSpam ? null : "spam",
                };
                
                setSelectedEmail(updatedEmail);
                
                // If unmarking spam and viewing spam folder, clear selection
                if (folder === "spam" && isSpam) {
                    setSelectedEmail(null);
                    setEmailContent(null);
                    const params = new URLSearchParams();
                    if (folder && folder !== "inbox") params.set("folder", folder);
                    router.replace(`/dashboard/communication/email?${params.toString()}`, { scroll: false });
                }
            }
            
            // Execute server action in background
            const result = await toggleSpamEmailAction(emailId);
            if (result.success) {
                // Update both emails and optimistic state immediately (don't wait for real-time)
                setEmails(prev => {
                    if (!prev) return prev;
                    
                    const emailIndex = prev.emails.findIndex(e => e.id === emailId);
                    if (emailIndex === -1) return prev;
                    
                    const email = prev.emails[emailIndex];
                    const tags = (email.tags as string[]) || [];
                    const isCurrentlySpam = tags.includes("spam") || email.category === "spam";
                    
                    const updatedTags = isCurrentlySpam
                        ? tags.filter(tag => tag !== "spam")
                        : [...tags, "spam"];
                    
                    const updatedEmail: CompanyEmail = {
                        ...email,
                        tags: updatedTags.length > 0 ? updatedTags : undefined,
                        category: isCurrentlySpam ? null : "spam",
                    };
                    
                    const updatedEmails = [...prev.emails];
                    updatedEmails[emailIndex] = updatedEmail;
                    
                    // Check if email still matches folder after update
                    const matchesFolder = emailMatchesFolder(updatedEmail, folder);
                    
                    let updated;
                    if (!matchesFolder) {
                        // Remove from list if it no longer matches folder
                        updated = {
                            ...prev,
                            emails: prev.emails.filter(e => e.id !== emailId),
                            total: Math.max(0, prev.total - 1),
                        };
                    } else {
                        updated = {
                            ...prev,
                            emails: updatedEmails,
                        };
                    }
                    
                    // Also update optimistic state with the same data
                    updateOptimisticEmails(updated);
                    
                    return updated;
                });
                
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
    }, [optimisticToggleSpam, optimisticEmails, emails, selectedEmail, folder, router, fetchEmails]);

    // Handle star (using tags) - with optimistic updates
    const handleStar = useCallback(async (emailId: string) => {
        try {
            // Calculate the updated email state BEFORE optimistic update
            // Read from both optimistic and regular state to get current email
            const currentEmail = optimisticEmails?.emails.find(e => e.id === emailId) 
                || emails?.emails.find(e => e.id === emailId) 
                || selectedEmail;
            const currentTags = (currentEmail?.tags as string[]) || [];
            const isStarred = currentTags.includes("starred");
            
            // Instant optimistic update - update list immediately
            optimisticStar(emailId);
            
            // Update selected email immediately if it's the one being starred
            if (selectedEmail?.id === emailId && currentEmail) {
                const updatedTags = isStarred
                    ? currentTags.filter(tag => tag !== "starred")
                    : [...currentTags, "starred"];
                
                const updatedEmail: CompanyEmail = {
                    ...currentEmail,
                    tags: updatedTags.length > 0 ? updatedTags : undefined,
                };
                
                setSelectedEmail(updatedEmail);
                
                // If unstarring and viewing starred folder, clear selection
                if (folder === "starred" && isStarred) {
                    setSelectedEmail(null);
                    setEmailContent(null);
                    const params = new URLSearchParams();
                    if (folder && folder !== "inbox") params.set("folder", folder);
                    router.replace(`/dashboard/communication/email?${params.toString()}`, { scroll: false });
                }
            }
            
            // Execute server action in background
            const result = await toggleStarEmailAction(emailId);
            if (result.success) {
                // Update the email in local state immediately (don't wait for real-time)
                setEmails(prev => {
                    if (!prev) return prev;
                    
                    const emailIndex = prev.emails.findIndex(e => e.id === emailId);
                    if (emailIndex === -1) return prev;
                    
                    const email = prev.emails[emailIndex];
                    const tags = (email.tags as string[]) || [];
                    const isCurrentlyStarred = tags.includes("starred");
                    
                    const updatedTags = isCurrentlyStarred
                        ? tags.filter(tag => tag !== "starred")
                        : [...tags, "starred"];
                    
                    const updatedEmail: CompanyEmail = {
                        ...email,
                        tags: updatedTags.length > 0 ? updatedTags : undefined,
                    };
                    
                    const updatedEmails = [...prev.emails];
                    updatedEmails[emailIndex] = updatedEmail;
                    
                    // Check if email still matches folder after update
                    const matchesFolder = emailMatchesFolder(updatedEmail, folder);
                    
                    let updated;
                    if (!matchesFolder) {
                        // Remove from list if it no longer matches folder (e.g., unstarred while viewing starred)
                        updated = {
                            ...prev,
                            emails: prev.emails.filter(e => e.id !== emailId),
                            total: Math.max(0, prev.total - 1),
                        };
                    } else {
                        updated = {
                            ...prev,
                            emails: updatedEmails,
                        };
                    }
                    
                    // Also update optimistic state with the same data
                    updateOptimisticEmails(updated);
                    
                    return updated;
                });
                
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
    }, [optimisticStar, optimisticEmails, emails, selectedEmail, folder, router, fetchEmails]);

    // Get empty state config based on folder
    const getEmptyStateConfig = useCallback(() => {
        const folderConfig = {
            inbox: {
                icon: Inbox,
                title: searchQuery ? "No emails found" : "No emails in inbox",
                description: searchQuery 
                    ? "Try adjusting your search terms to find emails"
                    : "Incoming emails will appear here when you receive them"
            },
            drafts: {
                icon: StickyNote,
                title: searchQuery ? "No drafts found" : "No drafts",
                description: searchQuery 
                    ? "Try adjusting your search terms"
                    : "Draft emails you create will be saved here"
            },
            sent: {
                icon: Mail,
                title: searchQuery ? "No sent emails found" : "No sent emails",
                description: searchQuery 
                    ? "Try adjusting your search terms"
                    : "Emails you send will appear here"
            },
            archive: {
                icon: Archive,
                title: searchQuery ? "No archived emails found" : "No archived emails",
                description: searchQuery 
                    ? "Try adjusting your search terms"
                    : "Archived emails will appear here"
            },
            snoozed: {
                icon: RefreshCw,
                title: searchQuery ? "No snoozed emails found" : "No snoozed emails",
                description: searchQuery 
                    ? "Try adjusting your search terms"
                    : "Emails you snooze will appear here"
            },
            spam: {
                icon: AlertTriangle,
                title: searchQuery ? "No spam emails found" : "No spam emails",
                description: searchQuery 
                    ? "Try adjusting your search terms"
                    : "Emails marked as spam will appear here"
            },
            trash: {
                icon: X,
                title: searchQuery ? "No deleted emails found" : "No deleted emails",
                description: searchQuery 
                    ? "Try adjusting your search terms"
                    : "Deleted emails will appear here"
            },
            starred: {
                icon: Star,
                title: searchQuery ? "No starred emails found" : "No starred emails",
                description: searchQuery 
                    ? "Try adjusting your search terms"
                    : "Star emails to keep them here for easy access"
            }
        };
        
        return folderConfig[folder as keyof typeof folderConfig] || folderConfig.inbox;
    }, [folder, searchQuery]);

    // Memoized email list to prevent unnecessary re-renders
    // Use optimisticEmails if available, fallback to emails if optimistic state is empty
    // Also filter to ensure archived emails don't show in inbox
    const emailsToDisplay = useMemo(() => {
        const emailList = optimisticEmails?.emails && optimisticEmails.emails.length > 0 
            ? optimisticEmails.emails 
            : (emails?.emails || []);
        
        // Safety filter: ensure emails match current folder (double-check archived status)
        if (folder === "inbox") {
            return emailList.filter(email => {
                const isArchived = (email as any).is_archived || false;
                return !isArchived;
            });
        }
        
        return emailList;
    }, [optimisticEmails?.emails, emails?.emails, folder]);
    
    const emailListItems = useMemo(() => {
        if (!emailsToDisplay || emailsToDisplay.length === 0) {
            return [];
        }
        return emailsToDisplay.map((email) => (
            <EmailListItem
                key={email.id}
                email={email}
                isSelected={selectedEmail?.id === email.id}
                onSelect={handleEmailSelect}
                onStar={handleStar}
                onToggleSpam={handleToggleSpam}
                onArchive={handleArchive}
            />
        ));
    }, [emailsToDisplay, selectedEmail?.id, handleEmailSelect, handleStar, handleToggleSpam, handleArchive]);

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
                                        ) : emailListItems && emailListItems.length > 0 ? (
                                            <div className="min-h-[200px] px-2">
                                                {emailListItems}
                                            </div>
                                        ) : (
                                            (() => {
                                                const emptyConfig = getEmptyStateConfig();
                                                const EmptyIcon = emptyConfig.icon;
                                                
                                                return (
                                                    <div className="flex items-center justify-center p-8 min-h-[400px]">
                                                        <div className="text-center space-y-3 max-w-sm mx-auto">
                                                            <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                                                                <EmptyIcon className="h-8 w-8 text-muted-foreground" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <h3 className="text-lg font-semibold text-foreground">{emptyConfig.title}</h3>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {emptyConfig.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()
                                        )}
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email Detail - Right Panel */}
                <div className="bg-card mb-1 rounded-tl-2xl shadow-sm lg:h-full flex flex-col min-w-0 flex-1 overflow-hidden">
                    <div className="relative flex-1 min-h-0 flex flex-col">
                        {selectedEmail ? (
                            <>
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
                                                            {(() => {
                                                                const customer = selectedEmail.customer as any;
                                                                const displayName = customer?.display_name || 
                                                                                   (customer?.first_name && customer?.last_name 
                                                                                    ? `${customer.first_name} ${customer.last_name}` 
                                                                                    : null) ||
                                                                                   selectedEmail.from_name ||
                                                                                   (typeof selectedEmail.from_address === 'string' ? selectedEmail.from_address : selectedEmail.from_address?.[0] || "");
                                                                return displayName?.[0]?.toUpperCase() || "U";
                                                            })()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-sm text-foreground">
                                                                {(() => {
                                                                    const customer = selectedEmail.customer as any;
                                                                    if (customer?.display_name) {
                                                                        return customer.display_name;
                                                                    }
                                                                    if (customer?.first_name && customer?.last_name) {
                                                                        return `${customer.first_name} ${customer.last_name}`;
                                                                    }
                                                                    if (selectedEmail.from_name) {
                                                                        return selectedEmail.from_name;
                                                                    }
                                                                    const fromAddr = typeof selectedEmail.from_address === 'string' 
                                                                        ? selectedEmail.from_address 
                                                                        : (Array.isArray(selectedEmail.from_address) ? selectedEmail.from_address[0] : selectedEmail.from_address);
                                                                    return fromAddr || "Unknown";
                                                                })()}
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
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                                                    title="View email details"
                                                                >
                                                                    <Info className="h-4 w-4" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-[420px]" align="end">
                                                                <div className="space-y-1 text-sm">
                                                                    {/* From */}
                                                                    {(() => {
                                                                        const fromEmail = extractFullEmailAddress(
                                                                            selectedEmail.from_address,
                                                                            selectedEmail.provider_metadata,
                                                                            "from"
                                                                        );
                                                                        const fromName = selectedEmail.from_name;
                                                                        return (
                                                                            <div className="flex">
                                                                                <span className="w-24 text-end text-gray-500">From:</span>
                                                                                <div className="ml-3">
                                                                                    {fromName && fromName.length > 0 && fromName !== fromEmail && (
                                                                                        <span className="text-muted-foreground text-nowrap pr-1 font-bold">
                                                                                            {fromName}
                                                                                        </span>
                                                                                    )}
                                                                                    <span className="text-muted-foreground text-nowrap break-all">
                                                                                        {fromEmail}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })()}

                                                                    {/* To */}
                                                                    {(() => {
                                                                        const toEmail = extractFullEmailAddress(
                                                                            selectedEmail.to_address,
                                                                            selectedEmail.provider_metadata,
                                                                            "to"
                                                                        );
                                                                        return (
                                                                            <div className="flex">
                                                                                <span className="w-24 text-nowrap text-end text-gray-500">To:</span>
                                                                                <span className="text-muted-foreground ml-3 text-nowrap break-all">
                                                                                    {toEmail}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })()}

                                                                    {/* Reply To */}
                                                                    {(() => {
                                                                        const replyToEmail = extractFullEmailAddress(
                                                                            selectedEmail.reply_to,
                                                                            selectedEmail.provider_metadata,
                                                                            "reply_to"
                                                                        );
                                                                        // Only show if we have a valid email (not "Unknown")
                                                                        if (replyToEmail && replyToEmail !== "Unknown" && replyToEmail.includes("@")) {
                                                                            return (
                                                                                <div className="flex">
                                                                                    <span className="w-24 text-nowrap text-end text-gray-500">Reply To:</span>
                                                                                    <span className="text-muted-foreground ml-3 text-nowrap break-all">
                                                                                        {replyToEmail}
                                                                                    </span>
                                                                                </div>
                                                                            );
                                                                        }
                                                                        return null;
                                                                    })()}

                                                                    {/* Date */}
                                                                    <div className="flex">
                                                                        <span className="w-24 text-end text-gray-500">Date:</span>
                                                                        <span className="text-muted-foreground ml-3 text-nowrap">
                                                                            {new Date(selectedEmail.created_at).toLocaleString('en-US', {
                                                                                month: 'short',
                                                                                day: 'numeric',
                                                                                year: 'numeric',
                                                                                hour: 'numeric',
                                                                                minute: '2-digit',
                                                                                second: '2-digit',
                                                                                hour12: true
                                                                            })}
                                                                        </span>
                                                                    </div>

                                                                    {/* Mailed-By */}
                                                                    {(() => {
                                                                        const mailedByEmail = extractFullEmailAddress(
                                                                            selectedEmail.from_address,
                                                                            selectedEmail.provider_metadata,
                                                                            "from"
                                                                        );
                                                                        return (
                                                                            <div className="flex">
                                                                                <span className="w-24 text-end text-gray-500">Mailed-By:</span>
                                                                                <span className="text-muted-foreground ml-3 text-nowrap break-all">
                                                                                    {mailedByEmail}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })()}

                                                                    {/* Signed-By */}
                                                                    {(() => {
                                                                        const signedByEmail = extractFullEmailAddress(
                                                                            selectedEmail.from_address,
                                                                            selectedEmail.provider_metadata,
                                                                            "from"
                                                                        );
                                                                        return (
                                                                            <div className="flex">
                                                                                <span className="w-24 text-end text-gray-500">Signed-By:</span>
                                                                                <span className="text-muted-foreground ml-3 text-nowrap break-all">
                                                                                    {signedByEmail}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })()}

                                                                    {/* Security */}
                                                                    <div className="flex items-center">
                                                                        <span className="w-24 text-end text-gray-500">Security:</span>
                                                                        <div className="text-muted-foreground ml-3 flex items-center gap-1">
                                                                            {selectedEmail.category === 'spam' || (selectedEmail.tags && Array.isArray(selectedEmail.tags) && selectedEmail.tags.includes('spam')) ? (
                                                                                <>
                                                                                    <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                                                                    <span className="text-orange-600 dark:text-orange-400">Marked as spam</span>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                                                    <span>Standard encryption (TLS)</span>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
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
                </>
            ) : (
                /* Empty State - No Email Selected */
                <div className="flex flex-col items-center justify-center h-full px-4 py-8">
                    <div className="text-center space-y-4 max-w-md">
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 192 192"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mx-auto opacity-50"
                        >
                            <rect
                                width="192"
                                height="192"
                                rx="96"
                                fill="#141414"
                                fillOpacity="0.25"
                            />
                        </svg>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">No email selected</h3>
                            <p className="text-sm text-muted-foreground">
                                Select an email from the list to view its contents, or create a new email to get started.
                            </p>
                        </div>
                        <Button
                            onClick={() => {
                                if (typeof window !== "undefined") {
                                    window.dispatchEvent(new CustomEvent("open-recipient-selector", { 
                                        detail: { type: "email" } 
                                    }));
                                }
                            }}
                            className="mt-4"
                            size="lg"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create new email
                        </Button>
                    </div>
                </div>
            )}
                    </div>
                </div>
            </div>
        </div>
    );
}

