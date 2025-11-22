/**
 * SMS Communication Page
 * 
 * Single page for all SMS folders with filter-based navigation
 * Route: /dashboard/communication/sms?folder=inbox
 * 
 * Shows SMS list on left, detail panel on right when SMS is selected
 */

"use client";

import type { CompanySms, GetSmsResult } from "@/actions/sms-actions";
import {
    getSmsAction,
    getSmsByIdAction,
    getSmsConversationAction,
    markSmsAsReadAction,
    markSmsConversationAsReadAction,
} from "@/actions/sms-actions";
import { sendTextMessage } from "@/actions/telnyx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SmsMessageInput } from "@/components/communication/sms-message-input";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeft } from "lucide-react";
import {
    AlertTriangle,
    Archive,
    Loader2,
    MessageSquare,
    MoreHorizontal,
    Paperclip,
    RefreshCw,
    Reply,
    Send,
    Star,
    StickyNote,
    Trash,
    X
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams, useParams } from "next/navigation";

export default function SmsPage() {
    const router = useRouter();
    const { toggleSidebar } = useSidebar();
    const searchParams = useSearchParams();
    const params = useParams();
    const folder = (searchParams.get("folder") as string) || "inbox";
    // Get ID from either path params ([id] route) or query params
    const smsIdFromPath = params?.id as string | undefined;
    const smsIdFromQuery = searchParams.get("id");
    const smsId = smsIdFromPath || smsIdFromQuery || null;
    const [isPending, startTransition] = useTransition();
    const [sms, setSms] = useState<GetSmsResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedSms, setSelectedSms] = useState<CompanySms | null>(null);
    const [conversationMessages, setConversationMessages] = useState<CompanySms[]>([]);
    const [loadingConversation, setLoadingConversation] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [messageInput, setMessageInput] = useState("");
    const [sendingMessage, setSendingMessage] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const selectedSmsRef = useRef<CompanySms | null>(null);
    const conversationScrollRef = useRef<HTMLDivElement>(null);

    // Fetch SMS messages function with optimistic loading
    const fetchSms = useCallback(async (showRefreshing = false) => {
        if (showRefreshing) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);
        
        startTransition(async () => {
            try {
                const result = await getSmsAction({ 
                    limit: 50, 
                    offset: 0,
                    type: "all",
                    folder: folder === "inbox" ? undefined : folder,
                    search: searchQuery || undefined,
                    sortBy: "created_at",
                    sortOrder: "desc"
                });
                
                setSms(result);
                
                // Update selected SMS if it still exists (preserve selection)
                const currentSelected = selectedSmsRef.current;
                if (currentSelected) {
                    const updatedSms = result.sms.find(s => s.id === currentSelected.id);
                    if (updatedSms) {
                        setSelectedSms(updatedSms);
                        selectedSmsRef.current = updatedSms;
                    } else {
                        setSelectedSms(null);
                        selectedSmsRef.current = null;
                        setConversationMessages([]);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch SMS:", err);
                const errorMessage = err instanceof Error ? err.message : "Failed to load SMS";
                setError(errorMessage);
                toast.error("Failed to load SMS", { description: errorMessage });
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        });
    }, [searchQuery, folder]);

    // Initial fetch and refetch when folder or search changes
    useEffect(() => {
        fetchSms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [folder, searchQuery]); // Removed fetchSms from deps to prevent infinite loop

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

    // Fetch conversation messages for a phone number
    const fetchConversation = useCallback(async (phoneNumber: string) => {
        if (!phoneNumber) return;
        
        setLoadingConversation(true);
        try {
            const result = await getSmsConversationAction(phoneNumber);
            if (result.success && result.messages) {
                setConversationMessages(result.messages);
                
                // Mark all unread messages in conversation as read
                const unreadMessages = result.messages.filter(msg => !msg.read_at && msg.direction === "inbound");
                if (unreadMessages.length > 0) {
                    // Optimistically update UI
                    setConversationMessages(prev => prev.map(msg => 
                        !msg.read_at && msg.direction === "inbound" 
                            ? { ...msg, read_at: new Date().toISOString() }
                            : msg
                    ));
                    
                    // Update database
                    markSmsConversationAsReadAction(phoneNumber)
                        .then((result) => {
                            if (result.success) {
                                // Update conversation messages optimistically (don't reload list)
                                setConversationMessages(prev => prev.map(msg => 
                                    !msg.read_at && msg.direction === "inbound" 
                                        ? { ...msg, read_at: new Date().toISOString() }
                                        : msg
                                ));
                                // Update SMS list optimistically (don't reload)
                                setSms(prev => {
                                    if (!prev) return prev;
                                    return {
                                        ...prev,
                                        sms: prev.sms.map(s => 
                                            !s.read_at && s.direction === "inbound" && 
                                            (s.from_address === phoneNumber || s.to_address === phoneNumber)
                                                ? { ...s, read_at: new Date().toISOString() }
                                                : s
                                        )
                                    };
                                });
                                // Notify sidebar to refresh counts (but don't reload SMS list)
                                window.dispatchEvent(new CustomEvent("sms-read"));
                            } else {
                                console.error("Failed to mark conversation as read:", result.error);
                            }
                        })
                        .catch((err) => {
                            console.error("Error marking conversation as read:", err);
                        });
                }
                
                // Scroll to bottom after messages load
                setTimeout(() => {
                    if (conversationScrollRef.current) {
                        conversationScrollRef.current.scrollTop = conversationScrollRef.current.scrollHeight;
                    }
                }, 100);
            }
        } catch (err) {
            console.error("Failed to fetch conversation:", err);
            toast.error("Failed to load conversation");
        } finally {
            setLoadingConversation(false);
        }
    }, []);

    // Handle SMS selection - update URL but stay on same page (no refresh)
    const handleSmsSelect = useCallback((sms: CompanySms) => {
        // Optimistic: Update state immediately (no waiting for navigation)
        setSelectedSms(sms);
        selectedSmsRef.current = sms;
        
        // Update URL using replace (not push) to avoid page refresh
        const queryParams = new URLSearchParams();
        if (folder && folder !== "inbox") queryParams.set("folder", folder);
        queryParams.set("id", sms.id);
        
        router.replace(`/dashboard/communication/sms?${queryParams.toString()}`, { scroll: false });
        
        // Fetch conversation thread immediately (this shows the messages)
        const phoneNumber = sms.direction === "inbound" ? sms.from_address : sms.to_address;
        if (phoneNumber) {
            fetchConversation(phoneNumber);
        }

        // Optimistic update for read status (after conversation is loading)
        if (!sms.read_at) {
            setSms(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    sms: prev.sms.map(s => 
                        s.id === sms.id ? { ...s, read_at: new Date().toISOString() } : s
                    )
                };
            });
            // Mark as read in background (don't wait, don't reload list)
            markSmsAsReadAction({ smsId: sms.id })
                .then((success) => {
                    if (success) {
                        // Only update the specific SMS in the list, don't reload everything
                        setSms(prev => {
                            if (!prev) return prev;
                            return {
                                ...prev,
                                sms: prev.sms.map(s => 
                                    s.id === sms.id ? { ...s, read_at: new Date().toISOString() } : s
                                )
                            };
                        });
                        // Notify sidebar to refresh counts (but don't reload SMS list)
                        window.dispatchEvent(new CustomEvent("sms-read"));
                    } else {
                        console.error("Failed to mark SMS as read:", sms.id);
                    }
                })
                .catch((err) => {
                    console.error("Error marking SMS as read:", err);
                });
        }
    }, [router, folder, fetchConversation]);

    // Load SMS from URL if ID is present (from path or query)
    // Only run if smsId changed and SMS isn't already selected (prevents double-loading)
    // This handles direct URL navigation (e.g., sharing a link)
    useEffect(() => {
        // Skip if SMS is already selected (handleSmsSelect already handled it)
        if (smsId && smsId === selectedSmsRef.current?.id) {
            return;
        }

        if (smsId && sms?.sms) {
            const smsMessage = sms.sms.find(s => s.id === smsId);
            if (smsMessage) {
                // Update state directly without calling handleSmsSelect (to avoid URL update loop)
                setSelectedSms(smsMessage);
                selectedSmsRef.current = smsMessage;
                
                // Fetch conversation thread immediately (this shows the messages)
                const phoneNumber = smsMessage.direction === "inbound" ? smsMessage.from_address : smsMessage.to_address;
                if (phoneNumber) {
                    fetchConversation(phoneNumber);
                }

                // Optimistic update for read status (after conversation is loading)
                if (!smsMessage.read_at) {
                    setSms(prev => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            sms: prev.sms.map(s => 
                                s.id === smsMessage.id ? { ...s, read_at: new Date().toISOString() } : s
                            )
                        };
                    });
                    markSmsAsReadAction({ smsId: smsMessage.id })
                        .then((success) => {
                            if (success) {
                                // Only update the specific SMS in the list, don't reload everything
                                setSms(prev => {
                                    if (!prev) return prev;
                                    return {
                                        ...prev,
                                        sms: prev.sms.map(s => 
                                            s.id === smsMessage.id ? { ...s, read_at: new Date().toISOString() } : s
                                        )
                                    };
                                });
                                // Notify sidebar to refresh counts (but don't reload SMS list)
                                window.dispatchEvent(new CustomEvent("sms-read"));
                            } else {
                                console.error("Failed to mark SMS as read:", smsMessage.id);
                            }
                        })
                        .catch((err) => {
                            console.error("Error marking SMS as read:", err);
                        });
                }
            } else if (!smsMessage) {
                startTransition(async () => {
                    try {
                        const result = await getSmsByIdAction(smsId);
                        if (result.success && result.sms) {
                            setSelectedSms(result.sms);
                            selectedSmsRef.current = result.sms;
                            
                            // Fetch conversation thread
                            const phoneNumber = result.sms.direction === "inbound" ? result.sms.from_address : result.sms.to_address;
                            if (phoneNumber) {
                                fetchConversation(phoneNumber);
                            }
                        }
                    } catch (err) {
                        console.error("Failed to fetch SMS:", err);
                    }
                });
            }
        } else if (!smsId && selectedSms) {
            setSelectedSms(null);
            selectedSmsRef.current = null;
            setConversationMessages([]);
        }
    }, [smsId, sms?.sms, fetchConversation]);

    const handleRefresh = useCallback(() => {
        fetchSms(true);
        toast.success("Refreshing SMS...");
    }, [fetchSms]);

    const handleDelete = useCallback(async (smsId: string) => {
        if (!confirm("Are you sure you want to delete this SMS?")) {
            return;
        }

        try {
            toast.success("SMS deleted");
            
            if (sms) {
                setSms({
                    ...sms,
                    sms: sms.sms.filter(s => s.id !== smsId),
                    total: sms.total - 1,
                });
            }

            if (selectedSms?.id === smsId) {
                setSelectedSms(null);
                setConversationMessages([]);
                const params = new URLSearchParams();
                if (folder && folder !== "inbox") params.set("folder", folder);
                router.push(`/dashboard/communication/sms${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
            }
        } catch (err) {
            console.error("Failed to delete SMS:", err);
            toast.error("Failed to delete SMS", { 
                description: err instanceof Error ? err.message : "Unknown error" 
            });
        }
    }, [sms, selectedSms, folder, router]);

    const getSenderName = (sms: CompanySms) => {
        if (sms.customer?.first_name || sms.customer?.last_name) {
            return `${sms.customer.first_name || ""} ${sms.customer.last_name || ""}`.trim();
        }
        return sms.from_name || sms.from_address || "Unknown";
    };

    const getSenderInitial = (sms: CompanySms) => {
        const name = getSenderName(sms);
        return name[0]?.toUpperCase() || "U";
    };

    // Handle file attachments
    const handleAttachFiles = useCallback((files: File[]) => {
        setAttachments((prev) => [...prev, ...files]);
    }, []);

    // Handle sending a message (with attachments support)
    const handleSendMessage = useCallback(async () => {
        if ((!messageInput.trim() && attachments.length === 0) || !selectedSms || sendingMessage) return;

        const phoneNumber = selectedSms.direction === "inbound" ? selectedSms.from_address : selectedSms.to_address;
        if (!phoneNumber) {
            toast.error("Cannot determine recipient phone number");
            return;
        }

        setSendingMessage(true);
        try {
            // If we have attachments, upload them first and send as MMS
            if (attachments.length > 0) {
                // Upload files to storage and get URLs
                const { uploadSmsAttachments } = await import("@/actions/sms-actions");
                const uploadResult = await uploadSmsAttachments(attachments);
                
                if (!uploadResult.success || !uploadResult.urls) {
                    toast.error(uploadResult.error || "Failed to upload attachments");
                    setSendingMessage(false);
                    return;
                }

                // Send MMS with attachments
                const { sendMMSMessage } = await import("@/actions/telnyx");
                const result = await sendMMSMessage({
                    to: phoneNumber,
                    from: "", // Will use default from company settings
                    text: messageInput.trim() || undefined,
                    mediaUrls: uploadResult.urls,
                    customerId: selectedSms.customer_id || undefined,
                });

                if (result.success) {
                    setMessageInput("");
                    setAttachments([]);
                    toast.success("Message with attachments sent");
                    // Refresh conversation
                    fetchConversation(phoneNumber);
                    // Refresh SMS list
                    fetchSms(true);
                } else {
                    toast.error(result.error || "Failed to send message");
                }
            } else {
                // Send regular SMS
                const result = await sendTextMessage({
                    to: phoneNumber,
                    from: "", // Will use default from company settings
                    text: messageInput.trim(),
                    customerId: selectedSms.customer_id || undefined,
                });

                if (result.success) {
                    setMessageInput("");
                    toast.success("Message sent");
                    // Refresh conversation
                    fetchConversation(phoneNumber);
                    // Refresh SMS list
                    fetchSms(true);
                } else {
                    toast.error(result.error || "Failed to send message");
                }
            }
        } catch (err) {
            console.error("Failed to send message:", err);
            toast.error("Failed to send message", {
                description: err instanceof Error ? err.message : "Unknown error"
            });
        } finally {
            setSendingMessage(false);
        }
    }, [messageInput, attachments, selectedSms, sendingMessage, fetchConversation, fetchSms]);


    // Format timestamp for messages
    const formatMessageTime = (date: string) => {
        const messageDate = new Date(date);
        const now = new Date();
        const isToday = messageDate.toDateString() === now.toDateString();
        
        if (isToday) {
            return messageDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit'
            });
        }
        
        return messageDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex h-full w-full flex-col overflow-hidden bg-sidebar">
            <div className="flex flex-1 overflow-hidden min-h-0 gap-2">
                {/* SMS List Panel */}
                <div className={`bg-card mb-1 shadow-sm lg:h-full lg:shadow-sm flex flex-col rounded-tr-2xl overflow-hidden ${selectedSms ? "w-full md:w-[400px] lg:w-[480px]" : "w-full"}`}>
                    <div className="w-full h-full flex flex-col">
                        <div className="sticky top-0 z-15 flex items-center justify-between gap-1.5 p-2 pb-0 transition-colors bg-card">
                            <div className="w-full">
                                <div className="grid grid-cols-12 gap-2 mt-1">
                                    <div className="col-span-12 flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 shrink-0"
                                            onClick={toggleSidebar}
                                            title="Toggle sidebar"
                                        >
                                            <PanelLeft className="h-4 w-4" />
                                        </Button>
                                        <div className="relative flex-1">
                                            <Input
                                                type="search"
                                                placeholder="Search SMS..."
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
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SMS Items */}
                        <div className="relative z-1 flex-1 overflow-hidden pt-0 min-h-0">
                            <div className="hide-link-indicator flex h-full w-full">
                                <div className="flex flex-1 flex-col" id="sms-list-scroll">
                                    <ScrollArea className="scrollbar-none flex-1 overflow-x-hidden h-full">
                                        {loading ? (
                                            <div className="flex items-center justify-center p-8">
                                                <div className="text-center">
                                                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                                                    <p className="text-sm text-muted-foreground">Loading SMS...</p>
                                                </div>
                                            </div>
                                        ) : error ? (
                                            <div className="flex items-center justify-center p-8">
                                                <div className="text-center">
                                                    <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
                                                    <p className="text-sm text-destructive mb-2 font-medium">Failed to load SMS</p>
                                                    <p className="text-xs text-muted-foreground mb-4">{error}</p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => fetchSms()}
                                                    >
                                                        Try Again
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : sms?.sms?.length ? (
                                            <div className="min-h-[200px] px-2">
                                                {sms.sms.map((smsMessage) => {
                                                    const isSelected = selectedSms?.id === smsMessage.id;
                                                    return (
                                                        <div
                                                            key={smsMessage.id}
                                                            className="select-none md:my-1"
                                                        >
                                                            <div
                                                                className={`hover:bg-accent group flex cursor-pointer flex-col items-start rounded-lg py-2 text-left text-sm transition-all hover:opacity-100 relative ${
                                                                    isSelected 
                                                                        ? 'bg-accent opacity-100' 
                                                                        : ''
                                                                } ${!smsMessage.read_at ? 'opacity-100' : 'opacity-60'}`}
                                                                onClick={() => handleSmsSelect(smsMessage)}
                                                            >
                                                                {/* Hover Action Toolbar */}
                                                                <div 
                                                                    className="dark:bg-panelDark absolute right-2 z-25 flex -translate-y-1/2 items-center gap-1 rounded-xl border bg-white p-1 opacity-0 shadow-sm group-hover:opacity-100 top-[-1] transition-opacity duration-200"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-6 w-6 overflow-visible p-0 hover:bg-accent"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <Star className="h-4 w-4 fill-transparent stroke-[#9D9D9D] dark:stroke-[#9D9D9D]" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-6 w-6 p-0 hover:bg-accent"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <AlertTriangle className="fill-[#9D9D9D] h-3.5 w-3.5" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-6 w-6 p-0 hover:bg-accent"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <Archive className="fill-[#9D9D9D] h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-6 w-6 p-0 hover:bg-[#FDE4E9] dark:hover:bg-[#411D23]"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDelete(smsMessage.id);
                                                                        }}
                                                                    >
                                                                        <Trash className="fill-[#F43F5E] h-4 w-4" />
                                                                    </Button>
                                                                </div>

                                                                {/* SMS Card Content */}
                                                                <div className="relative flex w-full items-center justify-between gap-4 px-2">
                                                                    {/* Avatar */}
                                                                    <Avatar className="h-8 w-8 shrink-0 rounded-full border">
                                                                        <AvatarFallback className="bg-white dark:bg-[#373737] text-[#9F9F9D] font-bold text-xs">
                                                                            {getSenderInitial(smsMessage)}
                                                                        </AvatarFallback>
                                                                    </Avatar>

                                                                    {/* SMS Info */}
                                                                    <div className="flex w-full justify-between">
                                                                        <div className="w-full">
                                                                            {/* Sender Name + Time */}
                                                                            <div className="flex w-full flex-row items-center justify-between">
                                                                                <div className="flex flex-row items-center gap-[4px]">
                                                                                    <span className={`font-${!smsMessage.read_at ? 'bold' : 'bold'} text-md flex items-baseline gap-1 group-hover:opacity-100`}>
                                                                                        <div className="flex items-center gap-1">
                                                                                            <span className="line-clamp-1 overflow-hidden text-sm">
                                                                                                {getSenderName(smsMessage)}
                                                                                            </span>
                                                                                            {!smsMessage.read_at && (
                                                                                                <span className="ml-0.5 size-2 rounded-full bg-[#006FFE]"></span>
                                                                                            )}
                                                                                        </div>
                                                                                    </span>
                                                                                </div>
                                                                                <p className="text-muted-foreground text-nowrap text-xs font-normal opacity-70 transition-opacity group-hover:opacity-100 dark:text-[#8C8C8C]">
                                                                                    {smsMessage.created_at ? new Date(smsMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                                                </p>
                                                                            </div>

                                                                            {/* Message Preview */}
                                                                            <div className="flex justify-between">
                                                                                <p className="mt-1 line-clamp-1 w-[95%] min-w-0 overflow-hidden text-sm text-[#8C8C8C]">
                                                                                    {smsMessage.body || "No message"}
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
                                                    <MessageSquare className="h-16 w-16 text-muted-foreground opacity-50 mx-auto mb-4" />
                                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                                        {searchQuery ? "No SMS found" : "No SMS yet"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {searchQuery 
                                                            ? "Try adjusting your search terms" 
                                                            : "SMS messages will appear here when received"}
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

                {/* SMS Detail - Right Panel (iPhone-style chat interface) */}
                {selectedSms && (
                    <div className="bg-card mb-1 rounded-tl-2xl shadow-sm lg:h-full flex flex-col min-w-0 flex-1 overflow-hidden">
                        <div className="relative flex-1 min-h-0 flex flex-col">
                            {/* Header */}
                            <div className="sticky top-0 z-15 flex shrink-0 items-center justify-between gap-1.5 p-3 border-b border-border/50 bg-card">
                                <div className="flex flex-1 items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            const params = new URLSearchParams();
                                            if (folder && folder !== "inbox") params.set("folder", folder);
                                            router.push(`/dashboard/communication/sms?${params.toString()}`, { scroll: false });
                                        }}
                                        className="h-8 w-8 p-0 hover:bg-accent/80 active:bg-accent transition-colors"
                                    >
                                        <X className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                    <Avatar className="h-8 w-8 shrink-0">
                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                                            {getSenderInitial(selectedSms)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm text-foreground truncate">
                                            {getSenderName(selectedSms)}
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate">
                                            {selectedSms.direction === "inbound" 
                                                ? selectedSms.from_address || "Unknown"
                                                : selectedSms.to_address || "Unknown"}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="More options">
                                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </div>
                            </div>

                            {/* Messages Area - iPhone Style */}
                            <div 
                                ref={conversationScrollRef}
                                className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-muted/20 px-4 py-4"
                            >
                                {loadingConversation ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                ) : conversationMessages.length === 0 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <MessageSquare className="h-12 w-12 text-muted-foreground opacity-50 mx-auto mb-2" />
                                            <p className="text-sm text-muted-foreground">No messages yet</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {conversationMessages.map((msg, index) => {
                                            const isOutbound = msg.direction === "outbound";
                                            const showTime = index === 0 || 
                                                new Date(msg.created_at).getTime() - new Date(conversationMessages[index - 1].created_at).getTime() > 5 * 60 * 1000; // 5 minutes
                                            
                                            return (
                                                <div key={msg.id} className="flex flex-col">
                                                    {showTime && (
                                                        <div className="flex justify-center my-2">
                                                            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                                                                {formatMessageTime(msg.created_at)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className={cn(
                                                        "flex flex-col",
                                                        isOutbound ? "items-end" : "items-start"
                                                    )}>
                                                        <div className={cn(
                                                            "max-w-[75%] rounded-2xl px-4 py-2 shadow-sm",
                                                            isOutbound
                                                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                                                : "bg-muted text-foreground rounded-tl-sm"
                                                        )}>
                                                            {/* Show attachments if present */}
                                                            {msg.provider_metadata && typeof msg.provider_metadata === 'object' && 'attachments' in msg.provider_metadata && Array.isArray(msg.provider_metadata.attachments) && msg.provider_metadata.attachments.length > 0 && (
                                                                <div className={cn("mb-2 space-y-2", msg.body ? "" : "")}>
                                                                    {msg.provider_metadata.attachments.map((att: any, attIdx: number) => {
                                                                        const isImage = att.type === 'image' || (att.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(att.url));
                                                                        return (
                                                                            <div key={attIdx} className="rounded-lg overflow-hidden">
                                                                                {isImage ? (
                                                                                    <img
                                                                                        src={att.url}
                                                                                        alt={att.filename || "Image"}
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
                                                                                            isOutbound ? "bg-primary-foreground/20" : "bg-background/20"
                                                                                        )}
                                                                                    >
                                                                                        <Paperclip className="h-4 w-4" />
                                                                                        <span className="text-xs truncate">{att.filename || "Attachment"}</span>
                                                                                    </a>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                            {msg.body && (
                                                                <p className="text-sm whitespace-pre-wrap break-words">
                                                                    {msg.body}
                                                                </p>
                                                            )}
                                                            {!msg.body && (!msg.provider_metadata || typeof msg.provider_metadata !== 'object' || !('attachments' in msg.provider_metadata) || !Array.isArray(msg.provider_metadata.attachments) || msg.provider_metadata.attachments.length === 0) && (
                                                                <p className="text-sm opacity-70 italic">No message content</p>
                                                            )}
                                                        </div>
                                                        <span className={cn(
                                                            "text-xs text-muted-foreground mt-0.5",
                                                            isOutbound ? "text-right" : "text-left"
                                                        )}>
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Message Input - iPhone Style with Emojis & Attachments */}
                            <SmsMessageInput
                                value={messageInput}
                                onChange={setMessageInput}
                                onSend={handleSendMessage}
                                onAttach={handleAttachFiles}
                                sending={sendingMessage}
                                disabled={!selectedSms}
                                placeholder="Text Message"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
