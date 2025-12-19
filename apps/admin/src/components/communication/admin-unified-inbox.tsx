"use client";

/**
 * AdminUnifiedInbox - Platform-wide communication inbox
 *
 * Shows all communications across all companies with filtering,
 * search, and detail view. Matches web dashboard patterns.
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
	Archive,
	ArrowLeft,
	Building2,
	Forward,
	Mail,
	MessageSquare,
	MoreHorizontal,
	PenSquare,
	Phone,
	RefreshCw,
	Reply,
	ReplyAll,
	Search,
	Star,
	Ticket,
	Trash2,
	Voicemail,
	X,
	PanelLeft,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import type { AdminCommunication } from "@/types/entities";
import { AdminEmailReplyComposer, type EmailReplyMode } from "./admin-email-reply-composer";
import { AdminSmsPanel } from "./admin-sms-panel";

/**
 * Extract initials from email or name
 */
const getInitials = (email?: string): string => {
	if (!email) return "?";

	// Extract the part before @ symbol
	const localPart = email.split("@")[0];

	// If it contains a dot, assume first.last format
	if (localPart.includes(".")) {
		const parts = localPart.split(".");
		return parts
			.map((part) => part[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	}

	// Otherwise, take first two characters
	return localPart.substring(0, 2).toUpperCase();
};

type CommunicationType = "all" | "email" | "sms" | "call" | "voicemail" | "ticket";

type AdminUnifiedInboxProps = {
	communications: AdminCommunication[];
	onRefresh?: () => void;
};

const TYPE_CONFIG: Record<string, { icon: typeof Mail; color: string; bg: string; label: string }> = {
	email: { icon: Mail, color: "text-blue-500", bg: "bg-blue-500/10", label: "Email" },
	sms: { icon: MessageSquare, color: "text-green-500", bg: "bg-green-500/10", label: "SMS" },
	call: { icon: Phone, color: "text-purple-500", bg: "bg-purple-500/10", label: "Call" },
	voicemail: { icon: Voicemail, color: "text-orange-500", bg: "bg-orange-500/10", label: "Voicemail" },
	ticket: { icon: Ticket, color: "text-amber-500", bg: "bg-amber-500/10", label: "Ticket" },
};

const TYPE_FILTERS: { type: CommunicationType; label: string }[] = [
	{ type: "all", label: "All" },
	{ type: "email", label: "Email" },
	{ type: "sms", label: "SMS" },
	{ type: "call", label: "Calls" },
	{ type: "voicemail", label: "Voicemail" },
	{ type: "ticket", label: "Tickets" },
];

export function AdminUnifiedInbox({ communications, onRefresh }: AdminUnifiedInboxProps) {
	const { toggleSidebar } = useSidebar();
	const router = useRouter();
	const [searchInput, setSearchInput] = useState("");
	const [typeFilter, setTypeFilter] = useState<CommunicationType>("all");
	const [selectedCommunication, setSelectedCommunication] = useState<AdminCommunication | null>(null);
	const [refreshing, setRefreshing] = useState(false);
	const [replyMode, setReplyMode] = useState<EmailReplyMode | null>(null);

	// Filter communications
	const filteredCommunications = communications.filter((comm) => {
		// Type filter
		if (typeFilter !== "all" && comm.type !== typeFilter) {
			return false;
		}

		// Search filter
		if (searchInput) {
			const query = searchInput.toLowerCase();
			const matchesSubject = comm.subject?.toLowerCase().includes(query);
			const matchesBody = comm.preview?.toLowerCase().includes(query);
			const matchesFrom = comm.from?.toLowerCase().includes(query);
			const matchesTo = comm.to?.toLowerCase().includes(query);
			const matchesCompany = comm.companyName?.toLowerCase().includes(query);
			return matchesSubject || matchesBody || matchesFrom || matchesTo || matchesCompany;
		}

		return true;
	});

	// Count by type
	const typeCounts = communications.reduce((acc, comm) => {
		acc[comm.type] = (acc[comm.type] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	const handleRefresh = useCallback(() => {
		setRefreshing(true);
		// Use router.refresh() to revalidate server data
		router.refresh();
		// Also call custom onRefresh if provided
		onRefresh?.();
		// Reset refreshing state after a short delay
		setTimeout(() => setRefreshing(false), 1000);
	}, [router, onRefresh]);

	const handleSelectCommunication = useCallback((comm: AdminCommunication) => {
		setSelectedCommunication(comm);
		setReplyMode(null); // Close reply when switching messages
	}, []);

	const handleCloseCommunication = useCallback(() => {
		setSelectedCommunication(null);
		setReplyMode(null);
	}, []);

	const handleCloseReply = useCallback(() => {
		setReplyMode(null);
	}, []);

	const handleReplySent = useCallback(() => {
		setReplyMode(null);
		// Could refresh the list here
	}, []);

	const getTypeConfig = (type: string) => {
		return TYPE_CONFIG[type] || TYPE_CONFIG.email;
	};

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return "Today";
		if (diffDays === 1) return "Yesterday";
		if (diffDays < 7) return date.toLocaleDateString([], { weekday: "short" });
		return date.toLocaleDateString([], { month: "short", day: "numeric" });
	};

	// Mobile: show list when no communication selected
	const showListOnMobile = !selectedCommunication;
	const showDetailOnMobile = selectedCommunication;

	return (
		<div className="flex h-full w-full flex-col overflow-hidden bg-sidebar">
			<div className="flex flex-1 overflow-hidden min-h-0 md:gap-2">
				{/* Left Panel - Communications List */}
				<div
					className={cn(
						"bg-card mb-1 shadow-sm flex flex-col overflow-hidden",
						"w-full h-full",
						"md:w-[400px] lg:w-[480px] md:rounded-tr-2xl",
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
											className="h-10 md:h-8 pl-9 pr-8 text-base md:text-sm border-input bg-background"
										/>
										<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
										onClick={handleRefresh}
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
								{TYPE_FILTERS.map(({ type, label }) => {
									const count = type === "all" ? communications.length : (typeCounts[type] || 0);
									return (
										<Button
											key={type}
											variant={typeFilter === type ? "default" : "ghost"}
											size="sm"
											onClick={() => setTypeFilter(type)}
											className="h-7 gap-1 whitespace-nowrap text-xs shrink-0"
										>
											{label}
											{count > 0 && (
												<Badge
													variant={typeFilter === type ? "secondary" : "outline"}
													className="ml-0.5 h-4 px-1 text-[10px]"
												>
													{count}
												</Badge>
											)}
										</Button>
									);
								})}
							</div>
						</div>

						{/* Progress bar */}
						<div
							className={cn(
								"bg-primary relative z-5 h-0.5 w-full transition-opacity",
								refreshing ? "opacity-100 animate-pulse" : "opacity-0"
							)}
						/>

						{/* Communications List */}
						<div className="relative z-1 flex-1 overflow-y-auto pt-0 min-h-0">
							<div className="flex h-full w-full">
								<div className="flex flex-1 flex-col">
									{filteredCommunications.length > 0 ? (
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
															onClick={() => handleSelectCommunication(communication)}
														>
															{/* Hover Action Toolbar */}
															<div
																className="absolute right-2 z-25 flex -translate-y-1/2 items-center gap-1 rounded-xl border bg-popover p-1 opacity-0 shadow-sm group-hover:opacity-100 top-[-1] transition-opacity duration-200"
																onClick={(e) => e.stopPropagation()}
															>
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-6 w-6 overflow-visible p-0 hover:bg-accent group/star"
																	title="Star"
																>
																	<Star className="h-4 w-4 text-muted-foreground transition-colors group-hover/star:text-yellow-500" />
																</Button>
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-6 w-6 p-0 hover:bg-accent group/archive"
																	title="Archive"
																>
																	<Archive className="h-4 w-4 text-muted-foreground transition-colors group-hover/archive:text-blue-500" />
																</Button>
															</div>

															{/* Communication Card Content */}
															<div className="relative flex w-full items-center justify-between gap-4 px-2">
																{/* Avatar with type badge */}
																<div className="relative">
																	<Avatar className="h-8 w-8 shrink-0 rounded-full">
																		<AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
																			{getInitials(
																				communication.direction === "inbound"
																					? communication.from
																					: communication.to
																			)}
																		</AvatarFallback>
																	</Avatar>
																	<div
																		className={cn(
																			"absolute -bottom-1 -right-1 rounded-full p-0.5 border border-background",
																			typeConfig.bg
																		)}
																	>
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
																								? communication.to || "Unknown recipient"
																								: communication.from || "Unknown sender"}
																						</span>
																						{isUnread && (
																							<span className="ml-0.5 size-2 rounded-full bg-primary" />
																						)}
																					</div>
																				</span>
																			</div>
																			<p className="text-muted-foreground text-nowrap text-xs font-normal opacity-70 transition-opacity group-hover:opacity-100">
																				{formatTime(communication.createdAt)}
																			</p>
																		</div>

																		<div className="flex justify-between items-center gap-2">
																			<p className="mt-1 line-clamp-1 min-w-0 overflow-hidden text-sm text-muted-foreground flex-1">
																				{communication.subject || communication.preview || "No content"}
																			</p>
																			{/* Company badge */}
																			{communication.companyName && (
																				<span className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground flex items-center gap-0.5 shrink-0">
																					<Building2 className="h-2.5 w-2.5" />
																					{communication.companyName}
																				</span>
																			)}
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
										<div className="flex items-center justify-center p-8 h-full">
											<div className="text-center">
												<Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
												<p className="text-sm text-muted-foreground">No communications found</p>
												{searchInput && (
													<p className="text-xs text-muted-foreground mt-1">
														Try adjusting your search
													</p>
												)}
											</div>
										</div>
									)}
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
							"w-full h-full",
							"md:rounded-tl-2xl md:flex-1",
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
											onClick={handleCloseCommunication}
											className="h-10 w-10 p-0 md:h-8 md:w-8"
											title="Back to list"
										>
											<ArrowLeft className="h-5 w-5 md:hidden text-muted-foreground" />
											<X className="h-4 w-4 hidden md:block text-muted-foreground" />
										</Button>
									</div>
									<div className="flex items-center gap-1">
										{/* Reply buttons */}
										{(selectedCommunication.type === "email" || selectedCommunication.type === "sms" || selectedCommunication.type === "ticket") && (
											<>
												<Button
													variant={replyMode === "reply" ? "default" : "ghost"}
													size="sm"
													className="h-10 w-10 p-0 md:h-8 md:w-auto md:px-2"
													title="Reply"
													onClick={() => setReplyMode(replyMode === "reply" ? null : "reply")}
												>
													<Reply className="h-5 w-5 md:h-4 md:w-4 md:mr-1.5 text-muted-foreground" />
													<span className="text-sm leading-none font-medium hidden md:inline">Reply</span>
												</Button>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="sm" className="h-10 w-10 p-0 md:h-8 md:w-8" title="More reply options">
															<ReplyAll className="h-5 w-5 md:h-4 md:w-4 text-muted-foreground" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end" className="w-40">
														<DropdownMenuItem onClick={() => setReplyMode("reply")}>
															<Reply className="h-4 w-4 mr-2" />
															Reply
														</DropdownMenuItem>
														<DropdownMenuItem onClick={() => setReplyMode("reply-all")}>
															<ReplyAll className="h-4 w-4 mr-2" />
															Reply All
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem onClick={() => setReplyMode("forward")}>
															<Forward className="h-4 w-4 mr-2" />
															Forward
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</>
										)}
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
												<DropdownMenuItem className="text-destructive focus:text-destructive">
													<Trash2 className="h-4 w-4 mr-2" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>

								{/* Communication Content */}
								<div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
									{/* SMS Panel - Full iPhone-style view */}
									{selectedCommunication.type === "sms" ? (
										<AdminSmsPanel
											communication={selectedCommunication}
											className="flex-1"
										/>
									) : (
										/* Email/Call/Ticket/Voicemail View */
										<div className="relative overflow-hidden flex-1 h-full min-h-0 flex flex-col">
											<div className="border-b border-border/50 px-4 py-4 space-y-3">
												<h1 className="text-base font-semibold text-foreground">
													{selectedCommunication.subject || "No Subject"}
												</h1>

												<div className="flex items-center gap-3">
													<Avatar className="h-9 w-9 shrink-0 rounded-md cursor-pointer">
														<AvatarFallback className="bg-muted text-muted-foreground font-semibold text-sm rounded-md">
															{(selectedCommunication.direction === "inbound"
																? selectedCommunication.from?.[0]
																: selectedCommunication.to?.[0]
															)?.toUpperCase() || "?"}
														</AvatarFallback>
													</Avatar>

													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2">
															<span className="font-semibold text-sm text-foreground">
																{selectedCommunication.direction === "inbound"
																	? selectedCommunication.from || "Unknown"
																	: selectedCommunication.to || "Unknown"}
															</span>
															{(selectedCommunication.status === "unread" ||
																selectedCommunication.status === "new") && (
																<div className="h-2 w-2 rounded-full bg-primary" />
															)}
														</div>
														<div className="flex items-center gap-2 text-xs text-muted-foreground">
															<span>
																{selectedCommunication.direction === "inbound"
																	? `from ${selectedCommunication.from?.split("@")[0] || "unknown"}`
																	: `to ${selectedCommunication.to?.split("@")[0] || "unknown"}`}
															</span>
															{selectedCommunication.companyName && (
																<Badge variant="outline" className="gap-1">
																	<Building2 className="h-2.5 w-2.5" />
																	{selectedCommunication.companyName}
																</Badge>
															)}
														</div>
													</div>

													<div className="flex items-center gap-2">
														<span className="text-xs text-muted-foreground whitespace-nowrap">
															{formatDate(selectedCommunication.createdAt)} at{" "}
															{formatTime(selectedCommunication.createdAt)}
														</span>
													</div>
												</div>

												{/* Type and status badges */}
												<div className="flex items-center gap-2 flex-wrap">
													{selectedCommunication.type && (
														<Badge variant="outline" className="gap-1">
															{getTypeConfig(selectedCommunication.type).label}
														</Badge>
													)}
													{selectedCommunication.status && (
														<Badge variant="outline" className="gap-1">
															{selectedCommunication.status}
														</Badge>
													)}
												</div>
											</div>

											{/* Message Content */}
											<div className="flex-1 px-4 py-4 overflow-y-auto">
												<div className="prose prose-sm max-w-none dark:prose-invert">
													<p className="whitespace-pre-wrap">
														{selectedCommunication.preview || "No content"}
													</p>
												</div>
											</div>

											{/* Reply Composer */}
											{replyMode && (selectedCommunication.type === "email" || selectedCommunication.type === "ticket") && (
												<div className="border-t border-border/50 p-4">
													<AdminEmailReplyComposer
														mode={replyMode}
														selectedMessage={selectedCommunication}
														onClose={handleCloseReply}
														onSent={handleReplySent}
													/>
												</div>
											)}
										</div>
									)}
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
						<p className="text-sm text-muted-foreground">
							Select a communication from the list to view details
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
