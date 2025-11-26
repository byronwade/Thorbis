/**
 * Communication History Widget
 *
 * Displays a timeline of communications for a customer or job
 * Reusable component that can be embedded in customer/job detail pages
 *
 * Features:
 * - Shows all communication types (email, SMS, calls, voicemails)
 * - Type filtering
 * - Click to open in unified inbox
 * - Compact timeline view
 */

"use client";

import { formatDistanceToNow } from "date-fns";
import {
	ChevronRight,
	ExternalLink,
	Filter,
	Mail,
	MessageSquare,
	Phone,
	Voicemail,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Communication } from "@/lib/queries/communications";
import { cn } from "@/lib/utils";

interface CommunicationHistoryWidgetProps {
	communications: Communication[];
	customerId?: string;
	jobId?: string;
	maxHeight?: string;
	showFilters?: boolean;
	title?: string;
	description?: string;
}

type CommunicationType = "all" | "email" | "sms" | "call" | "voicemail";

export function CommunicationHistoryWidget({
	communications,
	customerId,
	jobId,
	maxHeight = "400px",
	showFilters = true,
	title = "Communication History",
	description,
}: CommunicationHistoryWidgetProps) {
	const [typeFilter, setTypeFilter] = useState<CommunicationType>("all");

	// Filter communications by type
	const filteredCommunications =
		typeFilter === "all"
			? communications
			: communications.filter((c) => c.type === typeFilter);

	// Count by type
	const typeCounts = {
		all: communications.length,
		email: communications.filter((c) => c.type === "email").length,
		sms: communications.filter((c) => c.type === "sms").length,
		call: communications.filter((c) => c.type === "call").length,
		voicemail: communications.filter((c) => c.type === "voicemail").length,
	};

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
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>{title}</CardTitle>
						{description && <CardDescription>{description}</CardDescription>}
					</div>
					<Button variant="ghost" size="sm" asChild className="gap-1">
						<Link
							href={`/dashboard/communication${customerId ? `?customerId=${customerId}` : jobId ? `?jobId=${jobId}` : ""}`}
						>
							View All
							<ExternalLink className="h-3.5 w-3.5" />
						</Link>
					</Button>
				</div>

				{/* Type filters */}
				{showFilters && (
					<div className="flex gap-1 mt-3">
						<Button
							variant={typeFilter === "all" ? "default" : "outline"}
							size="sm"
							onClick={() => setTypeFilter("all")}
							className="h-7 text-xs gap-1"
						>
							<Filter className="h-3 w-3" />
							All
							{typeCounts.all > 0 && (
								<Badge
									variant={typeFilter === "all" ? "secondary" : "outline"}
									className="ml-0.5 h-4 px-1 text-[10px]"
								>
									{typeCounts.all}
								</Badge>
							)}
						</Button>

						{typeCounts.email > 0 && (
							<Button
								variant={typeFilter === "email" ? "default" : "outline"}
								size="sm"
								onClick={() => setTypeFilter("email")}
								className="h-7 text-xs gap-1"
							>
								<Mail className="h-3 w-3" />
								Email
								<Badge
									variant={typeFilter === "email" ? "secondary" : "outline"}
									className="ml-0.5 h-4 px-1 text-[10px]"
								>
									{typeCounts.email}
								</Badge>
							</Button>
						)}

						{typeCounts.sms > 0 && (
							<Button
								variant={typeFilter === "sms" ? "default" : "outline"}
								size="sm"
								onClick={() => setTypeFilter("sms")}
								className="h-7 text-xs gap-1"
							>
								<MessageSquare className="h-3 w-3" />
								SMS
								<Badge
									variant={typeFilter === "sms" ? "secondary" : "outline"}
									className="ml-0.5 h-4 px-1 text-[10px]"
								>
									{typeCounts.sms}
								</Badge>
							</Button>
						)}

						{typeCounts.call > 0 && (
							<Button
								variant={typeFilter === "call" ? "default" : "outline"}
								size="sm"
								onClick={() => setTypeFilter("call")}
								className="h-7 text-xs gap-1"
							>
								<Phone className="h-3 w-3" />
								Calls
								<Badge
									variant={typeFilter === "call" ? "secondary" : "outline"}
									className="ml-0.5 h-4 px-1 text-[10px]"
								>
									{typeCounts.call}
								</Badge>
							</Button>
						)}

						{typeCounts.voicemail > 0 && (
							<Button
								variant={typeFilter === "voicemail" ? "default" : "outline"}
								size="sm"
								onClick={() => setTypeFilter("voicemail")}
								className="h-7 text-xs gap-1"
							>
								<Voicemail className="h-3 w-3" />
								Voicemail
								<Badge
									variant={typeFilter === "voicemail" ? "secondary" : "outline"}
									className="ml-0.5 h-4 px-1 text-[10px]"
								>
									{typeCounts.voicemail}
								</Badge>
							</Button>
						)}
					</div>
				)}
			</CardHeader>

			<CardContent>
				{filteredCommunications.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground text-sm">
						No communications found
					</div>
				) : (
					<ScrollArea style={{ maxHeight }}>
						<div className="space-y-3">
							{filteredCommunications.map((communication, index) => {
								const typeConfig = getTypeConfig(communication.type);
								const TypeIcon = typeConfig.icon;

								return (
									<Link
										key={communication.id}
										href={`/dashboard/communication?id=${communication.id}`}
										className={cn(
											"block group rounded-lg border p-3 hover:bg-accent/50 transition-colors",
											index === 0 && "border-primary/20",
										)}
									>
										<div className="flex items-start gap-3">
											{/* Type icon */}
											<div
												className={cn("rounded-full p-2 mt-0.5", typeConfig.bg)}
											>
												<TypeIcon
													className={cn("h-3.5 w-3.5", typeConfig.color)}
												/>
											</div>

											{/* Content */}
											<div className="flex-1 min-w-0 space-y-1">
												<div className="flex items-center justify-between gap-2">
													<p className="font-medium text-sm truncate">
														{communication.subject ||
															(communication.type === "sms"
																? "Text Message"
																: "No Subject")}
													</p>
													<ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
												</div>

												<div className="flex items-center gap-2 text-xs text-muted-foreground">
													<span className="capitalize">
														{communication.direction}
													</span>
													<span>•</span>
													<span>
														{communication.direction === "inbound"
															? communication.fromAddress || "Unknown"
															: communication.toAddress || "Unknown"}
													</span>
												</div>

												{communication.body && (
													<p className="text-xs text-muted-foreground line-clamp-2">
														{communication.body}
													</p>
												)}

												<div className="flex items-center gap-2 flex-wrap">
													<Badge variant="outline" className="text-xs">
														{formatDistanceToNow(
															new Date(communication.createdAt),
															{ addSuffix: true },
														)}
													</Badge>

													{communication.status && (
														<Badge variant="outline" className="text-xs">
															{communication.status}
														</Badge>
													)}

													{communication.internalNotes && (
														<Badge variant="secondary" className="text-xs">
															Has notes
														</Badge>
													)}
												</div>
											</div>
										</div>
									</Link>
								);
							})}
						</div>
					</ScrollArea>
				)}
			</CardContent>
		</Card>
	);
}
