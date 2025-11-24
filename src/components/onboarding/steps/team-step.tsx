"use client";

/**
 * Team Step - Invite Team Members
 *
 * Allows inviting team members during onboarding.
 * Shows different options based on company size selection.
 */

import { useState } from "react";
import { useOnboardingStore, COMPANY_SIZES } from "@/lib/onboarding/onboarding-store";
import { InfoCard } from "@/components/onboarding/info-cards/walkthrough-slide";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
	Mail,
	Send,
	CheckCircle2,
	Clock,
	Sparkles,
	UserPlus,
	Shield,
	Briefcase,
	Wrench,
	Phone,
	SkipForward,
} from "lucide-react";

const TEAM_ROLES = [
	{
		value: "admin",
		label: "Admin",
		description: "Full access to settings and team management",
		icon: Shield,
		permissions: ["All features", "User management", "Billing", "Settings"],
	},
	{
		value: "manager",
		label: "Manager",
		description: "Oversee operations, scheduling, and reports",
		icon: Briefcase,
		permissions: ["Jobs", "Scheduling", "Reports", "Team schedules"],
	},
	{
		value: "technician",
		label: "Technician",
		description: "Field work, job completion, time tracking",
		icon: Wrench,
		permissions: ["Assigned jobs", "Time tracking", "Photos", "Notes"],
	},
	{
		value: "office",
		label: "Office Staff",
		description: "Customer service, scheduling, invoicing",
		icon: Phone,
		permissions: ["Customers", "Scheduling", "Invoices", "Communication"],
	},
];

interface TeamInvite {
	id: string;
	email: string;
	name: string;
	role: string;
	status: "pending" | "sent" | "error";
}

export function TeamStep() {
	const { data, updateData } = useOnboardingStore();
	const [invites, setInvites] = useState<TeamInvite[]>([]);
	const [sending, setSending] = useState(false);

	const companySize = COMPANY_SIZES.find((s) => s.value === data.path);
	const isSolo = data.path === "solo";

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
		setSending(true);
		// Simulate sending invites
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setInvites(invites.map((inv) => ({ ...inv, status: "sent" })));
		updateData({
			teamInvites: invites.map((inv) => ({
				email: inv.email,
				name: inv.name,
				role: inv.role,
			})),
		});
		setSending(false);
	};

	const skipStep = () => {
		updateData({ teamInvites: [] });
	};

	// For solo operators, show simplified version
	if (isSolo) {
		return (
			<div className="space-y-6 max-w-2xl">
				<div>
					<h2 className="text-xl font-semibold">Team setup</h2>
					<p className="text-sm text-muted-foreground">
						As a solo operator, you can skip this step. You can always add team members later.
					</p>
				</div>

				<InfoCard
					icon={<Sparkles className="h-5 w-5" />}
					title="Growing your team later?"
					description="When you're ready to expand, adding team members is easy. They'll get their own mobile app access, can be assigned to jobs, and their work is automatically tracked."
					variant="tip"
				/>

				<div className="rounded-xl bg-muted/30 p-6 text-center space-y-4">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
						<Users className="h-8 w-8 text-primary" />
					</div>
					<div>
						<p className="font-medium">You're all set as a solo operator</p>
						<p className="text-sm text-muted-foreground mt-1">
							You can add team members anytime from Settings → Team
						</p>
					</div>
				</div>

				<Button variant="outline" className="w-full" onClick={skipStep}>
					<SkipForward className="mr-2 h-4 w-4" />
					Continue Without Team
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6 max-w-2xl">
			<div>
				<h2 className="text-xl font-semibold">Invite your team</h2>
				<p className="text-sm text-muted-foreground">
					{companySize?.label} teams typically have {companySize?.value === "small" ? "2-5" : companySize?.value === "growing" ? "6-20" : "20+"} members.
					Invite them now or add them later.
				</p>
			</div>

			{/* Why Invite Now */}
			<InfoCard
				icon={<Sparkles className="h-5 w-5" />}
				title="Why invite team members now?"
				description="Team members who are part of onboarding learn the system faster and are more likely to adopt it fully."
				bullets={[
					"They receive personalized setup instructions",
					"Their schedules can be configured during setup",
					"Dispatch and job assignment work from day one",
				]}
				variant="tip"
			/>

			{/* Role Overview */}
			<div className="space-y-3">
				<h3 className="font-semibold text-sm">Available Roles</h3>
				<div className="grid gap-3 sm:grid-cols-2">
					{TEAM_ROLES.map((role) => {
						const Icon = role.icon;
						return (
							<div key={role.value} className="rounded-lg bg-muted/30 p-3">
								<div className="flex items-center gap-2 mb-2">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
										<Icon className="h-4 w-4" />
									</div>
									<div>
										<p className="font-medium text-sm">{role.label}</p>
										<p className="text-xs text-muted-foreground">{role.description}</p>
									</div>
								</div>
								<div className="flex flex-wrap gap-1">
									{role.permissions.slice(0, 3).map((perm, i) => (
										<Badge key={i} variant="secondary" className="text-xs">
											{perm}
										</Badge>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Invite List */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="font-semibold">Team Invitations</h3>
					<Button variant="outline" size="sm" onClick={addInvite}>
						<Plus className="mr-1 h-4 w-4" />
						Add Person
					</Button>
				</div>

				{invites.length === 0 ? (
					<div className="rounded-xl bg-muted/30 p-8 text-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto mb-3">
							<UserPlus className="h-6 w-6 text-muted-foreground" />
						</div>
						<p className="font-medium">No team members yet</p>
						<p className="text-sm text-muted-foreground mt-1 mb-4">
							Click "Add Person" to invite your first team member
						</p>
						<Button onClick={addInvite}>
							<Plus className="mr-2 h-4 w-4" />
							Add Team Member
						</Button>
					</div>
				) : (
					<div className="space-y-3">
						{invites.map((invite) => (
							<div
								key={invite.id}
								className={cn(
									"rounded-xl bg-muted/30 p-4 space-y-3",
									invite.status === "sent" && "ring-1 ring-green-500/30 bg-green-500/5"
								)}
							>
								{invite.status === "sent" ? (
									<div className="flex items-center gap-3">
										<CheckCircle2 className="h-5 w-5 text-green-500" />
										<div className="flex-1">
											<p className="font-medium">{invite.name || invite.email}</p>
											<p className="text-sm text-muted-foreground">
												Invite sent • {TEAM_ROLES.find((r) => r.value === invite.role)?.label}
											</p>
										</div>
									</div>
								) : (
									<>
										<div className="grid gap-3 sm:grid-cols-3">
											<Input
												placeholder="Name"
												value={invite.name}
												onChange={(e) => updateInvite(invite.id, { name: e.target.value })}
											/>
											<Input
												type="email"
												placeholder="email@example.com"
												value={invite.email}
												onChange={(e) => updateInvite(invite.id, { email: e.target.value })}
											/>
											<Select
												value={invite.role}
												onValueChange={(v) => updateInvite(invite.id, { role: v })}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{TEAM_ROLES.map((role) => (
														<SelectItem key={role.value} value={role.value}>
															{role.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<div className="flex justify-end">
											<Button
												variant="ghost"
												size="sm"
												className="text-muted-foreground hover:text-destructive"
												onClick={() => removeInvite(invite.id)}
											>
												<Trash2 className="mr-1 h-4 w-4" />
												Remove
											</Button>
										</div>
									</>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Actions */}
			{invites.length > 0 && invites.some((i) => i.status === "pending") && (
				<Button
					onClick={sendInvites}
					disabled={sending || invites.every((i) => !i.email)}
					className="w-full"
				>
					{sending ? (
						<>
							<Clock className="mr-2 h-4 w-4 animate-spin" />
							Sending Invites...
						</>
					) : (
						<>
							<Send className="mr-2 h-4 w-4" />
							Send {invites.filter((i) => i.email && i.status === "pending").length} Invite{invites.filter((i) => i.email && i.status === "pending").length !== 1 ? "s" : ""}
						</>
					)}
				</Button>
			)}

			{/* Skip Option */}
			<div className="text-center">
				<button
					onClick={skipStep}
					className="text-sm text-muted-foreground hover:text-foreground"
				>
					Skip for now — add team members later
				</button>
			</div>
		</div>
	);
}
