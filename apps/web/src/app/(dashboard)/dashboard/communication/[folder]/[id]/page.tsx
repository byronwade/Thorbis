/**
 * Email Detail Page with Folder Context
 * Shows a single email with shareable URL
 * Route: /dashboard/communication/[folder]/[id]
 *
 * Uses the same layout as the folder pages (email list + detail view)
 */

"use client";

import {
	AlertTriangle,
	Archive,
	ChevronLeft,
	ChevronRight,
	Forward,
	Lock,
	MoreHorizontal,
	Reply,
	ReplyAll,
	Star,
	StickyNote,
	Trash,
	X,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import type { CompanyEmail, GetEmailsResult } from "@/actions/email-actions";
import { getEmailByIdAction, getEmailsAction } from "@/actions/email-actions";
import { EmailContent } from "@/components/communication/email-content";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEmailFolder } from "@/hooks/use-email-folder";

export default function EmailDetailPage() {
	const params = useParams();
	const router = useRouter();
	const folder = (params?.folder as string) || "inbox";
	const emailId = params?.id as string;
	const [isPending, startTransition] = useTransition();

	const [email, setEmail] = useState<CompanyEmail | null>(null);
	const [emails, setEmails] = useState<GetEmailsResult | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [emailContent, setEmailContent] = useState<{
		html?: string | null;
		text?: string | null;
	} | null>(null);
	const [loadingContent, setLoadingContent] = useState(false);

	// Fetch emails for the folder (to show list on left)
	useEffect(() => {
		const fetchEmails = async () => {
			try {
				const result = await getEmailsAction({
					limit: 50,
					offset: 0,
					type: "all",
					folder: folder === "inbox" ? undefined : folder,
					sortBy: "created_at",
					sortOrder: "desc",
				});
				setEmails(result);
			} catch (err) {
				console.error("Failed to fetch emails:", err);
			}
		};
		fetchEmails();
	}, [folder]);

	// Fetch email detail
	useEffect(() => {
		if (!emailId) {
			setError("No email ID provided");
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		startTransition(async () => {
			try {
				const result = await getEmailByIdAction(emailId);

				if (!result.success || !result.email) {
					throw new Error(result.error || "Email not found");
				}

				setEmail(result.email);
				setEmailContent({
					html: result.email.body_html || null,
					text: result.email.body || null,
				});
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Failed to load email";
				setError(errorMessage);
				toast.error("Failed to load email", { description: errorMessage });
			} finally {
				setLoading(false);
			}
		});
	}, [emailId]);

	if (loading && !email) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<div className="text-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
					<p className="text-sm text-muted-foreground">Loading email...</p>
				</div>
			</div>
		);
	}

	if (error || !email) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<div className="text-center">
					<AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
					<p className="text-sm font-medium text-destructive mb-2">
						{error || "Email not found"}
					</p>
					<Button
						variant="outline"
						onClick={() => router.push(`/dashboard/communication/${folder}`)}
					>
						Back to {folder.charAt(0).toUpperCase() + folder.slice(1)}
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full w-full flex-col overflow-hidden bg-sidebar">
			<div className="flex flex-1 overflow-hidden min-h-0 gap-2">
				{/* Email List - Left Panel */}
				<div className="bg-card mb-1 w-full md:w-[400px] lg:w-[480px] shadow-sm lg:h-full lg:shadow-sm flex flex-col rounded-tr-2xl overflow-hidden">
					{/* Email List Header */}
					<div className="p-4 border-b">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => router.push(`/dashboard/communication/${folder}`)}
							className="w-full justify-start"
						>
							<ChevronLeft className="h-4 w-4 mr-2" />
							Back to {folder.charAt(0).toUpperCase() + folder.slice(1)}
						</Button>
					</div>

					{/* Email List */}
					<div className="flex-1 overflow-y-auto">
						{emails?.emails?.map((emailItem) => {
							const isSelected = emailItem.id === email.id;
							return (
								<Link
									key={emailItem.id}
									href={`/dashboard/communication/${folder}/${emailItem.id}`}
									className={`block border-b border-border/50 hover:bg-accent/50 transition-colors ${
										isSelected ? "bg-accent" : ""
									}`}
								>
									<div className="p-3 space-y-2">
										{/* From */}
										<div className="flex items-center justify-between">
											<p className="text-sm font-semibold text-foreground line-clamp-1">
												{emailItem.from_name ||
													emailItem.from_address ||
													"Unknown"}
											</p>
											{!emailItem.read_at && (
												<div className="h-2 w-2 rounded-full bg-primary shrink-0" />
											)}
										</div>

										{/* Subject */}
										<p className="text-sm text-muted-foreground line-clamp-1">
											{emailItem.subject || "No subject"}
										</p>

										{/* Time */}
										<p className="text-xs text-muted-foreground">
											{new Date(emailItem.created_at).toLocaleTimeString(
												"en-US",
												{
													hour: "numeric",
													minute: "2-digit",
												},
											)}
										</p>
									</div>
								</Link>
							);
						})}
					</div>
				</div>

				{/* Email Details - Right Panel */}
				<div className="bg-card mb-1 rounded-tl-2xl shadow-sm lg:h-full flex flex-col min-w-0 flex-1 overflow-hidden">
					<div className="relative flex-1 min-h-0 flex flex-col">
						<div className="flex flex-col h-full flex-1 min-h-0">
							<div className="bg-card relative flex flex-col overflow-hidden transition-all duration-300 h-full flex-1 min-h-0">
								{/* Email Header Toolbar */}
								<div className="sticky top-0 z-15 flex shrink-0 items-center justify-between gap-1.5 p-2 pb-0 transition-colors bg-card">
									<div className="flex flex-1 items-center gap-2">
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												router.push(`/dashboard/communication/${folder}`)
											}
											className="h-8 w-8 p-0 hover:bg-accent/80 active:bg-accent transition-colors"
										>
											<X className="h-4 w-4 text-muted-foreground" />
											<span className="sr-only">Close</span>
										</Button>
										<Separator
											orientation="vertical"
											className="h-4 bg-border/60"
										/>
									</div>
									<div className="flex items-center gap-1">
										<Button
											variant="ghost"
											size="sm"
											className="h-8 px-2 hover:bg-accent/80 active:bg-accent transition-colors"
										>
											<ReplyAll className="h-4 w-4 mr-1.5 text-muted-foreground" />
											<span className="text-sm leading-none font-medium">
												Reply all
											</span>
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0 hover:bg-accent/80 active:bg-accent transition-colors"
											title="Notes"
										>
											<StickyNote className="h-4 w-4 text-muted-foreground" />
											<span className="sr-only">Notes</span>
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0 hover:bg-accent/80 active:bg-accent transition-colors"
											title="Star"
										>
											<Star className="h-4 w-4 text-muted-foreground" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0 hover:bg-accent/80 active:bg-accent transition-colors"
											title="Archive"
										>
											<Archive className="h-4 w-4 text-muted-foreground" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0 hover:bg-destructive/10 active:bg-destructive/15 transition-colors"
											title="Delete"
										>
											<Trash className="h-4 w-4 fill-destructive text-destructive" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0 hover:bg-accent/80 active:bg-accent transition-colors"
											title="More options"
										>
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
													{email.subject || "No Subject"}
												</h1>

												{/* Sender Info Row */}
												<div className="flex items-center gap-3">
													<Avatar className="h-9 w-9 shrink-0 rounded-md cursor-pointer">
														<AvatarFallback className="bg-muted text-muted-foreground font-semibold text-sm rounded-md">
															{email.from_address?.[0]?.toUpperCase() || "U"}
														</AvatarFallback>
													</Avatar>

													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2">
															<span className="font-semibold text-sm text-foreground">
																{email.from_name ||
																	email.from_address ||
																	"Unknown"}
															</span>
															{!email.read_at && (
																<div className="h-2 w-2 rounded-full bg-primary" />
															)}
														</div>
														<div className="text-xs text-muted-foreground">
															to{" "}
															{email.to_address?.includes("@")
																? email.to_address.split("@")[0] === "me"
																	? "you"
																	: email.to_address.split("@")[0]
																: "you"}
														</div>
													</div>

													<div className="flex items-center gap-2">
														<span className="text-xs text-muted-foreground whitespace-nowrap">
															{new Date(email.created_at).toLocaleTimeString(
																"en-US",
																{
																	hour: "numeric",
																	minute: "2-digit",
																},
															)}
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
															<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
															<p className="text-sm text-muted-foreground">
																Loading email content...
															</p>
														</div>
													</div>
												) : (
													<EmailContent
														html={emailContent?.html || email.body_html || null}
														text={emailContent?.text || email.body || null}
														attachments={null}
													/>
												)}
											</div>

											{/* Reply Action Bar */}
											<div className="border-t border-border/50 px-2 py-4 bg-background">
												<div className="flex items-center gap-2">
													<Button
														variant="default"
														size="sm"
														className="h-9 px-4"
													>
														<Reply className="h-4 w-4 mr-2" />
														Reply
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="h-9 px-4"
													>
														<ReplyAll className="h-4 w-4 mr-2" />
														Reply All
													</Button>
													<Button
														variant="outline"
														size="sm"
														className="h-9 px-4"
													>
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
				</div>
			</div>
		</div>
	);
}
