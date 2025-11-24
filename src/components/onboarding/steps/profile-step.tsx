"use client";

/**
 * Profile Step - User Profile Setup
 *
 * Sets up the user's personal profile within the company.
 * Shows a preview of how they'll appear to customers and team.
 */

import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { InfoCard } from "@/components/onboarding/info-cards/walkthrough-slide";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { User, Upload, X, Mail, Phone, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

const USER_ROLES = [
	{ value: "owner", label: "Owner", description: "Full access to everything" },
	{ value: "admin", label: "Admin", description: "Manage team and settings" },
	{ value: "manager", label: "Manager", description: "Oversee operations" },
	{ value: "technician", label: "Technician", description: "Field work focus" },
	{ value: "office", label: "Office Staff", description: "Customer service & scheduling" },
];

export function ProfileStep() {
	const { data, updateData } = useOnboardingStore();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [dragActive, setDragActive] = useState(false);

	const handlePhotoUpload = (file: File) => {
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onload = (e) => {
				updateData({ userPhoto: e.target?.result as string });
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handlePhotoUpload(e.dataTransfer.files[0]);
		}
	};

	// Get initials for avatar fallback
	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<div className="space-y-6 max-w-2xl">
			<div>
				<h2 className="text-xl font-semibold">Set up your profile</h2>
				<p className="text-sm text-muted-foreground">
					This is how you'll appear to your team and customers.
				</p>
			</div>

			{/* Profile Photo */}
			<div className="flex items-start gap-6">
				<div
					className={cn(
						"relative flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed transition-colors cursor-pointer overflow-hidden",
						dragActive ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/50",
						data.userPhoto && "border-solid border-transparent"
					)}
					onDragEnter={handleDrag}
					onDragLeave={handleDrag}
					onDragOver={handleDrag}
					onDrop={handleDrop}
					onClick={() => fileInputRef.current?.click()}
				>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={(e) => {
							if (e.target.files?.[0]) {
								handlePhotoUpload(e.target.files[0]);
							}
						}}
					/>

					{data.userPhoto ? (
						<>
							<img
								src={data.userPhoto}
								alt="Profile"
								className="h-full w-full object-cover"
							/>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									updateData({ userPhoto: null });
								}}
								className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
							>
								<X className="h-3 w-3" />
							</button>
						</>
					) : data.userName ? (
						<span className="text-2xl font-semibold text-muted-foreground">
							{getInitials(data.userName)}
						</span>
					) : (
						<User className="h-8 w-8 text-muted-foreground" />
					)}
				</div>

				<div className="flex-1 space-y-1">
					<Label>Profile Photo</Label>
					<p className="text-sm text-muted-foreground">
						Add a photo so your team and customers can recognize you.
						Click the circle or drag and drop an image.
					</p>
				</div>
			</div>

			{/* Name */}
			<div className="space-y-2">
				<Label htmlFor="userName">
					Your Name <span className="text-destructive">*</span>
				</Label>
				<Input
					id="userName"
					placeholder="John Smith"
					value={data.userName}
					onChange={(e) => updateData({ userName: e.target.value })}
					className="text-lg"
				/>
			</div>

			{/* Contact Info */}
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="userEmail">Email Address</Label>
					<Input
						id="userEmail"
						type="email"
						placeholder="john@acmeplumbing.com"
						value={data.userEmail}
						onChange={(e) => updateData({ userEmail: e.target.value })}
					/>
					<p className="text-xs text-muted-foreground">
						For notifications and customer replies
					</p>
				</div>
				<div className="space-y-2">
					<Label htmlFor="userPhone">Phone Number</Label>
					<Input
						id="userPhone"
						type="tel"
						placeholder="(555) 123-4567"
						value={data.userPhone}
						onChange={(e) => updateData({ userPhone: e.target.value })}
					/>
					<p className="text-xs text-muted-foreground">
						For SMS alerts and customer calls
					</p>
				</div>
			</div>

			{/* Role */}
			<div className="space-y-2">
				<Label htmlFor="userRole">Your Role</Label>
				<Select
					value={data.userRole}
					onValueChange={(v) => updateData({ userRole: v })}
				>
					<SelectTrigger id="userRole" className="w-full sm:w-[300px]">
						<SelectValue placeholder="Select your role" />
					</SelectTrigger>
					<SelectContent>
						{USER_ROLES.map((role) => (
							<SelectItem key={role.value} value={role.value}>
								<div>
									<span className="font-medium">{role.label}</span>
									<span className="text-muted-foreground ml-2">- {role.description}</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Preview */}
			{data.userName && (
				<div className="rounded-xl bg-muted/30 p-4 space-y-3">
					<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
						Preview - How customers see you
					</p>

					<div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
						{data.userPhoto ? (
							<img
								src={data.userPhoto}
								alt=""
								className="h-14 w-14 rounded-full object-cover"
							/>
						) : (
							<div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
								{getInitials(data.userName)}
							</div>
						)}
						<div className="flex-1">
							<p className="font-semibold">{data.userName}</p>
							<p className="text-sm text-muted-foreground capitalize">
								{USER_ROLES.find((r) => r.value === data.userRole)?.label || "Team Member"}
								{data.companyName && ` at ${data.companyName}`}
							</p>
						</div>
					</div>

					{/* Contact Preview */}
					<div className="flex flex-wrap gap-4 text-sm">
						{data.userEmail && (
							<div className="flex items-center gap-2 text-muted-foreground">
								<Mail className="h-4 w-4" />
								{data.userEmail}
							</div>
						)}
						{data.userPhone && (
							<div className="flex items-center gap-2 text-muted-foreground">
								<Phone className="h-4 w-4" />
								{data.userPhone}
							</div>
						)}
					</div>
				</div>
			)}

			{/* Info Card */}
			<InfoCard
				icon={<MessageSquare className="h-5 w-5" />}
				title="Personalized communication"
				description="When you send messages to customers, they'll see your name and photo. This builds trust and makes communication feel more personal."
				variant="tip"
			/>
		</div>
	);
}
