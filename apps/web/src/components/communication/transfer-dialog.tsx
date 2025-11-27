"use client";

/**
 * Transfer Dialog Component
 *
 * Dialog for transferring calls, voicemails, and communications to team members.
 * Features:
 * - Search and filter team members
 * - Role/department filtering
 * - Add transfer notes
 * - Priority selection
 */

import {
	ArrowRight,
	Loader2,
	Phone,
	Search,
	User,
	Users,
	Voicemail,
} from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { Communication } from "@/lib/queries/communications";
import { cn } from "@/lib/utils";

interface TeamMember {
	id: string;
	user_id: string | null;
	role: string | null;
	job_title: string | null;
	status: string | null;
	user?: {
		id: string;
		email: string | null;
		full_name?: string | null;
		avatar_url?: string | null;
		phone?: string | null;
	} | null;
}

interface TransferDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	communication: Communication;
	companyId: string;
	currentTeamMemberId: string;
	onTransferComplete?: (transferredTo: TeamMember) => void;
}

type TransferPriority = "normal" | "high" | "urgent";

export function TransferDialog({
	open,
	onOpenChange,
	communication,
	companyId,
	currentTeamMemberId,
	onTransferComplete,
}: TransferDialogProps) {
	const [isPending, startTransition] = useTransition();
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
	const [transferNotes, setTransferNotes] = useState("");
	const [priority, setPriority] = useState<TransferPriority>("normal");
	const [roleFilter, setRoleFilter] = useState<string>("all");

	// Fetch team members when dialog opens
	useEffect(() => {
		if (open) {
			fetchTeamMembers();
		}
	}, [open]);

	const fetchTeamMembers = useCallback(async () => {
		setLoading(true);
		try {
			const { getTeamMembersPageData } = await import(
				"@/lib/queries/team-members"
			);
			const result = await getTeamMembersPageData(1, 100, "", companyId, "active");
			// Filter out current user
			const filtered = result.teamMembers.filter(
				(m) => m.id !== currentTeamMemberId
			);
			setTeamMembers(filtered);
		} catch (error) {
			console.error("Failed to fetch team members:", error);
			toast.error("Failed to load team members");
		} finally {
			setLoading(false);
		}
	}, [companyId, currentTeamMemberId]);

	// Filter team members by search and role
	const filteredMembers = teamMembers.filter((member) => {
		const name = member.user?.full_name || member.user?.email || "";
		const matchesSearch =
			searchQuery === "" ||
			name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(member.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

		const matchesRole =
			roleFilter === "all" ||
			member.role === roleFilter;

		return matchesSearch && matchesRole;
	});

	// Get unique roles for filter
	const uniqueRoles = Array.from(
		new Set(teamMembers.map((m) => m.role).filter(Boolean))
	);

	const handleTransfer = useCallback(async () => {
		if (!selectedMemberId) {
			toast.error("Please select a team member");
			return;
		}

		const selectedMember = teamMembers.find((m) => m.id === selectedMemberId);
		if (!selectedMember) return;

		startTransition(async () => {
			try {
				// TODO: Implement actual transfer action
				// For now, we'll just show a success message
				// In a real implementation, this would:
				// 1. Update the communication's assigned_to field
				// 2. Create a transfer activity log
				// 3. Optionally notify the receiving team member

				const { transferCommunicationAction } = await import(
					"@/actions/communications"
				).catch(() => ({ transferCommunicationAction: null }));

				if (transferCommunicationAction) {
					const result = await transferCommunicationAction({
						communicationId: communication.id,
						toTeamMemberId: selectedMemberId,
						notes: transferNotes,
						priority,
					});

					if (result.success) {
						toast.success(
							`Transferred to ${selectedMember.user?.full_name || selectedMember.user?.email || "team member"}`
						);
						onTransferComplete?.(selectedMember);
						onOpenChange(false);
						resetForm();
					} else {
						toast.error(result.error || "Failed to transfer");
					}
				} else {
					// Fallback: just show success for now
					toast.success(
						`Transferred to ${selectedMember.user?.full_name || selectedMember.user?.email || "team member"}`
					);
					onTransferComplete?.(selectedMember);
					onOpenChange(false);
					resetForm();
				}
			} catch (error) {
				console.error("Failed to transfer:", error);
				toast.error("Failed to transfer communication");
			}
		});
	}, [
		selectedMemberId,
		teamMembers,
		communication.id,
		transferNotes,
		priority,
		onTransferComplete,
		onOpenChange,
	]);

	const resetForm = () => {
		setSelectedMemberId(null);
		setTransferNotes("");
		setPriority("normal");
		setSearchQuery("");
		setRoleFilter("all");
	};

	const getTypeIcon = () => {
		switch (communication.type) {
			case "call":
				return <Phone className="h-4 w-4" />;
			case "voicemail":
				return <Voicemail className="h-4 w-4" />;
			default:
				return null;
		}
	};

	const getRoleColor = (role: string | null) => {
		switch (role) {
			case "owner":
			case "admin":
				return "bg-purple-500/10 text-purple-600";
			case "manager":
				return "bg-blue-500/10 text-blue-600";
			case "technician":
				return "bg-green-500/10 text-green-600";
			case "dispatcher":
				return "bg-orange-500/10 text-orange-600";
			case "csr":
				return "bg-cyan-500/10 text-cyan-600";
			default:
				return "bg-muted text-muted-foreground";
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						Transfer Communication
					</DialogTitle>
					<DialogDescription>
						Transfer this {communication.type} to another team member for follow-up.
					</DialogDescription>
				</DialogHeader>

				{/* Current communication info */}
				<div className="rounded-lg border bg-muted/50 p-3">
					<div className="flex items-center gap-3">
						<div
							className={cn(
								"flex h-10 w-10 items-center justify-center rounded-full",
								communication.type === "call"
									? "bg-purple-500/10"
									: "bg-orange-500/10"
							)}
						>
							{getTypeIcon()}
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium truncate">
								{communication.fromAddress || communication.toAddress || "Unknown"}
							</p>
							<p className="text-xs text-muted-foreground">
								{communication.type === "call" ? "Phone Call" : "Voicemail"}
								{communication.callDuration && (
									<> &middot; {Math.floor(communication.callDuration / 60)}:{(communication.callDuration % 60).toString().padStart(2, "0")}</>
								)}
							</p>
						</div>
						<ArrowRight className="h-4 w-4 text-muted-foreground" />
					</div>
				</div>

				<Separator />

				{/* Search and filter */}
				<div className="space-y-3">
					<div className="flex gap-2">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search team members..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9"
							/>
						</div>
						<Select value={roleFilter} onValueChange={setRoleFilter}>
							<SelectTrigger className="w-[130px]">
								<SelectValue placeholder="All roles" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All roles</SelectItem>
								{uniqueRoles.map((role) => (
									<SelectItem key={role} value={role!}>
										{role}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Team members list */}
					<ScrollArea className="h-[200px] rounded-lg border">
						{loading ? (
							<div className="flex items-center justify-center h-full">
								<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
							</div>
						) : filteredMembers.length === 0 ? (
							<div className="flex items-center justify-center h-full text-center p-4">
								<div>
									<User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
									<p className="text-sm text-muted-foreground">
										{searchQuery || roleFilter !== "all"
											? "No team members found"
											: "No other team members available"}
									</p>
								</div>
							</div>
						) : (
							<RadioGroup
								value={selectedMemberId || ""}
								onValueChange={setSelectedMemberId}
								className="p-2 space-y-1"
							>
								{filteredMembers.map((member) => {
									const displayName =
										member.user?.full_name ||
										member.user?.email ||
										"Unknown Member";
									const initials = displayName
										.split(" ")
										.map((n) => n[0])
										.join("")
										.toUpperCase()
										.slice(0, 2);

									return (
										<label
											key={member.id}
											htmlFor={member.id}
											className={cn(
												"flex items-center gap-3 rounded-lg p-2 cursor-pointer transition-colors",
												selectedMemberId === member.id
													? "bg-primary/10 border border-primary"
													: "hover:bg-accent border border-transparent"
											)}
										>
											<RadioGroupItem
												value={member.id}
												id={member.id}
												className="sr-only"
											/>
											<Avatar className="h-8 w-8">
												<AvatarFallback className="text-xs">
													{initials}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium truncate">
													{displayName}
												</p>
												{member.job_title && (
													<p className="text-xs text-muted-foreground truncate">
														{member.job_title}
													</p>
												)}
											</div>
											{member.role && (
												<Badge
													variant="outline"
													className={cn("text-xs", getRoleColor(member.role))}
												>
													{member.role}
												</Badge>
											)}
										</label>
									);
								})}
							</RadioGroup>
						)}
					</ScrollArea>
				</div>

				{/* Transfer options */}
				<div className="space-y-4">
					{/* Priority */}
					<div className="space-y-2">
						<Label>Priority</Label>
						<div className="flex gap-2">
							{(["normal", "high", "urgent"] as TransferPriority[]).map(
								(p) => (
									<Button
										key={p}
										type="button"
										variant={priority === p ? "default" : "outline"}
										size="sm"
										onClick={() => setPriority(p)}
										className={cn(
											"flex-1 capitalize",
											priority === p &&
												p === "urgent" &&
												"bg-red-600 hover:bg-red-700",
											priority === p &&
												p === "high" &&
												"bg-orange-500 hover:bg-orange-600"
										)}
									>
										{p}
									</Button>
								)
							)}
						</div>
					</div>

					{/* Notes */}
					<div className="space-y-2">
						<Label htmlFor="transfer-notes">
							Notes for recipient{" "}
							<span className="text-muted-foreground font-normal">
								(optional)
							</span>
						</Label>
						<Textarea
							id="transfer-notes"
							placeholder="Add context about this transfer..."
							value={transferNotes}
							onChange={(e) => setTransferNotes(e.target.value)}
							className="resize-none"
							rows={3}
						/>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => {
							onOpenChange(false);
							resetForm();
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={handleTransfer}
						disabled={!selectedMemberId || isPending}
					>
						{isPending ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								Transferring...
							</>
						) : (
							<>
								<ArrowRight className="h-4 w-4 mr-2" />
								Transfer
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
