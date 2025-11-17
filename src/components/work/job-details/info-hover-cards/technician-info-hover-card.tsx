/**
 * Technician Info Hover Card
 * Shows technician/team member details on hover with quick copy functionality
 */

"use client";

import { Check, Copy, Mail, Phone, User, Users } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

type TechnicianInfoHoverCardProps = {
	technician?: {
		id: string;
		first_name?: string | null;
		last_name?: string | null;
		email?: string | null;
		phone?: string | null;
		role?: string | null;
		avatar_url?: string | null;
	};
	teamMembers?: Array<{
		id: string;
		user_id?: string;
		role?: string | null;
		users?: {
			first_name?: string | null;
			last_name?: string | null;
			email?: string | null;
			phone?: string | null;
			avatar_url?: string | null;
		};
	}>;
};

export function TechnicianInfoHoverCard({
	technician,
	teamMembers = [],
}: TechnicianInfoHoverCardProps) {
	const [copiedField, setCopiedField] = useState<string | null>(null);

	const copyToClipboard = (text: string, field: string) => {
		navigator.clipboard.writeText(text);
		setCopiedField(field);
		setTimeout(() => setCopiedField(null), 2000);
	};

	// If we have a primary technician, show them
	const primaryTech = technician;
	const additionalTeam = teamMembers.filter((member) => member.user_id !== technician?.id);

	const displayName = primaryTech
		? `${primaryTech.first_name || ""} ${primaryTech.last_name || ""}`.trim() || "Technician"
		: "Team";

	const getInitials = (firstName?: string | null, lastName?: string | null) =>
		`${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "T";

	// If no technician or team members, don't render
	if (!primaryTech && teamMembers.length === 0) {
		return null;
	}

	return (
		<HoverCard openDelay={200}>
			<HoverCardTrigger asChild>
				<Button className="inline-flex items-center gap-2 rounded-full" size="sm" variant="outline">
					{primaryTech ? (
						<>
							<User className="size-4" />
							{displayName}
						</>
					) : (
						<>
							<Users className="size-4" />
							{teamMembers.length} Team {teamMembers.length === 1 ? "Member" : "Members"}
						</>
					)}
				</Button>
			</HoverCardTrigger>
			<HoverCardContent align="start" className="w-80" side="bottom">
				<div className="space-y-3">
					{/* Primary Technician */}
					{primaryTech && (
						<>
							<div className="flex items-start gap-3">
								<Avatar className="size-10">
									<AvatarImage alt={displayName} src={primaryTech.avatar_url ?? undefined} />
									<AvatarFallback>
										{getInitials(primaryTech.first_name, primaryTech.last_name)}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1">
									<h4 className="text-sm font-semibold">{displayName}</h4>
									{primaryTech.role && (
										<p className="text-muted-foreground text-xs capitalize">{primaryTech.role}</p>
									)}
								</div>
							</div>

							<Separator />

							{/* Contact Info */}
							<div className="space-y-2">
								{primaryTech.email && (
									<div className="group flex items-center justify-between gap-2">
										<div className="flex min-w-0 flex-1 items-center gap-2">
											<Mail className="text-muted-foreground size-3.5 shrink-0" />
											<a
												className="hover:text-primary truncate text-sm hover:underline"
												href={`mailto:${primaryTech.email}`}
											>
												{primaryTech.email}
											</a>
										</div>
										<Button
											className="size-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
											onClick={(e) => {
												e.preventDefault();
												copyToClipboard(primaryTech.email!, "email");
											}}
											size="icon"
											variant="ghost"
										>
											{copiedField === "email" ? (
												<Check className="size-3" />
											) : (
												<Copy className="size-3" />
											)}
										</Button>
									</div>
								)}

								{primaryTech.phone && (
									<div className="group flex items-center justify-between gap-2">
										<div className="flex min-w-0 flex-1 items-center gap-2">
											<Phone className="text-muted-foreground size-3.5 shrink-0" />
											<a
												className="hover:text-primary text-sm hover:underline"
												href={`tel:${primaryTech.phone}`}
											>
												{primaryTech.phone}
											</a>
										</div>
										<Button
											className="size-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
											onClick={(e) => {
												e.preventDefault();
												copyToClipboard(primaryTech.phone!, "phone");
											}}
											size="icon"
											variant="ghost"
										>
											{copiedField === "phone" ? (
												<Check className="size-3" />
											) : (
												<Copy className="size-3" />
											)}
										</Button>
									</div>
								)}
							</div>
						</>
					)}

					{/* Additional Team Members */}
					{additionalTeam.length > 0 && (
						<>
							<Separator />
							<div className="space-y-2">
								<div className="text-muted-foreground flex items-center gap-2 text-sm">
									<Users className="size-3.5" />
									<span>Additional Team Members</span>
								</div>
								<div className="space-y-1">
									{additionalTeam.map((member) => {
										const memberName = member.users
											? `${member.users.first_name || ""} ${member.users.last_name || ""}`.trim()
											: "Team Member";

										return (
											<div
												className="hover:bg-muted/50 flex items-center gap-2 rounded-md p-2"
												key={member.id}
											>
												<Avatar className="size-6">
													<AvatarImage
														alt={memberName}
														src={member.users?.avatar_url ?? undefined}
													/>
													<AvatarFallback className="text-xs">
														{getInitials(member.users?.first_name, member.users?.last_name)}
													</AvatarFallback>
												</Avatar>
												<div className="flex-1">
													<p className="text-sm">{memberName}</p>
													{member.role && (
														<p className="text-muted-foreground text-xs capitalize">
															{member.role}
														</p>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</>
					)}

					{/* Show only team members if no primary tech */}
					{!primaryTech && teamMembers.length > 0 && (
						<div className="space-y-2">
							{teamMembers.map((member) => {
								const memberName = member.users
									? `${member.users.first_name || ""} ${member.users.last_name || ""}`.trim()
									: "Team Member";
								const memberEmail = member.users?.email;
								const memberPhone = member.users?.phone;

								return (
									<div className="space-y-2 rounded-md border p-3" key={member.id}>
										<div className="flex items-center gap-2">
											<Avatar className="size-8">
												<AvatarImage alt={memberName} src={member.users?.avatar_url ?? undefined} />
												<AvatarFallback className="text-xs">
													{getInitials(member.users?.first_name, member.users?.last_name)}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<p className="text-sm font-medium">{memberName}</p>
												{member.role && (
													<p className="text-muted-foreground text-xs capitalize">{member.role}</p>
												)}
											</div>
										</div>
										{(memberEmail || memberPhone) && (
											<div className="space-y-1">
												{memberEmail && (
													<a
														className="hover:text-primary flex items-center gap-2 text-sm hover:underline"
														href={`mailto:${memberEmail}`}
													>
														<Mail className="text-muted-foreground size-3" />
														<span className="truncate">{memberEmail}</span>
													</a>
												)}
												{memberPhone && (
													<a
														className="hover:text-primary flex items-center gap-2 text-sm hover:underline"
														href={`tel:${memberPhone}`}
													>
														<Phone className="text-muted-foreground size-3" />
														{memberPhone}
													</a>
												)}
											</div>
										)}
									</div>
								);
							})}
						</div>
					)}
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
