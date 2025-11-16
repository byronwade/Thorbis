/**
 * Team Member Edit Dialog
 *
 * Dialog for editing individual team member details during onboarding
 */

"use client";

import { User } from "lucide-react";
import { useState } from "react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type TeamMember = {
	email: string;
	firstName: string;
	lastName: string;
	role: "owner" | "admin" | "manager" | "technician" | "dispatcher";
	phone?: string;
	photo?: File | null;
	photoPreview?: string | null;
	isCurrentUser?: boolean;
};

type TeamMemberEditDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	member: TeamMember;
	onSave: (member: TeamMember) => void;
};

export function TeamMemberEditDialog({
	open,
	onOpenChange,
	member,
	onSave,
}: TeamMemberEditDialogProps) {
	const [editedMember, setEditedMember] = useState<TeamMember>(member);
	const [photoPreview, setPhotoPreview] = useState<string | null>(
		member.photoPreview || null,
	);

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				alert("Photo size must be less than 5MB");
				return;
			}

			setEditedMember({ ...editedMember, photo: file });
			const reader = new FileReader();
			reader.onloadend = () => {
				setPhotoPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSave = () => {
		onSave({ ...editedMember, photoPreview });
		onOpenChange(false);
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Edit Team Member</DialogTitle>
					<DialogDescription>
						Update the team member's information
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{/* Profile Photo */}
					<div className="flex items-center gap-4">
						{photoPreview ? (
							<div className="relative">
								<img
									alt="Profile preview"
									className="size-20 rounded-full border object-cover"
									src={photoPreview}
								/>
								<Button
									className="-right-1 -top-1 absolute size-6 rounded-full p-0"
									onClick={() => {
										setEditedMember({ ...editedMember, photo: null });
										setPhotoPreview(null);
									}}
									size="icon"
									type="button"
									variant="destructive"
								>
									×
								</Button>
							</div>
						) : (
							<div className="flex size-20 items-center justify-center rounded-full border border-dashed">
								<User className="size-8 text-muted-foreground" />
							</div>
						)}
						<div className="flex-1">
							<Input
								accept="image/*"
								className="cursor-pointer"
								onChange={handlePhotoChange}
								type="file"
							/>
							<p className="mt-1 text-muted-foreground text-xs">
								Profile photo (optional, max 5MB)
							</p>
						</div>
					</div>

					{/* Name Fields */}
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="firstName">First Name *</Label>
							<Input
								id="firstName"
								onChange={(e) =>
									setEditedMember({
										...editedMember,
										firstName: e.target.value,
									})
								}
								placeholder="John"
								value={editedMember.firstName}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Last Name *</Label>
							<Input
								id="lastName"
								onChange={(e) =>
									setEditedMember({ ...editedMember, lastName: e.target.value })
								}
								placeholder="Doe"
								value={editedMember.lastName}
							/>
						</div>
					</div>

					{/* Email and Phone */}
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="email">Email *</Label>
							<Input
								disabled={editedMember.isCurrentUser}
								id="email"
								onChange={(e) =>
									setEditedMember({ ...editedMember, email: e.target.value })
								}
								placeholder="john@example.com"
								type="email"
								value={editedMember.email}
							/>
							{editedMember.isCurrentUser && (
								<p className="text-muted-foreground text-xs">
									Your email cannot be changed here
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="phone">Phone (Optional)</Label>
							<Input
								id="phone"
								onChange={(e) =>
									setEditedMember({ ...editedMember, phone: e.target.value })
								}
								placeholder="+1 (555) 123-4567"
								type="tel"
								value={editedMember.phone || ""}
							/>
						</div>
					</div>

					{/* Role */}
					<div className="space-y-2">
						<Label htmlFor="role">Role *</Label>
						<Select
							onValueChange={(value) =>
								setEditedMember({
									...editedMember,
									role: value as TeamMember["role"],
								})
							}
							value={editedMember.role}
						>
							<SelectTrigger id="role">
								<SelectValue placeholder="Select role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="owner">
									Owner - Full access to everything
								</SelectItem>
								<SelectItem value="admin">
									Admin - Full access except billing
								</SelectItem>
								<SelectItem value="manager">
									Manager - Manage jobs and team
								</SelectItem>
								<SelectItem value="dispatcher">
									Dispatcher - Schedule and assign jobs
								</SelectItem>
								<SelectItem value="technician">
									Technician - View and complete assigned jobs
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<DialogFooter>
					<Button onClick={() => onOpenChange(false)} variant="outline">
						Cancel
					</Button>
					<Button onClick={handleSave}>Save Changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
