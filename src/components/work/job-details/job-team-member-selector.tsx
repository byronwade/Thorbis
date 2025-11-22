"use client";

import { Check, ChevronsUpDown, Search, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Job Team Member Selector
 *
 * Popover-based selector for adding team members to a job.
 *
 * Features:
 * - Search across available team members
 * - Role selection (primary, supervisor, assistant, crew)
 * - Shows job title and email
 * - Prevents duplicate assignments
 */

type TeamMember = {
	id: string;
	userId: string;
	jobTitle: string | null;
	user: {
		id: string;
		email: string;
		firstName: string | null;
		lastName: string | null;
		avatarUrl: string | null;
		phone: string | null;
	};
};

type JobTeamMemberSelectorProps = {
	availableMembers: TeamMember[];
	currentMemberIds: string[];
	onAssign: (memberId: string, role: string) => Promise<void>;
	trigger?: React.ReactNode;
};

export function JobTeamMemberSelector({
	availableMembers,
	currentMemberIds,
	onAssign,
	trigger,
}: JobTeamMemberSelectorProps) {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
	const [selectedRole, setSelectedRole] = useState<string>("crew");
	const [isAssigning, setIsAssigning] = useState(false);

	// Filter available members (exclude already assigned)
	const filteredMembers = availableMembers.filter(
		(member) => !currentMemberIds.includes(member.id),
	);

	// Search members
	const searchResults = searchQuery.trim()
		? filteredMembers.filter((member) => {
				const query = searchQuery.toLowerCase();
				const name = [member.user.firstName, member.user.lastName]
					.filter(Boolean)
					.join(" ")
					.toLowerCase();
				return (
					name.includes(query) ||
					member.user.email?.toLowerCase().includes(query) ||
					member.jobTitle?.toLowerCase().includes(query)
				);
			})
		: filteredMembers;

	const handleAssign = async () => {
		if (!selectedMember) return;

		setIsAssigning(true);
		try {
			await onAssign(selectedMember.id, selectedRole);
			setOpen(false);
			setSelectedMember(null);
			setSelectedRole("crew");
			setSearchQuery("");
		} finally {
			setIsAssigning(false);
		}
	};

	const getMemberName = (member: TeamMember) => {
		return (
			[member.user.firstName, member.user.lastName].filter(Boolean).join(" ") ||
			member.user.email
		);
	};

	return (
		<Popover
			open={open}
			onOpenChange={(newOpen) => {
				setOpen(newOpen);
				// Reset selection when closing
				if (!newOpen) {
					setSelectedMember(null);
					setSelectedRole("crew");
					setSearchQuery("");
				}
			}}
		>
			<PopoverTrigger asChild>
				{trigger || (
					<Button variant="outline" size="sm">
						<Users className="mr-2 h-4 w-4" />
						Add Team Member
					</Button>
				)}
			</PopoverTrigger>
			<PopoverContent className="w-[400px] p-0" align="start">
				<Command shouldFilter={false}>
					<CommandInput
						placeholder="Search team members..."
						value={searchQuery}
						onValueChange={setSearchQuery}
					/>
					<CommandList>
						{searchResults.length === 0 && (
							<CommandEmpty>
								{searchQuery.trim()
									? "No team members found"
									: "No available team members"}
							</CommandEmpty>
						)}
						{searchResults.length > 0 && (
							<CommandGroup heading="Available Team Members">
								{searchResults.map((member) => (
									<div
										key={member.id}
										onClick={() => setSelectedMember(member)}
										className={cn(
											"relative flex cursor-pointer select-none items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
											selectedMember?.id === member.id && "bg-accent",
										)}
									>
										<div className="flex items-center gap-2">
											<div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
												<User className="h-4 w-4" />
											</div>
											<div className="flex flex-col">
												<span className="text-sm font-medium">
													{getMemberName(member)}
												</span>
												{member.jobTitle && (
													<span className="text-muted-foreground text-xs">
														{member.jobTitle}
													</span>
												)}
											</div>
										</div>
										{selectedMember?.id === member.id && (
											<Check className="h-4 w-4" />
										)}
									</div>
								))}
							</CommandGroup>
						)}
					</CommandList>
				</Command>

				{selectedMember && (
					<div className="space-y-3 border-t p-3">
						<div className="flex items-center gap-2 text-sm">
							<User className="text-muted-foreground h-4 w-4" />
							<span className="font-medium">
								{getMemberName(selectedMember)}
							</span>
							{selectedMember.jobTitle && (
								<Badge variant="secondary" className="text-xs">
									{selectedMember.jobTitle}
								</Badge>
							)}
						</div>

						<div className="space-y-2">
							<label className="text-xs font-medium">Role</label>
							<Select value={selectedRole} onValueChange={setSelectedRole}>
								<SelectTrigger className="h-9">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="primary">Primary</SelectItem>
									<SelectItem value="supervisor">Supervisor</SelectItem>
									<SelectItem value="assistant">Assistant</SelectItem>
									<SelectItem value="crew">Crew</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<Button
							onClick={handleAssign}
							disabled={isAssigning}
							className="w-full"
							size="sm"
						>
							{isAssigning ? "Assigning..." : "Assign to Job"}
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
