/**
 * Unified Inbox Page Client Component
 *
 * Exact layout match to email/SMS pages - combines all communication types
 * Features: emails, SMS, calls, voicemails in single timeline
 */

"use client";

import { useState, useCallback, useEffect, useRef, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format } from "date-fns";
import {
	Mail,
	MessageSquare,
	Phone,
	Voicemail,
	User,
	Briefcase,
	MapPin,
	Reply,
	Forward,
	Archive,
	Trash2,
	Star,
	MoreHorizontal,
	StickyNote,
	Link as LinkIcon,
	AlertCircle,
	CheckCircle,
	Clock,
	ArrowLeft,
	X,
	RefreshCw,
	PanelLeft,
	Filter,
	Send,
	AlertTriangle,
	Flag,
	Printer,
	Download,
} from "lucide-react";
import type { Communication } from "@/lib/queries/communications";
import { CustomerInfoPill } from "@/components/communication/customer-info-pill";
import { EmailContent } from "@/components/communication/email-content";
import { AutoLinkSuggestions } from "@/components/communication/auto-link-suggestions";
import { toast } from "sonner";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { getCustomerDisplayName } from "@/lib/utils/customer-display";

type CommunicationType = "all" | "email" | "sms" | "call" | "voicemail";

interface UnifiedInboxPageClientProps {
	initialCommunications: Communication[];
	companyId: string;
	teamMemberId: string;
	selectedId?: string | null;
}

export function UnifiedInboxPageClient({
	initialCommunications,
	companyId,
	teamMemberId,
	selectedId: initialSelectedId,
}: UnifiedInboxPageClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toggleSidebar } = useSidebar();
	const [isPending, startTransition] = useTransition();

	const communicationIdFromQuery = searchParams?.get("id");
	const communicationId = communicationIdFromQuery || initialSelectedId;

	const [communications, setCommunications] = useState<Communication[]>(initialCommunications);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(() => {
		if (initialSelectedId && initialCommunications) {
			return initialCommunications.find((c) => c.id === initialSelectedId) || null;
		}
		return null;
	});

	const [searchQuery, setSearchQuery] = useState("");
	const [searchInput, setSearchInput] = useState("");
	const [typeFilter, setTypeFilter] = useState<CommunicationType>("all");
	const [notesOpen, setNotesOpen] = useState(false);
	const [internalNotes, setInternalNotes] = useState("");
	const [savingNotes, setSavingNotes] = useState(false);

	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const selectedCommunicationRef = useRef<Communication | null>(selectedCommunication);
	const refreshingRef = useRef(refreshing);
	refreshingRef.current = refreshing;

	// Update selected communication when URL changes
	useEffect(() => {
		if (communicationId && communications) {
			const comm = communications.find((c) => c.id === communicationId);
			if (comm) {
				setSelectedCommunication(comm);
				setInternalNotes(comm.internalNotes || "");
				selectedCommunicationRef.current = comm;
			}
		} else {
			setSelectedCommunication(null);
			selectedCommunicationRef.current = null;
		}
	}, [communicationId, communications]);

	// Debounced search
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

	// Fetch communications function
	const fetchCommunications = useCallback(
		async (showRefreshing = false) => {
			setRefreshing(true);
			setError(null);

			startTransition(async () => {
				try {
					const { getCommunicationsAction } = await import("@/actions/communications");
					const result = await getCommunicationsAction({
						teamMemberId,
						companyId,
						type: typeFilter !== "all" ? typeFilter : undefined,
						limit: 100,
					});

					if (result.success && result.data) {
						setCommunications(result.data as Communication[]);

						// Update selected communication if it's still in the list
						const currentSelected = selectedCommunicationRef.current;
						if (currentSelected) {
							const updatedComm = (result.data as Communication[]).find((c) => c.id === currentSelected.id);
							if (updatedComm) {
								setSelectedCommunication(updatedComm);
								selectedCommunicationRef.current = updatedComm;
							}
						}
					}
				} catch (err) {
					console.error("Failed to fetch communications:", err);
					const errorMessage = err instanceof Error ? err.message : "Failed to load communications";
					setError(errorMessage);
					toast.error("Failed to load communications", { description: errorMessage });
				} finally {
					setRefreshing(false);
				}
			});
		},
		[teamMemberId, companyId, typeFilter]
	);

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

	// Auto-refresh every 30 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			if (!refreshingRef.current) {
				fetchCommunications();
			}
		}, 30000);

		return () => clearInterval(interval);
	}, [fetchCommunications]);

	// Handle communication selection
	const handleCommunicationSelect = useCallback(
		(communication: Communication) => {
			setSelectedCommunication(communication);
			setInternalNotes(communication.internalNotes || "");
			selectedCommunicationRef.current = communication;

			const params = new URLSearchParams(searchParams?.toString() || "");
			params.set("id", communication.id);
			router.push(`/dashboard/communication?${params.toString()}`, { scroll: false });

			// Mark as read if unread
			if (communication.status === "unread" || communication.status === "new") {
				// TODO: Call mark as read action
			}
		},
		[router, searchParams]
	);

	// Save internal notes
	const handleSaveNotes = useCallback(async () => {
		if (!selectedCommunication) return;

		setSavingNotes(true);
		try {
			const { saveInternalNotesAction } = await import("@/actions/communications");
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
							: c
					)
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

	// Handle star/archive/delete actions
	const handleArchive = useCallback(async (communicationId: string) => {
		// TODO: Implement archive action
		toast.success("Archived");
	}, []);

	const handleStar = useCallback(async (communicationId: string) => {
		// TODO: Implement star action
		toast.success("Starred");
	}, []);

	const handleDelete = useCallback(async (communicationId: string) => {
		// TODO: Implement delete action
		toast.success("Deleted");
	}, []);

	// Filter communications by search
	const filteredCommunications = communications.filter((comm) => {
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			const matchesSubject = comm.subject?.toLowerCase().includes(query);
			const matchesBody = comm.body?.toLowerCase().includes(query);
			const matchesFrom = comm.fromAddress?.toLowerCase().includes(query);
			const matchesTo = comm.toAddress?.toLowerCase().includes(query);
			return matchesSubject || matchesBody || matchesFrom || matchesTo;
		}
		return true;
	});

	// Mobile: show list when no communication selected, show detail when communication selected
	const showListOnMobile = !selectedCommunication;
	const showDetailOnMobile = selectedCommunication;

	// Get type icon and colors
	const getTypeConfig = (type: string) => {
		switch (type) {
			case "email":
				return { icon: Mail, color: "text-blue-500", bg: "bg-blue-500/10" };
			case "sms":
				return { icon: MessageSquare, color: "text-green-500", bg: "bg-green-500/10" };
			case "call":
				return { icon: Phone, color: "text-purple-500", bg: "bg-purple-500/10" };
			case "voicemail":
				return { icon: Voicemail, color: "text-orange-500", bg: "bg-orange-500/10" };
			default:
				return { icon: Mail, color: "text-gray-500", bg: "bg-gray-500/10" };
		}
	};

	// Type filter buttons
	const typeFilters: { type: CommunicationType; label: string; count: number }[] = [
		{
			type: "all",
			label: "All",
			count: communications.length,
		},
		{
			type: "email",
			label: "Email",
			count: communications.filter((c) => c.type === "email").length,
		},
		{
			type: "sms",
			label: "SMS",
			count: communications.filter((c) => c.type === "sms").length,
		},
		{
			type: "call",
			label: "Calls",
			count: communications.filter((c) => c.type === "call").length,
		},
		{
			type: "voicemail",
			label: "Voicemail",
			count: communications.filter((c) => c.type === "voicemail").length,
		},
	];

	return (
		<div className="flex h-full w-full flex-col overflow-hidden bg-sidebar">
			<div className="flex flex-1 overflow-hidden min-h-0 md:gap-2">
				{/* Left Panel - Communications List */}
				<div
					className={cn(
						"bg-card mb-1 shadow-sm flex flex-col overflow-hidden",
						"w-full h-full", // Mobile: full width/height
						"md:w-[400px] lg:w-[480px] md:rounded-tr-2xl", // Desktop: fixed width with rounded corner
						// Mobile visibility logic
						showListOnMobile ? "flex" : "hidden md:flex"
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
												onClick={() => setSearchInput("")}
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

							{/* Type filter buttons */}
							<div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
								{typeFilters.map(({ type, label, count }) => (
									<Button
										key={type}
										variant={typeFilter === type ? "default" : "ghost"}
										size="sm"
										onClick={() => setTypeFilter(type)}
										className="h-7 gap-1 whitespace-nowrap text-xs shrink-0"
									>
										{label}
										{count > 0 && (
											<Badge variant={typeFilter === type ? "secondary" : "outline"} className="ml-0.5 h-4 px-1 text-[10px]">
												{count}
											</Badge>
										)}
									</Button>
								))}
							</div>
						</div>

						{/* Progress bar */}
						<div
							className={cn(
								"bg-[#006FFE] relative z-5 h-0.5 w-full transition-opacity",
								refreshing ? "opacity-100 animate-pulse" : "opacity-0"
							)}
						/>

						{/* Communications List */}
						<div className="relative z-1 flex-1 overflow-hidden pt-0 min-h-0">
							<div className="hide-link-indicator flex h-full w-full">
								<div className="flex flex-1 flex-col">
									<ScrollArea className="scrollbar-none flex-1 overflow-x-hidden h-full">
										{error && (!communications || communications.length === 0) ? (
											<div className="flex items-center justify-center p-8">
												<div className="text-center">
													<AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
													<p className="text-sm text-destructive mb-2 font-medium">Failed to load communications</p>
													<p className="text-xs text-muted-foreground mb-4">{error}</p>
													<Button variant="outline" size="sm" onClick={() => fetchCommunications()}>
														Try Again
													</Button>
												</div>
											</div>
										) : filteredCommunications.length ? (
											<div className="min-h-[200px] px-2">
												{filteredCommunications.map((communication) => {
													const isSelected = selectedCommunication?.id === communication.id;
													const isUnread = communication.status === "unread" || communication.status === "new";
													const typeConfig = getTypeConfig(communication.type);
													const TypeIcon = typeConfig.icon;

													return (
														<div key={communication.id} className="select-none md:my-1">
															<div
																className={cn(
																	"hover:bg-accent group flex cursor-pointer flex-col items-start rounded-lg py-2 text-left text-sm transition-all hover:opacity-100 relative",
																	isSelected ? "bg-accent opacity-100" : "",
																	isUnread ? "opacity-100" : "opacity-60"
																)}
																onClick={() => handleCommunicationSelect(communication)}
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
																		<Star className="h-4 w-4 text-muted-foreground transition-colors group-hover/star:text-yellow-500" />
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
																				{(communication.direction === "inbound"
																					? communication.fromAddress?.[0]
																					: communication.toAddress?.[0]
																				)?.toUpperCase() || "?"}
																			</AvatarFallback>
																		</Avatar>
																		<div className={cn("absolute -bottom-1 -right-1 rounded-full p-0.5 border border-white dark:border-[#1C1C1C]", typeConfig.bg)}>
																			<TypeIcon className={cn("h-2.5 w-2.5", typeConfig.color)} />
																		</div>
																	</div>

																	<div className="flex w-full justify-between">
																		<div className="w-full">
																			<div className="flex w-full flex-row items-center justify-between">
																				<div className="flex flex-row items-center gap-[4px]">
																					<span className="font-bold text-md flex items-baseline gap-1 group-hover:opacity-100">
																						<div className="flex items-center gap-1">
																							<span className="line-clamp-1 overflow-hidden text-sm">
																								{communication.direction === "outbound"
																									? communication.toAddress || "Unknown recipient"
																									: communication.fromAddress || "Unknown sender"}
																							</span>
																							{isUnread && <span className="ml-0.5 size-2 rounded-full bg-[#006FFE]"></span>}
																						</div>
																					</span>
																				</div>
																				<p className="text-muted-foreground text-nowrap text-xs font-normal opacity-70 transition-opacity group-hover:opacity-100 dark:text-[#8C8C8C]">
																					{communication.createdAt
																						? new Date(communication.createdAt).toLocaleTimeString([], {
																								hour: "2-digit",
																								minute: "2-digit",
																						  })
																						: ""}
																				</p>
																			</div>

																			<div className="flex justify-between items-center gap-2">
																				<p className="mt-1 line-clamp-1 min-w-0 overflow-hidden text-sm text-[#8C8C8C] flex-1">
																					{communication.subject || communication.body || "No content"}
																				</p>
																				{/* Status badges */}
																				<div className="flex items-center gap-1 shrink-0">
																					{/* Customer link badge */}
																					{communication.customerId && (
																						<Link
																							href={`/dashboard/customers/${communication.customerId}`}
																							onClick={(e) => e.stopPropagation()}
																							className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-0.5"
																							title="View customer profile"
																						>
																							<User className="h-2.5 w-2.5" />
																						</Link>
																					)}
																					{/* Job link badge */}
																					{communication.jobId && (
																						<span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-600 flex items-center gap-0.5">
																							<Briefcase className="h-2.5 w-2.5" />
																						</span>
																					)}
																					{/* Auto-link badge */}
																					{communication.autoLinked && communication.linkConfidence !== undefined && (
																						<span
																							className={cn(
																								"px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5",
																								communication.linkConfidence >= 0.8
																									? "bg-green-500/10 text-green-600"
																									: "bg-yellow-500/10 text-yellow-600"
																							)}
																							title={`Auto-linked: ${Math.round(communication.linkConfidence * 100)}%`}
																						>
																							<LinkIcon className="h-2.5 w-2.5" />
																						</span>
																					)}
																					{/* Internal notes badge */}
																					{communication.internalNotes && (
																						<span className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground flex items-center gap-0.5">
																							<StickyNote className="h-2.5 w-2.5" />
																						</span>
																					)}
																					{/* Failed status */}
																					{communication.status === "failed" && (
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
													<p className="text-sm text-muted-foreground">No communications found</p>
													{searchQuery && (
														<p className="text-xs text-muted-foreground mt-1">Try adjusting your search</p>
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

				{/* Right Panel - Communication Detail */}
				{selectedCommunication ? (
					<div
						className={cn(
							"bg-card mb-1 shadow-sm flex flex-col min-w-0 overflow-hidden",
							"w-full h-full", // Mobile: full width/height
							"md:rounded-tl-2xl md:flex-1", // Desktop: rounded corner and flex
							showDetailOnMobile ? "flex" : "hidden md:flex"
						)}
					>
						<div className="relative flex-1 min-h-0 flex flex-col">
							<div className="bg-card relative flex flex-col overflow-hidden transition-all duration-300 h-full flex-1 min-h-0">
								{/* Communication Header Toolbar */}
								<div className="sticky top-0 z-15 flex shrink-0 items-center justify-between gap-1.5 p-2 pb-0 transition-colors bg-card">
									<div className="flex flex-1 items-center gap-2">
										{/* Back button (mobile) / Close button (desktop) */}
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												setSelectedCommunication(null);
												selectedCommunicationRef.current = null;
												const params = new URLSearchParams();
												router.push(`/dashboard/communication?${params.toString()}`, { scroll: false });
											}}
											className="h-10 w-10 p-0 md:h-8 md:w-8"
											title="Back to list"
										>
											<ArrowLeft className="h-5 w-5 md:hidden text-muted-foreground" />
											<X className="h-4 w-4 hidden md:block text-muted-foreground" />
										</Button>
										<Separator orientation="vertical" className="h-4 bg-border/60 hidden md:block" />
									</div>
									<div className="flex items-center gap-1">
										{/* Reply button (for emails/SMS) */}
										{(selectedCommunication.type === "email" || selectedCommunication.type === "sms") && (
											<Button variant="ghost" size="sm" className="h-10 w-10 p-0 md:h-8 md:w-auto md:px-2" title="Reply">
												<Reply className="h-5 w-5 md:h-4 md:w-4 md:mr-1.5 text-muted-foreground" />
												<span className="text-sm leading-none font-medium hidden md:inline">Reply</span>
											</Button>
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
													<SheetDescription>Private team notes - not visible to customer</SheetDescription>
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
															{formatDistanceToNow(new Date(selectedCommunication.internalNotesUpdatedAt), {
																addSuffix: true,
															})}
														</p>
													)}
													<div className="mt-4 flex justify-end gap-2">
														<Button variant="outline" size="sm" onClick={() => setNotesOpen(false)}>
															Cancel
														</Button>
														<Button size="sm" onClick={handleSaveNotes} disabled={savingNotes}>
															{savingNotes ? "Saving..." : "Save Notes"}
														</Button>
													</div>
												</div>
											</SheetContent>
										</Sheet>
										{/* Star */}
										<Button variant="ghost" size="sm" className="h-10 w-10 p-0 md:h-8 md:w-8 group/star" title="Star">
											<Star className="h-5 w-5 md:h-4 md:w-4 text-muted-foreground transition-colors group-hover/star:text-yellow-500" />
										</Button>
										{/* Archive */}
										<Button
											variant="destructive"
											size="sm"
											className="h-10 w-10 p-0 md:h-8 md:w-8"
											title="Archive"
											onClick={() => selectedCommunication && handleArchive(selectedCommunication.id)}
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
												<DropdownMenuItem onClick={() => setNotesOpen(true)} className="md:hidden">
													<StickyNote className="h-4 w-4 mr-2" />
													Notes
												</DropdownMenuItem>
												<DropdownMenuSeparator className="md:hidden" />
												<DropdownMenuItem onClick={() => handleDelete(selectedCommunication.id)} className="text-destructive focus:text-destructive">
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
											<div className="border-b border-border/50 px-2 py-4 space-y-3">
												<h1 className="text-base font-semibold text-foreground">
													{selectedCommunication.subject || (selectedCommunication.type === "sms" ? "Text Message" : "No Subject")}
												</h1>

												<div className="flex items-center gap-3">
													<Avatar className="h-9 w-9 shrink-0 rounded-md cursor-pointer">
														<AvatarFallback className="bg-muted text-muted-foreground font-semibold text-sm rounded-md">
															{(selectedCommunication.direction === "inbound"
																? selectedCommunication.fromAddress?.[0]
																: selectedCommunication.toAddress?.[0]
															)?.toUpperCase() || "?"}
														</AvatarFallback>
													</Avatar>

													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2">
															<span className="font-semibold text-sm text-foreground">
																{selectedCommunication.direction === "inbound"
																	? selectedCommunication.fromAddress || "Unknown"
																	: selectedCommunication.toAddress || "Unknown"}
															</span>
															{(selectedCommunication.status === "unread" || selectedCommunication.status === "new") && (
																<div className="h-2 w-2 rounded-full bg-primary" />
															)}
														</div>
														<div className="flex items-center gap-2 text-xs text-muted-foreground">
															<span>
																{selectedCommunication.direction === "inbound"
																	? `from ${selectedCommunication.fromAddress?.split("@")[0] || "unknown"}`
																	: `to ${selectedCommunication.toAddress?.split("@")[0] || "unknown"}`}
															</span>
															{selectedCommunication.customerId && (
																<Badge variant="outline" className="gap-1">
																	<User className="h-2.5 w-2.5" />
																	Customer
																</Badge>
															)}
														</div>
													</div>

													<div className="flex items-center gap-2">
														<span className="text-xs text-muted-foreground whitespace-nowrap">
															{new Date(selectedCommunication.createdAt).toLocaleTimeString("en-US", {
																hour: "numeric",
																minute: "2-digit",
															})}
														</span>
													</div>
												</div>

												{/* Status and link indicators */}
												<div className="flex items-center gap-2 flex-wrap">
													{selectedCommunication.autoLinked && selectedCommunication.linkConfidence !== undefined && (
														<Badge variant={selectedCommunication.linkConfidence >= 0.8 ? "default" : "secondary"} className="gap-1">
															<LinkIcon className="h-3 w-3" />
															Auto-linked ({Math.round(selectedCommunication.linkConfidence * 100)}%)
														</Badge>
													)}
													{selectedCommunication.status && (
														<Badge variant="outline" className="gap-1">
															{selectedCommunication.status}
														</Badge>
													)}
													{selectedCommunication.type && (
														<Badge variant="outline" className="gap-1">
															{selectedCommunication.type}
														</Badge>
													)}
												</div>
											</div>

											{/* Auto-Link Suggestions */}
											<div className="px-2 py-2">
												<AutoLinkSuggestions
													communication={selectedCommunication}
													companyId={companyId}
													onLinked={() => {
														// Refresh communications to get updated link data
														fetchCommunications();
													}}
												/>
											</div>

											{/* Message Content */}
											<ScrollArea className="flex-1 px-2 py-4">
												{selectedCommunication.type === "email" ? (
													<EmailContent
														content={selectedCommunication.body || ""}
														contentType={(selectedCommunication.contentType as "html" | "text") || "text"}
													/>
												) : (
													<div className="prose prose-sm max-w-none">
														<p className="whitespace-pre-wrap">{selectedCommunication.body || "No content"}</p>
													</div>
												)}
											</ScrollArea>
										</TooltipProvider>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div
						className={cn(
							"bg-card mb-1 shadow-sm hidden md:flex md:flex-col md:items-center md:justify-center md:rounded-tl-2xl md:flex-1"
						)}
					>
						<Mail className="h-16 w-16 text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold">No communication selected</h3>
						<p className="text-sm text-muted-foreground">Select a communication from the list to view details</p>
					</div>
				)}
			</div>
		</div>
	);
}
