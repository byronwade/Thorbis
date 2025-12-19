"use client";

/**
 * Communication Step - Consolidated phone, email, and notifications
 *
 * This step handles all customer communication setup in one place:
 * - Business phone number (new or ported)
 * - Email setup (platform, custom domain, or integration)
 * - Notification preferences
 */

import {
	ArrowRight,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	Mail,
	MessageSquare,
	Phone,
	Settings,
	SkipForward,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useOnboardingStore } from "@/lib/onboarding/onboarding-store";
import { cn } from "@/lib/utils";

type SectionId = "phone" | "email" | "notifications";

interface SectionState {
	expanded: boolean;
	completed: boolean;
}

export function CommunicationStep() {
	const { data, updateData } = useOnboardingStore();

	// Track which sections are expanded
	const [sections, setSections] = useState<Record<SectionId, SectionState>>({
		phone: { expanded: true, completed: !!data.phoneSetupType },
		email: { expanded: false, completed: !!data.emailSetupType },
		notifications: { expanded: false, completed: data.notifications.length > 0 },
	});

	const toggleSection = (id: SectionId) => {
		setSections((prev) => ({
			...prev,
			[id]: { ...prev[id], expanded: !prev[id].expanded },
		}));
	};

	const markSectionComplete = (id: SectionId) => {
		setSections((prev) => ({
			...prev,
			[id]: { ...prev[id], completed: true, expanded: false },
		}));
		// Auto-expand next section
		const order: SectionId[] = ["phone", "email", "notifications"];
		const currentIndex = order.indexOf(id);
		if (currentIndex < order.length - 1) {
			const nextSection = order[currentIndex + 1];
			setSections((prev) => ({
				...prev,
				[nextSection]: { ...prev[nextSection], expanded: true },
			}));
		}
	};

	const completedCount = Object.values(sections).filter((s) => s.completed).length;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">Communication Setup</h2>
				<p className="text-muted-foreground">
					Set up how you'll communicate with customers. Complete each section or skip
					to set up later.
				</p>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<CheckCircle2 className="h-4 w-4 text-green-500" />
					<span>{completedCount} of 3 sections complete</span>
				</div>
			</div>

			{/* Phone Section */}
			<Card className={cn(sections.phone.completed && "border-green-200 bg-green-50/50")}>
				<CardHeader
					className="cursor-pointer"
					onClick={() => toggleSection("phone")}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div
								className={cn(
									"p-2 rounded-lg",
									sections.phone.completed
										? "bg-green-100 text-green-600"
										: "bg-muted text-muted-foreground"
								)}
							>
								<Phone className="h-5 w-5" />
							</div>
							<div>
								<CardTitle className="text-lg flex items-center gap-2">
									Business Phone
									{sections.phone.completed && (
										<Badge variant="secondary" className="bg-green-100 text-green-700">
											Done
										</Badge>
									)}
								</CardTitle>
								<CardDescription>
									Get a business number for calls and texts
								</CardDescription>
							</div>
						</div>
						{sections.phone.expanded ? (
							<ChevronUp className="h-5 w-5 text-muted-foreground" />
						) : (
							<ChevronDown className="h-5 w-5 text-muted-foreground" />
						)}
					</div>
				</CardHeader>
				{sections.phone.expanded && (
					<CardContent className="space-y-4 pt-0">
						<RadioGroup
							value={data.phoneSetupType || ""}
							onValueChange={(value) =>
								updateData({ phoneSetupType: value as "new" | "port" | "skip" })
							}
						>
							<div className="space-y-3">
								<Label
									htmlFor="phone-new"
									className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
								>
									<RadioGroupItem value="new" id="phone-new" className="mt-1" />
									<div>
										<p className="font-medium">Get a new number</p>
										<p className="text-sm text-muted-foreground">
											We'll assign you a local business number
										</p>
									</div>
								</Label>
								<Label
									htmlFor="phone-port"
									className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
								>
									<RadioGroupItem value="port" id="phone-port" className="mt-1" />
									<div>
										<p className="font-medium">Port existing number</p>
										<p className="text-sm text-muted-foreground">
											Transfer your current business number
										</p>
									</div>
								</Label>
								<Label
									htmlFor="phone-skip"
									className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
								>
									<RadioGroupItem value="skip" id="phone-skip" className="mt-1" />
									<div>
										<p className="font-medium">Skip for now</p>
										<p className="text-sm text-muted-foreground">
											Set up phone later in settings
										</p>
									</div>
								</Label>
							</div>
						</RadioGroup>

						{data.phoneSetupType === "new" && (
							<div className="space-y-2 p-3 bg-muted/50 rounded-lg">
								<Label className="flex items-center gap-2">
									<Switch
										checked={data.smsEnabled}
										onCheckedChange={(checked) => updateData({ smsEnabled: checked })}
									/>
									Enable SMS messaging
								</Label>
								<p className="text-xs text-muted-foreground">
									Send appointment reminders and updates via text
								</p>
							</div>
						)}

						<div className="flex justify-end gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									updateData({ phoneSetupType: "skip" });
									markSectionComplete("phone");
								}}
							>
								<SkipForward className="h-4 w-4 mr-1" />
								Skip
							</Button>
							<Button
								size="sm"
								onClick={() => markSectionComplete("phone")}
								disabled={!data.phoneSetupType}
							>
								Continue
								<ArrowRight className="h-4 w-4 ml-1" />
							</Button>
						</div>
					</CardContent>
				)}
			</Card>

			{/* Email Section */}
			<Card className={cn(sections.email.completed && "border-green-200 bg-green-50/50")}>
				<CardHeader
					className="cursor-pointer"
					onClick={() => toggleSection("email")}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div
								className={cn(
									"p-2 rounded-lg",
									sections.email.completed
										? "bg-green-100 text-green-600"
										: "bg-muted text-muted-foreground"
								)}
							>
								<Mail className="h-5 w-5" />
							</div>
							<div>
								<CardTitle className="text-lg flex items-center gap-2">
									Email Setup
									{sections.email.completed && (
										<Badge variant="secondary" className="bg-green-100 text-green-700">
											Done
										</Badge>
									)}
								</CardTitle>
								<CardDescription>
									How customers will receive emails from you
								</CardDescription>
							</div>
						</div>
						{sections.email.expanded ? (
							<ChevronUp className="h-5 w-5 text-muted-foreground" />
						) : (
							<ChevronDown className="h-5 w-5 text-muted-foreground" />
						)}
					</div>
				</CardHeader>
				{sections.email.expanded && (
					<CardContent className="space-y-4 pt-0">
						<RadioGroup
							value={data.emailSetupType || ""}
							onValueChange={(value) =>
								updateData({
									emailSetupType: value as
										| "platform"
										| "custom-domain"
										| "gmail"
										| "outlook"
										| "skip",
								})
							}
						>
							<div className="space-y-3">
								<Label
									htmlFor="email-platform"
									className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
								>
									<RadioGroupItem value="platform" id="email-platform" className="mt-1" />
									<div>
										<p className="font-medium">Use Stratos email</p>
										<p className="text-sm text-muted-foreground">
											Send from yourcompany@mail.stratos.app
										</p>
									</div>
									<Badge variant="outline" className="ml-auto">
										Recommended
									</Badge>
								</Label>
								<Label
									htmlFor="email-custom"
									className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
								>
									<RadioGroupItem
										value="custom-domain"
										id="email-custom"
										className="mt-1"
									/>
									<div>
										<p className="font-medium">Use your domain</p>
										<p className="text-sm text-muted-foreground">
											Send from you@yourdomain.com
										</p>
									</div>
								</Label>
								<Label
									htmlFor="email-gmail"
									className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
								>
									<RadioGroupItem value="gmail" id="email-gmail" className="mt-1" />
									<div>
										<p className="font-medium">Connect Gmail</p>
										<p className="text-sm text-muted-foreground">
											Use your existing Gmail account
										</p>
									</div>
								</Label>
								<Label
									htmlFor="email-skip"
									className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
								>
									<RadioGroupItem value="skip" id="email-skip" className="mt-1" />
									<div>
										<p className="font-medium">Skip for now</p>
										<p className="text-sm text-muted-foreground">
											Configure email later
										</p>
									</div>
								</Label>
							</div>
						</RadioGroup>

						{data.emailSetupType === "custom-domain" && (
							<div className="space-y-2">
								<Label htmlFor="custom-domain">Your Domain</Label>
								<Input
									id="custom-domain"
									placeholder="yourdomain.com"
									value={data.customDomain}
									onChange={(e) => updateData({ customDomain: e.target.value })}
								/>
								<p className="text-xs text-muted-foreground">
									We'll guide you through DNS setup after onboarding
								</p>
							</div>
						)}

						<div className="flex justify-end gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									updateData({ emailSetupType: "skip" });
									markSectionComplete("email");
								}}
							>
								<SkipForward className="h-4 w-4 mr-1" />
								Skip
							</Button>
							<Button
								size="sm"
								onClick={() => markSectionComplete("email")}
								disabled={!data.emailSetupType}
							>
								Continue
								<ArrowRight className="h-4 w-4 ml-1" />
							</Button>
						</div>
					</CardContent>
				)}
			</Card>

			{/* Notifications Section */}
			<Card
				className={cn(
					sections.notifications.completed && "border-green-200 bg-green-50/50"
				)}
			>
				<CardHeader
					className="cursor-pointer"
					onClick={() => toggleSection("notifications")}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div
								className={cn(
									"p-2 rounded-lg",
									sections.notifications.completed
										? "bg-green-100 text-green-600"
										: "bg-muted text-muted-foreground"
								)}
							>
								<MessageSquare className="h-5 w-5" />
							</div>
							<div>
								<CardTitle className="text-lg flex items-center gap-2">
									Notifications
									{sections.notifications.completed && (
										<Badge variant="secondary" className="bg-green-100 text-green-700">
											Done
										</Badge>
									)}
								</CardTitle>
								<CardDescription>
									Configure how you receive alerts
								</CardDescription>
							</div>
						</div>
						{sections.notifications.expanded ? (
							<ChevronUp className="h-5 w-5 text-muted-foreground" />
						) : (
							<ChevronDown className="h-5 w-5 text-muted-foreground" />
						)}
					</div>
				</CardHeader>
				{sections.notifications.expanded && (
					<CardContent className="space-y-4 pt-0">
						<p className="text-sm text-muted-foreground">
							We've set up sensible defaults. You can customize these anytime in settings.
						</p>

						<div className="space-y-3">
							{data.notifications.slice(0, 4).map((pref, index) => (
								<div
									key={pref.category}
									className="flex items-center justify-between p-3 border rounded-lg"
								>
									<span className="font-medium text-sm">
										{pref.category
											.replace(/_/g, " ")
											.replace(/\b\w/g, (l) => l.toUpperCase())}
									</span>
									<div className="flex items-center gap-4">
										<Label className="flex items-center gap-1.5 text-xs">
											<Switch
												checked={pref.push}
												onCheckedChange={(checked) => {
													const newNotifications = [...data.notifications];
													newNotifications[index] = { ...pref, push: checked };
													updateData({ notifications: newNotifications });
												}}
											/>
											Push
										</Label>
										<Label className="flex items-center gap-1.5 text-xs">
											<Switch
												checked={pref.email}
												onCheckedChange={(checked) => {
													const newNotifications = [...data.notifications];
													newNotifications[index] = { ...pref, email: checked };
													updateData({ notifications: newNotifications });
												}}
											/>
											Email
										</Label>
									</div>
								</div>
							))}
						</div>

						<div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
							<div className="flex items-center gap-2">
								<Settings className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">Quiet Hours</span>
							</div>
							<Switch
								checked={data.quietHoursEnabled}
								onCheckedChange={(checked) =>
									updateData({ quietHoursEnabled: checked })
								}
							/>
						</div>

						<div className="flex justify-end gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => markSectionComplete("notifications")}
							>
								<SkipForward className="h-4 w-4 mr-1" />
								Use Defaults
							</Button>
							<Button size="sm" onClick={() => markSectionComplete("notifications")}>
								Save Preferences
								<ArrowRight className="h-4 w-4 ml-1" />
							</Button>
						</div>
					</CardContent>
				)}
			</Card>
		</div>
	);
}
