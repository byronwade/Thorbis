"use client";

/**
 * Campaign Builder Component
 *
 * Multi-step wizard for creating and editing email campaigns.
 * Steps: Details → Content → Audience → Review
 */

import { useState, useCallback } from "react";
import {
	ArrowLeft,
	ArrowRight,
	Check,
	FileText,
	Loader2,
	Mail,
	Send,
	Users,
	Eye,
	Calendar,
	Clock,
} from "lucide-react";
import { Button, Input, Label, Textarea, cn } from "@stratos/ui";
import { useCampaignStore } from "@/lib/stores/campaign-store";
import type { CampaignBuilderStep, CampaignDraft, EmailCampaignAudienceType } from "@/types/campaigns";
import { AudienceSelector } from "./audience-selector";

type CampaignBuilderProps = {
	onSave?: (draft: CampaignDraft) => Promise<void>;
	onSend?: (draft: CampaignDraft) => Promise<void>;
	onSchedule?: (draft: CampaignDraft, scheduledFor: string) => Promise<void>;
	onCancel?: () => void;
	isSubmitting?: boolean;
};

const STEPS: { id: CampaignBuilderStep; label: string; icon: typeof FileText }[] = [
	{ id: "details", label: "Details", icon: FileText },
	{ id: "content", label: "Content", icon: Mail },
	{ id: "audience", label: "Audience", icon: Users },
	{ id: "review", label: "Review", icon: Eye },
];

export function CampaignBuilder({
	onSave,
	onSend,
	onSchedule,
	onCancel,
	isSubmitting = false,
}: CampaignBuilderProps) {
	const { builder, setBuilderStep, updateDraft, setValidationErrors, clearValidationError } =
		useCampaignStore();
	const [scheduleDate, setScheduleDate] = useState<string>("");
	const [scheduleTime, setScheduleTime] = useState<string>("09:00");

	const { currentStep, draft, validationErrors, editingCampaignId } = builder;
	const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

	// Validation
	const validateStep = useCallback(
		(step: CampaignBuilderStep): boolean => {
			const errors: Record<string, string> = {};

			switch (step) {
				case "details":
					if (!draft.name.trim()) errors.name = "Campaign name is required";
					if (!draft.subject.trim()) errors.subject = "Subject line is required";
					break;
				case "content":
					if (!draft.htmlContent?.trim() && !draft.templateId) {
						errors.content = "Email content or template is required";
					}
					break;
				case "audience":
					if (!draft.audienceType) errors.audienceType = "Audience type is required";
					break;
			}

			if (Object.keys(errors).length > 0) {
				setValidationErrors(errors);
				return false;
			}
			return true;
		},
		[draft, setValidationErrors]
	);

	const handleNext = useCallback(() => {
		if (!validateStep(currentStep)) return;

		const nextIndex = currentStepIndex + 1;
		if (nextIndex < STEPS.length) {
			setBuilderStep(STEPS[nextIndex]!.id);
		}
	}, [currentStep, currentStepIndex, validateStep, setBuilderStep]);

	const handleBack = useCallback(() => {
		const prevIndex = currentStepIndex - 1;
		if (prevIndex >= 0) {
			setBuilderStep(STEPS[prevIndex]!.id);
		}
	}, [currentStepIndex, setBuilderStep]);

	const handleStepClick = useCallback(
		(stepId: CampaignBuilderStep) => {
			const targetIndex = STEPS.findIndex((s) => s.id === stepId);
			// Can only go back, or to current step
			if (targetIndex <= currentStepIndex) {
				setBuilderStep(stepId);
			}
		},
		[currentStepIndex, setBuilderStep]
	);

	const handleSave = useCallback(async () => {
		if (onSave) {
			await onSave(draft);
		}
	}, [draft, onSave]);

	const handleSend = useCallback(async () => {
		if (!validateStep("details") || !validateStep("content") || !validateStep("audience")) {
			return;
		}
		if (onSend) {
			await onSend(draft);
		}
	}, [draft, onSend, validateStep]);

	const handleSchedule = useCallback(async () => {
		if (!validateStep("details") || !validateStep("content") || !validateStep("audience")) {
			return;
		}
		if (!scheduleDate) {
			setValidationErrors({ schedule: "Please select a date" });
			return;
		}
		const scheduledFor = `${scheduleDate}T${scheduleTime}:00.000Z`;
		if (onSchedule) {
			await onSchedule(draft, scheduledFor);
		}
	}, [draft, onSchedule, scheduleDate, scheduleTime, validateStep, setValidationErrors]);

	return (
		<div className="flex h-full flex-col">
			{/* Step Indicator */}
			<div className="border-b px-6 py-4">
				<div className="flex items-center justify-between">
					{STEPS.map((step, index) => {
						const isActive = step.id === currentStep;
						const isCompleted = index < currentStepIndex;
						const isClickable = index <= currentStepIndex;
						const Icon = step.icon;

						return (
							<div key={step.id} className="flex items-center">
								<button
									type="button"
									className={cn(
										"flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
										isActive && "bg-primary text-primary-foreground",
										isCompleted && !isActive && "bg-emerald-100 text-emerald-700",
										!isActive && !isCompleted && "text-muted-foreground",
										isClickable && !isActive && "hover:bg-muted cursor-pointer"
									)}
									onClick={() => handleStepClick(step.id)}
									disabled={!isClickable}
								>
									{isCompleted && !isActive ? (
										<Check className="size-4" />
									) : (
										<Icon className="size-4" />
									)}
									<span className="hidden sm:inline">{step.label}</span>
									<span className="sm:hidden">{index + 1}</span>
								</button>
								{index < STEPS.length - 1 && (
									<div
										className={cn(
											"mx-2 h-px w-8 sm:w-12",
											index < currentStepIndex ? "bg-emerald-500" : "bg-border"
										)}
									/>
								)}
							</div>
						);
					})}
				</div>
			</div>

			{/* Step Content */}
			<div className="flex-1 overflow-auto p-6">
				{currentStep === "details" && (
					<DetailsStep
						draft={draft}
						errors={validationErrors}
						onChange={updateDraft}
						onClearError={clearValidationError}
					/>
				)}
				{currentStep === "content" && (
					<ContentStep
						draft={draft}
						errors={validationErrors}
						onChange={updateDraft}
						onClearError={clearValidationError}
					/>
				)}
				{currentStep === "audience" && (
					<AudienceStep
						draft={draft}
						errors={validationErrors}
						onChange={updateDraft}
						onClearError={clearValidationError}
					/>
				)}
				{currentStep === "review" && (
					<ReviewStep
						draft={draft}
						scheduleDate={scheduleDate}
						scheduleTime={scheduleTime}
						onScheduleDateChange={setScheduleDate}
						onScheduleTimeChange={setScheduleTime}
						errors={validationErrors}
					/>
				)}
			</div>

			{/* Footer Actions */}
			<div className="flex items-center justify-between border-t px-6 py-4">
				<div className="flex gap-2">
					{currentStepIndex > 0 && (
						<Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
							<ArrowLeft className="mr-2 size-4" />
							Back
						</Button>
					)}
					{onCancel && (
						<Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
							Cancel
						</Button>
					)}
				</div>

				<div className="flex gap-2">
					{onSave && (
						<Button variant="outline" onClick={handleSave} disabled={isSubmitting}>
							{isSubmitting ? (
								<Loader2 className="mr-2 size-4 animate-spin" />
							) : null}
							Save Draft
						</Button>
					)}

					{currentStep !== "review" ? (
						<Button onClick={handleNext} disabled={isSubmitting}>
							Next
							<ArrowRight className="ml-2 size-4" />
						</Button>
					) : (
						<div className="flex gap-2">
							{onSchedule && scheduleDate && (
								<Button variant="secondary" onClick={handleSchedule} disabled={isSubmitting}>
									{isSubmitting ? (
										<Loader2 className="mr-2 size-4 animate-spin" />
									) : (
										<Calendar className="mr-2 size-4" />
									)}
									Schedule
								</Button>
							)}
							{onSend && (
								<Button onClick={handleSend} disabled={isSubmitting}>
									{isSubmitting ? (
										<Loader2 className="mr-2 size-4 animate-spin" />
									) : (
										<Send className="mr-2 size-4" />
									)}
									Send Now
								</Button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

// ============================================================================
// Step Components
// ============================================================================

type StepProps = {
	draft: CampaignDraft;
	errors: Record<string, string>;
	onChange: (updates: Partial<CampaignDraft>) => void;
	onClearError: (field: string) => void;
};

function DetailsStep({ draft, errors, onChange, onClearError }: StepProps) {
	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<div>
				<h2 className="text-lg font-semibold">Campaign Details</h2>
				<p className="text-sm text-muted-foreground">
					Set up the basic information for your campaign
				</p>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="name">Campaign Name *</Label>
					<Input
						id="name"
						placeholder="e.g., Holiday Promotion 2024"
						value={draft.name}
						onChange={(e) => {
							onChange({ name: e.target.value });
							onClearError("name");
						}}
						className={errors.name ? "border-destructive" : ""}
					/>
					{errors.name && (
						<p className="text-sm text-destructive">{errors.name}</p>
					)}
					<p className="text-xs text-muted-foreground">
						Internal name for organization (not shown to recipients)
					</p>
				</div>

				<div className="space-y-2">
					<Label htmlFor="subject">Subject Line *</Label>
					<Input
						id="subject"
						placeholder="e.g., Special Holiday Offer Inside!"
						value={draft.subject}
						onChange={(e) => {
							onChange({ subject: e.target.value });
							onClearError("subject");
						}}
						className={errors.subject ? "border-destructive" : ""}
					/>
					{errors.subject && (
						<p className="text-sm text-destructive">{errors.subject}</p>
					)}
					<p className="text-xs text-muted-foreground">
						{draft.subject.length}/60 characters recommended
					</p>
				</div>

				<div className="space-y-2">
					<Label htmlFor="previewText">Preview Text</Label>
					<Input
						id="previewText"
						placeholder="e.g., Get 20% off your next purchase..."
						value={draft.previewText}
						onChange={(e) => onChange({ previewText: e.target.value })}
					/>
					<p className="text-xs text-muted-foreground">
						Text shown after the subject in the inbox preview
					</p>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="fromName">From Name</Label>
						<Input
							id="fromName"
							placeholder="Thorbis"
							value={draft.fromName}
							onChange={(e) => onChange({ fromName: e.target.value })}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="fromEmail">From Email</Label>
						<Input
							id="fromEmail"
							type="email"
							placeholder="hello@thorbis.com"
							value={draft.fromEmail}
							onChange={(e) => onChange({ fromEmail: e.target.value })}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="replyTo">Reply-To Email</Label>
					<Input
						id="replyTo"
						type="email"
						placeholder="support@thorbis.com (optional)"
						value={draft.replyTo || ""}
						onChange={(e) => onChange({ replyTo: e.target.value || undefined })}
					/>
				</div>
			</div>
		</div>
	);
}

function ContentStep({ draft, errors, onChange, onClearError }: StepProps) {
	// For now, simple HTML textarea - can be replaced with rich editor
	return (
		<div className="mx-auto max-w-3xl space-y-6">
			<div>
				<h2 className="text-lg font-semibold">Email Content</h2>
				<p className="text-sm text-muted-foreground">
					Create your email content using HTML or select a template
				</p>
			</div>

			<div className="space-y-4">
				{/* Template selector would go here */}
				<div className="rounded-lg border bg-muted/50 p-4">
					<p className="text-sm text-muted-foreground">
						Template library coming soon. For now, enter HTML content directly.
					</p>
				</div>

				<div className="space-y-2">
					<Label htmlFor="htmlContent">HTML Content *</Label>
					<Textarea
						id="htmlContent"
						placeholder="<html><body><h1>Hello!</h1><p>Your email content here...</p></body></html>"
						value={draft.htmlContent || ""}
						onChange={(e) => {
							onChange({ htmlContent: e.target.value });
							onClearError("content");
						}}
						className={cn("min-h-[300px] font-mono text-sm", errors.content && "border-destructive")}
					/>
					{errors.content && (
						<p className="text-sm text-destructive">{errors.content}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="plainTextContent">Plain Text Version (optional)</Label>
					<Textarea
						id="plainTextContent"
						placeholder="Hello! Your email content here..."
						value={draft.plainTextContent || ""}
						onChange={(e) => onChange({ plainTextContent: e.target.value })}
						className="min-h-[150px]"
					/>
					<p className="text-xs text-muted-foreground">
						Fallback for email clients that don't support HTML
					</p>
				</div>
			</div>
		</div>
	);
}

function AudienceStep({ draft, errors, onChange, onClearError }: StepProps) {
	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<div>
				<h2 className="text-lg font-semibold">Select Audience</h2>
				<p className="text-sm text-muted-foreground">
					Choose who will receive this campaign
				</p>
			</div>

			<AudienceSelector
				value={draft.audienceType}
				filter={draft.audienceFilter}
				onChange={(audienceType, audienceFilter) => {
					onChange({ audienceType, audienceFilter });
					onClearError("audienceType");
				}}
				error={errors.audienceType}
			/>
		</div>
	);
}

function ReviewStep({
	draft,
	scheduleDate,
	scheduleTime,
	onScheduleDateChange,
	onScheduleTimeChange,
	errors,
}: {
	draft: CampaignDraft;
	scheduleDate: string;
	scheduleTime: string;
	onScheduleDateChange: (date: string) => void;
	onScheduleTimeChange: (time: string) => void;
	errors: Record<string, string>;
}) {
	const audienceLabels: Record<EmailCampaignAudienceType, string> = {
		all_users: "All Users",
		all_companies: "All Companies",
		waitlist: "Waitlist Subscribers",
		segment: "Custom Segment",
		custom: "Custom List",
	};

	return (
		<div className="mx-auto max-w-2xl space-y-6">
			<div>
				<h2 className="text-lg font-semibold">Review & Send</h2>
				<p className="text-sm text-muted-foreground">
					Review your campaign before sending
				</p>
			</div>

			{/* Campaign Summary */}
			<div className="rounded-lg border p-4 space-y-4">
				<h3 className="font-medium">Campaign Summary</h3>

				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<p className="text-xs text-muted-foreground">Campaign Name</p>
						<p className="font-medium">{draft.name || "—"}</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground">From</p>
						<p className="font-medium">{draft.fromName} &lt;{draft.fromEmail}&gt;</p>
					</div>
					<div className="sm:col-span-2">
						<p className="text-xs text-muted-foreground">Subject Line</p>
						<p className="font-medium">{draft.subject || "—"}</p>
					</div>
					{draft.previewText && (
						<div className="sm:col-span-2">
							<p className="text-xs text-muted-foreground">Preview Text</p>
							<p className="text-sm text-muted-foreground">{draft.previewText}</p>
						</div>
					)}
					<div>
						<p className="text-xs text-muted-foreground">Audience</p>
						<p className="font-medium">{audienceLabels[draft.audienceType]}</p>
					</div>
				</div>
			</div>

			{/* Schedule Option */}
			<div className="rounded-lg border p-4 space-y-4">
				<div className="flex items-center gap-2">
					<Clock className="size-4 text-muted-foreground" />
					<h3 className="font-medium">Schedule (Optional)</h3>
				</div>
				<p className="text-sm text-muted-foreground">
					Schedule this campaign for later, or send it immediately
				</p>

				<div className="grid gap-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="scheduleDate">Date</Label>
						<Input
							id="scheduleDate"
							type="date"
							value={scheduleDate}
							onChange={(e) => onScheduleDateChange(e.target.value)}
							min={new Date().toISOString().split("T")[0]}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="scheduleTime">Time (UTC)</Label>
						<Input
							id="scheduleTime"
							type="time"
							value={scheduleTime}
							onChange={(e) => onScheduleTimeChange(e.target.value)}
						/>
					</div>
				</div>
				{errors.schedule && (
					<p className="text-sm text-destructive">{errors.schedule}</p>
				)}
			</div>

			{/* Email Preview */}
			<div className="rounded-lg border p-4 space-y-4">
				<h3 className="font-medium">Email Preview</h3>
				{draft.htmlContent ? (
					<div className="rounded border bg-white p-4">
						<div
							className="prose prose-sm max-w-none"
							dangerouslySetInnerHTML={{ __html: draft.htmlContent }}
						/>
					</div>
				) : (
					<p className="text-sm text-muted-foreground">No content to preview</p>
				)}
			</div>
		</div>
	);
}
