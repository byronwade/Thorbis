"use client";

import { formatDistanceToNow } from "date-fns";
import {
	AlertCircle,
	CheckCircle2,
	Clock,
	Copy,
	Edit,
	ExternalLink,
	Mail,
	MessageSquare,
	MousePointerClick,
	RefreshCw,
	Save,
	Send,
	Star,
	ThumbsUp,
	X,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	StandardFormField,
	StandardFormRow,
} from "@/components/ui/standard-form-field";
import { Textarea } from "@/components/ui/textarea";

interface ReviewTrackingData {
	review_request_sent_at?: string | null;
	review_request_method?: string | null;
	review_link_clicked?: boolean;
	review_link_clicked_at?: string | null;
	review_submitted?: boolean;
	review_submitted_at?: string | null;
	review_platform?: string | null;
	review_rating?: number | null;
	review_text?: string | null;
	review_url?: string | null;
	review_follow_up_sent?: boolean;
	review_follow_up_sent_at?: string | null;
	review_reminder_count?: number;
	review_last_reminder_sent_at?: string | null;
	review_opt_out?: boolean;
	review_notes?: string | null;
}

interface ReviewTrackingCardProps {
	jobId: string;
	customerId?: string;
	customerName?: string;
	customerEmail?: string;
	customerPhone?: string;
	reviewData: ReviewTrackingData;
	editable?: boolean;
	onSave?: (data: ReviewTrackingData) => Promise<void>;
	onSendRequest?: () => Promise<void>;
	onSendReminder?: () => Promise<void>;
}

const REVIEW_PLATFORMS = [
	{
		value: "google",
		label: "Google",
		color: "text-blue-600 dark:text-blue-400",
	},
	{ value: "yelp", label: "Yelp", color: "text-red-600 dark:text-red-400" },
	{
		value: "facebook",
		label: "Facebook",
		color: "text-blue-500 dark:text-blue-400",
	},
	{
		value: "thumbtack",
		label: "Thumbtack",
		color: "text-green-600 dark:text-green-400",
	},
	{
		value: "angi",
		label: "Angi",
		color: "text-orange-600 dark:text-orange-400",
	},
	{
		value: "homeadvisor",
		label: "HomeAdvisor",
		color: "text-orange-500 dark:text-orange-400",
	},
	{
		value: "bbb",
		label: "Better Business Bureau",
		color: "text-blue-700 dark:text-blue-400",
	},
	{
		value: "nextdoor",
		label: "Nextdoor",
		color: "text-green-700 dark:text-green-400",
	},
	{
		value: "trustpilot",
		label: "Trustpilot",
		color: "text-green-600 dark:text-green-400",
	},
	{ value: "other", label: "Other", color: "text-gray-600 dark:text-gray-400" },
];

const REQUEST_METHODS = [
	{ value: "email", label: "Email", icon: Mail },
	{ value: "sms", label: "SMS", icon: MessageSquare },
	{ value: "both", label: "Email & SMS", icon: Send },
	{ value: "in_person", label: "In Person", icon: ThumbsUp },
	{ value: "automatic", label: "Automatic", icon: RefreshCw },
];

export function ReviewTrackingCard({
	jobId,
	customerId,
	customerName,
	customerEmail,
	customerPhone,
	reviewData,
	editable = false,
	onSave,
	onSendRequest,
	onSendReminder,
}: ReviewTrackingCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [formData, setFormData] = useState<ReviewTrackingData>(reviewData);

	const handleSave = async () => {
		if (!onSave) return;

		setIsSaving(true);
		try {
			await onSave(formData);
			setIsEditing(false);
		} catch (error) {
			console.error("Failed to save review tracking data:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setFormData(reviewData);
		setIsEditing(false);
	};

	const updateField = (field: keyof ReviewTrackingData, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSendRequest = async () => {
		if (!onSendRequest) return;
		setIsSending(true);
		try {
			await onSendRequest();
		} catch (error) {
			console.error("Failed to send review request:", error);
		} finally {
			setIsSending(false);
		}
	};

	const handleSendReminder = async () => {
		if (!onSendReminder) return;
		setIsSending(true);
		try {
			await onSendReminder();
		} catch (error) {
			console.error("Failed to send reminder:", error);
		} finally {
			setIsSending(false);
		}
	};

	const selectedPlatform = REVIEW_PLATFORMS.find(
		(p) => p.value === formData.review_platform,
	);
	const selectedMethod = REQUEST_METHODS.find(
		(m) => m.value === formData.review_request_method,
	);

	// Calculate review funnel status
	const getReviewStatus = () => {
		if (formData.review_opt_out) {
			return {
				status: "opted_out",
				label: "Opted Out",
				color: "text-gray-600",
			};
		}
		if (formData.review_submitted) {
			return {
				status: "completed",
				label: "Review Submitted",
				color: "text-green-600",
			};
		}
		if (formData.review_link_clicked) {
			return {
				status: "clicked",
				label: "Link Clicked",
				color: "text-blue-600",
			};
		}
		if (formData.review_request_sent_at) {
			return {
				status: "sent",
				label: "Request Sent",
				color: "text-yellow-600",
			};
		}
		return {
			status: "pending",
			label: "Not Requested",
			color: "text-gray-500",
		};
	};

	const reviewStatus = getReviewStatus();

	// Generate review link (would be customized per company)
	const reviewLink = `https://app.thorbis.com/r/${jobId}`;

	const copyReviewLink = () => {
		navigator.clipboard.writeText(reviewLink);
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Star className="h-5 w-5 text-primary" />
						<div>
							<CardTitle>Customer Review Tracking</CardTitle>
							<CardDescription>
								Track review requests and customer engagement
							</CardDescription>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Badge
							variant={
								reviewStatus.status === "completed"
									? "default"
									: reviewStatus.status === "clicked"
										? "secondary"
										: "outline"
							}
							className={reviewStatus.color}
						>
							{reviewStatus.label}
						</Badge>
						{editable && !isEditing && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsEditing(true)}
							>
								<Edit className="mr-2 h-4 w-4" />
								Edit
							</Button>
						)}
						{isEditing && (
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={handleCancel}
									disabled={isSaving}
								>
									<X className="mr-2 h-4 w-4" />
									Cancel
								</Button>
								<Button size="sm" onClick={handleSave} disabled={isSaving}>
									<Save className="mr-2 h-4 w-4" />
									{isSaving ? "Saving..." : "Save"}
								</Button>
							</div>
						)}
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				{/* Customer Info & Quick Actions */}
				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-start justify-between">
						<div>
							<h4 className="font-semibold">
								{customerName || "No Customer Assigned"}
							</h4>
							<div className="text-muted-foreground mt-1 space-y-1 text-sm">
								{customerEmail && (
									<div className="flex items-center gap-2">
										<Mail className="h-3 w-3" />
										{customerEmail}
									</div>
								)}
								{customerPhone && (
									<div className="flex items-center gap-2">
										<MessageSquare className="h-3 w-3" />
										{customerPhone}
									</div>
								)}
							</div>
						</div>
						<div className="flex flex-col gap-2">
							{!formData.review_request_sent_at &&
								!formData.review_opt_out &&
								onSendRequest && (
									<Button
										size="sm"
										onClick={handleSendRequest}
										disabled={isSending || !customerId}
									>
										<Send className="mr-2 h-4 w-4" />
										{isSending ? "Sending..." : "Send Request"}
									</Button>
								)}
							{formData.review_request_sent_at &&
								!formData.review_submitted &&
								!formData.review_opt_out &&
								onSendReminder &&
								(formData.review_reminder_count || 0) < 3 && (
									<Button
										size="sm"
										variant="outline"
										onClick={handleSendReminder}
										disabled={isSending}
									>
										<RefreshCw className="mr-2 h-4 w-4" />
										Send Reminder
									</Button>
								)}
						</div>
					</div>
				</div>

				{/* Review Funnel Progress */}
				<div className="space-y-3">
					<Label>Review Request Journey</Label>
					<div className="flex items-center gap-2">
						{/* Step 1: Request Sent */}
						<div
							className={`flex flex-1 flex-col items-center rounded-lg border p-3 ${
								formData.review_request_sent_at
									? "border-primary bg-primary/5"
									: "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
							}`}
						>
							<Send
								className={`h-5 w-5 ${formData.review_request_sent_at ? "text-primary" : "text-gray-400"}`}
							/>
							<span className="mt-2 text-xs font-medium">Request Sent</span>
							{formData.review_request_sent_at && (
								<span className="text-muted-foreground mt-1 text-xs">
									{formatDistanceToNow(
										new Date(formData.review_request_sent_at),
										{
											addSuffix: true,
										},
									)}
								</span>
							)}
						</div>

						<div className="h-px w-4 bg-gray-300 dark:bg-gray-700" />

						{/* Step 2: Link Clicked */}
						<div
							className={`flex flex-1 flex-col items-center rounded-lg border p-3 ${
								formData.review_link_clicked
									? "border-blue-500 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
									: "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
							}`}
						>
							<MousePointerClick
								className={`h-5 w-5 ${formData.review_link_clicked ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`}
							/>
							<span className="mt-2 text-xs font-medium">Link Clicked</span>
							{formData.review_link_clicked_at && (
								<span className="text-muted-foreground mt-1 text-xs">
									{formatDistanceToNow(
										new Date(formData.review_link_clicked_at),
										{
											addSuffix: true,
										},
									)}
								</span>
							)}
						</div>

						<div className="h-px w-4 bg-gray-300 dark:bg-gray-700" />

						{/* Step 3: Review Submitted */}
						<div
							className={`flex flex-1 flex-col items-center rounded-lg border p-3 ${
								formData.review_submitted
									? "border-green-500 bg-green-50 dark:border-green-800 dark:bg-green-950"
									: "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
							}`}
						>
							<CheckCircle2
								className={`h-5 w-5 ${formData.review_submitted ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}
							/>
							<span className="mt-2 text-xs font-medium">Submitted</span>
							{formData.review_submitted_at && (
								<span className="text-muted-foreground mt-1 text-xs">
									{formatDistanceToNow(new Date(formData.review_submitted_at), {
										addSuffix: true,
									})}
								</span>
							)}
						</div>
					</div>
				</div>

				{/* Review Link */}
				{(isEditing || formData.review_request_sent_at) && (
					<div className="space-y-2">
						<Label>Review Link</Label>
						<div className="flex gap-2">
							<Input
								value={reviewLink}
								readOnly
								className="font-mono text-sm"
							/>
							<Button size="sm" variant="outline" onClick={copyReviewLink}>
								<Copy className="h-4 w-4" />
							</Button>
						</div>
						<p className="text-muted-foreground text-xs">
							This link redirects to the customer's preferred review platform
						</p>
					</div>
				)}

				<Separator />

				{/* Request Details */}
				{(isEditing || formData.review_request_sent_at) && (
					<div className="space-y-4">
						<h4 className="font-semibold">Request Details</h4>

						<div className="grid gap-4 md:grid-cols-2">
							<StandardFormField
								label="Request Method"
								htmlFor="review_request_method"
							>
								{isEditing ? (
									<Select
										value={formData.review_request_method || ""}
										onValueChange={(value) =>
											updateField("review_request_method", value)
										}
									>
										<SelectTrigger id="review_request_method">
											<SelectValue placeholder="Select method..." />
										</SelectTrigger>
										<SelectContent>
											{REQUEST_METHODS.map((method) => (
												<SelectItem key={method.value} value={method.value}>
													<div className="flex items-center gap-2">
														<method.icon className="h-4 w-4" />
														{method.label}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								) : (
									<div className="rounded-lg border bg-card p-2 px-3">
										<div className="flex items-center gap-2">
											{selectedMethod && (
												<selectedMethod.icon className="h-4 w-4 text-primary" />
											)}
											<span className="text-sm">
												{selectedMethod?.label || "—"}
											</span>
										</div>
									</div>
								)}
							</StandardFormField>

							<div className="space-y-2">
								<Label>Reminders Sent</Label>
								<div className="rounded-lg border bg-card p-2 px-3">
									<div className="flex items-center gap-2">
										<RefreshCw className="h-4 w-4 text-primary" />
										<span className="text-sm">
											{formData.review_reminder_count || 0} of 3 reminders
										</span>
									</div>
									{formData.review_last_reminder_sent_at && (
										<p className="text-muted-foreground mt-1 text-xs">
											Last sent{" "}
											{formatDistanceToNow(
												new Date(formData.review_last_reminder_sent_at),
												{
													addSuffix: true,
												},
											)}
										</p>
									)}
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Review Details (if submitted) */}
				{(isEditing || formData.review_submitted) && (
					<>
						<Separator />
						<div className="space-y-4">
							<h4 className="font-semibold">Review Details</h4>

							<StandardFormRow cols={2}>
								<StandardFormField label="Platform" htmlFor="review_platform">
									{isEditing ? (
										<Select
											value={formData.review_platform || ""}
											onValueChange={(value) =>
												updateField("review_platform", value)
											}
										>
											<SelectTrigger id="review_platform">
												<SelectValue placeholder="Select platform..." />
											</SelectTrigger>
											<SelectContent>
												{REVIEW_PLATFORMS.map((platform) => (
													<SelectItem
														key={platform.value}
														value={platform.value}
													>
														{platform.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									) : (
										<div className="rounded-lg border bg-card p-2 px-3">
											<span
												className={`text-sm font-medium ${selectedPlatform?.color}`}
											>
												{selectedPlatform?.label || "—"}
											</span>
										</div>
									)}
								</StandardFormField>

								<StandardFormField label="Rating" htmlFor="review_rating">
									{isEditing ? (
										<Select
											value={formData.review_rating?.toString() || ""}
											onValueChange={(value) =>
												updateField("review_rating", parseInt(value))
											}
										>
											<SelectTrigger id="review_rating">
												<SelectValue placeholder="Select rating..." />
											</SelectTrigger>
											<SelectContent>
												{[5, 4, 3, 2, 1].map((rating) => (
													<SelectItem key={rating} value={rating.toString()}>
														<div className="flex items-center gap-1">
															{Array.from({ length: rating }).map((_, i) => (
																<Star
																	key={i}
																	className="h-3 w-3 fill-yellow-400 text-yellow-400"
																/>
															))}
															<span className="ml-2">{rating} stars</span>
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									) : (
										<div className="rounded-lg border bg-card p-2 px-3">
											<div className="flex items-center gap-1">
												{formData.review_rating ? (
													<>
														{Array.from({ length: formData.review_rating }).map(
															(_, i) => (
																<Star
																	key={i}
																	className="h-4 w-4 fill-yellow-400 text-yellow-400"
																/>
															),
														)}
														<span className="ml-2 text-sm font-medium">
															{formData.review_rating} stars
														</span>
													</>
												) : (
													<span className="text-sm">—</span>
												)}
											</div>
										</div>
									)}
								</StandardFormField>
							</StandardFormRow>

							{(isEditing || formData.review_text) && (
								<StandardFormField label="Review Text" htmlFor="review_text">
									<Textarea
										id="review_text"
										value={formData.review_text || ""}
										onChange={(e) => updateField("review_text", e.target.value)}
										disabled={!isEditing}
										placeholder="Customer's review text..."
										rows={4}
									/>
								</StandardFormField>
							)}

							{(isEditing || formData.review_url) && (
								<StandardFormField label="Review URL" htmlFor="review_url">
									<div className="flex gap-2">
										<Input
											id="review_url"
											value={formData.review_url || ""}
											onChange={(e) =>
												updateField("review_url", e.target.value)
											}
											disabled={!isEditing}
											placeholder="https://..."
										/>
										{formData.review_url && !isEditing && (
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													window.open(formData.review_url!, "_blank")
												}
											>
												<ExternalLink className="h-4 w-4" />
											</Button>
										)}
									</div>
								</StandardFormField>
							)}
						</div>
					</>
				)}

				{/* Internal Notes */}
				{(isEditing || formData.review_notes) && (
					<>
						<Separator />
						<StandardFormField label="Internal Notes" htmlFor="review_notes">
							<Textarea
								id="review_notes"
								value={formData.review_notes || ""}
								onChange={(e) => updateField("review_notes", e.target.value)}
								disabled={!isEditing}
								placeholder="Internal notes about review process..."
								rows={3}
							/>
						</StandardFormField>
					</>
				)}

				{/* Opt-out Warning */}
				{formData.review_opt_out && (
					<div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
						<AlertCircle className="mt-0.5 h-4 w-4 text-red-600 dark:text-red-400" />
						<div className="text-sm">
							<p className="font-medium text-red-900 dark:text-red-100">
								Customer Opted Out
							</p>
							<p className="text-muted-foreground mt-1">
								This customer has opted out of review requests. Do not send
								additional requests.
							</p>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
