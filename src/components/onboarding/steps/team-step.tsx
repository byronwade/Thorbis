"use client";

/**
 * Team Step - Team Members & Invitations
 *
 * Features:
 * - Shows current user (owner) as first member, non-removable
 * - Ability to add team members for all company sizes
 * - Role selection with descriptions
 */

import { useState } from "react";
import { useOnboardingStore, COMPANY_SIZES } from "@/lib/onboarding/onboarding-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
	Users,
	Plus,
	Trash2,
	Send,
	Check,
	UserPlus,
	Shield,
	Briefcase,
	Wrench,
	Phone,
	Crown,
	Loader2,
	CheckCircle2,
} from "lucide-react";

const TEAM_ROLES = [
	{ value: "admin", label: "Admin", description: "Full access to everything", icon: Shield },
	{ value: "manager", label: "Manager", description: "Manage team & scheduling", icon: Briefcase },
	{ value: "technician", label: "Technician", description: "View jobs & update status", icon: Wrench },
	{ value: "office", label: "Office Staff", description: "Scheduling & customer service", icon: Phone },
];

interface TeamInvite {
	id: string;
	email: string;
	name: string;
	role: string;
	status: "pending" | "sent";
}

export function TeamStep() {
	const { data, updateData } = useOnboardingStore();
	const [invites, setInvites] = useState<TeamInvite[]>(
		// Initialize from stored data if any
		(data.teamInvites || []).map((inv, i) => ({
			id: `invite-${i}`,
			email: inv.email,
			name: inv.name,
			role: inv.role,
			status: "sent" as const,
		}))
	);
	const [sending, setSending] = useState(false);

	const companySize = COMPANY_SIZES.find((s) => s.value === data.path);
	const isSolo = data.path === "solo";

	// Owner info from onboarding data
	const ownerName = data.userName || "You";
	const ownerEmail = data.userEmail || data.companyEmail || "";

	const addInvite = () => {
		setInvites([
			...invites,
			{
				id: `invite-${Date.now()}`,
				email: "",
				name: "",
				role: "technician",
				status: "pending",
			},
		]);
	};

	const updateInvite = (id: string, updates: Partial<TeamInvite>) => {
		setInvites(invites.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv)));
	};

	const removeInvite = (id: string) => {
		setInvites(invites.filter((inv) => inv.id !== id));
	};

	const sendInvites = async () => {
		const pendingInvites = invites.filter(i => i.status === "pending" && i.email);
		if (pendingInvites.length === 0) return;

		setSending(true);
		await new Promise((resolve) => setTimeout(resolve, 1500));

		const updatedInvites = invites.map((inv) =>
			inv.status === "pending" && inv.email ? { ...inv, status: "sent" as const } : inv
		);
		setInvites(updatedInvites);

		updateData({
			teamInvites: updatedInvites
				.filter(inv => inv.email)
				.map((inv) => ({
					email: inv.email,
					name: inv.name,
					role: inv.role,
				})),
		});
		setSending(false);
	};

	const pendingCount = invites.filter((i) => i.email && i.status === "pending").length;
	const sentCount = invites.filter((i) => i.status === "sent").length;
	const totalTeamSize = 1 + invites.filter(i => i.email).length; // Owner + invites

	return (
		<div className="space-y-10">
			{/* Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">Your team</h2>
				<p className="text-muted-foreground">
					{isSolo
						? "You're set up as the owner. Add team members anytime as you grow."
						: `${companySize?.label} teams typically have ${companySize?.value === "small" ? "2-5" : companySize?.value === "growing" ? "6-20" : "20+"} members.`}
				</p>
			</div>

			{/* Team List */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<span className="text-sm font-medium text-muted-foreground">
						{totalTeamSize} {totalTeamSize === 1 ? "Member" : "Members"}
					</span>
					<Button variant="outline" size="sm" onClick={addInvite}>
						<Plus className="mr-1 h-4 w-4" />
						Add Member
					</Button>
				</div>

				{/* Owner (Current User) - Always shown, cannot be removed */}
				<div className="rounded-lg bg-primary/5 ring-1 ring-primary/20 p-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
							<Crown className="h-5 w-5" />
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2">
								<p className="font-medium truncate">{ownerName}</p>
								<span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
									You
								</span>
							</div>
							<p className="text-sm text-muted-foreground truncate">
								{ownerEmail || "Owner"} • Owner
							</p>
						</div>
						<CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
					</div>
				</div>

				{/* Team Invites */}
				{invites.length > 0 && (
					<div className="space-y-2">
						{invites.map((invite) => (
							<div
								key={invite.id}
								className={cn(
									"rounded-lg p-4",
									invite.status === "sent" ? "bg-green-500/10" : "bg-muted/40"
								)}
							>
								{invite.status === "sent" ? (
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
											<Check className="h-5 w-5 text-green-600" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-medium truncate">{invite.name || invite.email}</p>
											<p className="text-sm text-muted-foreground">
												Invite sent • {TEAM_ROLES.find((r) => r.value === invite.role)?.label}
											</p>
										</div>
									</div>
								) : (
									<div className="space-y-3">
										<div className="grid gap-3 sm:grid-cols-3">
											<Input
												placeholder="Name"
												value={invite.name}
												onChange={(e) => updateInvite(invite.id, { name: e.target.value })}
												className="h-9"
											/>
											<Input
												type="email"
												placeholder="email@example.com"
												value={invite.email}
												onChange={(e) => updateInvite(invite.id, { email: e.target.value })}
												className="h-9"
											/>
											<Select
												value={invite.role}
												onValueChange={(v) => updateInvite(invite.id, { role: v })}
											>
												<SelectTrigger className="h-9">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{TEAM_ROLES.map((role) => {
														const Icon = role.icon;
														return (
															<SelectItem key={role.value} value={role.value}>
																<div className="flex items-center gap-2">
																	<Icon className="h-4 w-4" />
																	<span>{role.label}</span>
																</div>
															</SelectItem>
														);
													})}
												</SelectContent>
											</Select>
										</div>
										<div className="flex items-center justify-between">
											<p className="text-xs text-muted-foreground">
												{TEAM_ROLES.find((r) => r.value === invite.role)?.description}
											</p>
											<Button
												variant="ghost"
												size="sm"
												className="h-8 text-muted-foreground hover:text-destructive"
												onClick={() => removeInvite(invite.id)}
											>
												<Trash2 className="mr-1 h-4 w-4" />
												Remove
											</Button>
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				)}

				{/* Empty state - show add button */}
				{invites.length === 0 && (
					<button
						type="button"
						onClick={addInvite}
						className="w-full flex items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 hover:border-muted-foreground/50 hover:bg-muted/20 transition-colors"
					>
						<UserPlus className="h-5 w-5 text-muted-foreground" />
						<span className="text-sm text-muted-foreground">Add a team member</span>
					</button>
				)}
			</div>

			{/* Send Invites Button */}
			{pendingCount > 0 && (
				<Button
					onClick={sendInvites}
					disabled={sending}
					className="w-full"
				>
					{sending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Sending Invites...
						</>
					) : (
						<>
							<Send className="mr-2 h-4 w-4" />
							Send {pendingCount} Invite{pendingCount !== 1 ? "s" : ""}
						</>
					)}
				</Button>
			)}

			{/* Summary */}
			{sentCount > 0 && pendingCount === 0 && (
				<div className="rounded-lg bg-green-500/10 p-4 flex items-center gap-3">
					<CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
					<div>
						<p className="font-medium text-green-700 dark:text-green-400">
							{sentCount} invite{sentCount !== 1 ? "s" : ""} sent
						</p>
						<p className="text-sm text-muted-foreground">
							Team members will receive an email to join your account
						</p>
					</div>
				</div>
			)}

			{/* Note */}
			<p className="text-xs text-muted-foreground text-center">
				{invites.length === 0
					? "You can skip this step and add team members later from Settings → Team"
					: "Team members will be able to log in once they accept their invitation"}
			</p>
		</div>
	);
}
