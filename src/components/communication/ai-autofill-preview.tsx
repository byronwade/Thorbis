"use client";

/**
 * AI Auto-fill Preview - Client Component
 *
 * Displays AI-extracted data with approve/edit/reject actions
 *
 * Client-side features:
 * - Real-time AI extraction display
 * - One-click approval of AI suggestions
 * - Inline editing of extracted data
 * - Confidence score visualization
 * - Action item management
 * - Tag suggestions
 *
 * Performance optimizations:
 * - Debounced extraction updates
 * - Optimistic UI updates
 * - Memoized field rendering
 */

import { Check, Edit2, Sparkles, Tag, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAIExtraction } from "@/hooks/use-ai-extraction";
import { useCallPreferencesStore } from "@/lib/stores/call-preferences-store";

type ApprovalState = "pending" | "approved" | "rejected" | "edited";

export function AIAutofillPreview() {
	const { extractedData, isExtracting } = useAIExtraction();
	const showAIConfidence = useCallPreferencesStore((state) => state.showAIConfidence);

	// Check if any data exists
	const hasData =
		extractedData.customerInfo.name ||
		extractedData.customerInfo.email ||
		extractedData.customerInfo.phone ||
		extractedData.jobDetails.title ||
		extractedData.jobDetails.description ||
		extractedData.appointmentNeeds.preferredDate;

	const [customerInfoState, setCustomerInfoState] = useState<ApprovalState>("pending");
	const [editedCustomerInfo, setEditedCustomerInfo] = useState(extractedData.customerInfo);
	const [_approvedActionItems, setApprovedActionItems] = useState<Set<number>>(new Set());
	const [editingField, setEditingField] = useState<string | null>(null);

	// Handle approval of customer info
	const handleApproveCustomerInfo = () => {
		setCustomerInfoState("approved");
		// In production: sync to backend/CRM
	};

	// Handle rejection of customer info
	const handleRejectCustomerInfo = () => {
		setCustomerInfoState("rejected");
	};

	// Handle editing customer info field
	const handleEditField = (field: string, value: string) => {
		setEditedCustomerInfo((prev) => ({
			...prev,
			[field]: value,
		}));
		setCustomerInfoState("edited");
	};

	// Handle action item approval
	const _handleApproveActionItem = (index: number) => {
		setApprovedActionItems((prev) => new Set([...prev, index]));
		// In production: create task in system
	};

	// Get confidence color
	const getConfidenceColor = (confidence: number) => {
		if (confidence >= 80) {
			return "text-success bg-success/30";
		}
		if (confidence >= 60) {
			return "text-warning bg-warning/30";
		}
		return "text-destructive bg-destructive/30";
	};

	// Get confidence text
	const getConfidenceText = (confidence: number) => {
		if (confidence >= 80) {
			return "High";
		}
		if (confidence >= 60) {
			return "Medium";
		}
		return "Low";
	};

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<div className="flex items-center justify-between border-border border-b bg-foreground/50 p-4">
				<div className="flex items-center gap-2">
					<Sparkles className="size-4 text-accent-foreground" />
					<h3 className="font-semibold text-sm text-white">AI Auto-fill</h3>
					{isExtracting && <div className="size-2 animate-pulse rounded-full bg-accent" />}
				</div>
				{showAIConfidence && extractedData.overallConfidence > 0 && (
					<div
						className={`rounded-full px-2.5 py-1 font-semibold text-xs ${getConfidenceColor(extractedData.overallConfidence)}`}
					>
						{getConfidenceText(extractedData.overallConfidence)} ({extractedData.overallConfidence}%)
					</div>
				)}
			</div>

			<div className="flex-1 space-y-4 overflow-y-auto p-4">
				{/* Customer Information */}
				<div
					className={`rounded-lg border p-4 ${customerInfoState === "approved" ? "border-success bg-success/10" : customerInfoState === "rejected" ? "border-destructive bg-destructive/10" : "border-border bg-foreground/50"}`}
				>
					<div className="mb-3 flex items-center justify-between">
						<h4 className="flex items-center gap-2 font-semibold text-sm text-white">
							<Sparkles className="size-3.5" />
							Customer Information
						</h4>
						{customerInfoState === "pending" && (
							<div className="flex items-center gap-1">
								<Button
									className="h-7 gap-1 bg-success/30 px-2 text-success hover:bg-success/50 hover:text-success"
									onClick={handleApproveCustomerInfo}
									size="sm"
									variant="ghost"
								>
									<Check className="size-3" />
									Approve
								</Button>
								<Button
									className="h-7 gap-1 bg-destructive/30 px-2 text-destructive hover:bg-destructive/50 hover:text-destructive"
									onClick={handleRejectCustomerInfo}
									size="sm"
									variant="ghost"
								>
									<X className="size-3" />
									Reject
								</Button>
							</div>
						)}
						{customerInfoState === "approved" && <Badge className="bg-success/50 text-success">Approved</Badge>}
						{customerInfoState === "rejected" && <Badge className="bg-destructive/50 text-destructive">Rejected</Badge>}
					</div>

					<div className="space-y-2">
						{/* Name */}
						{(extractedData.customerInfo.name || editedCustomerInfo.name) && (
							<div>
								<label className="mb-1 block font-medium text-[10px] text-muted-foreground">Name</label>
								{editingField === "name" ? (
									<Input
										autoFocus
										className="h-8 text-sm"
										onBlur={() => setEditingField(null)}
										onChange={(e) => handleEditField("name", e.target.value)}
										value={editedCustomerInfo.name || ""}
									/>
								) : (
									<div className="flex items-center justify-between gap-2">
										<span className="text-muted-foreground text-sm">
											{editedCustomerInfo.name || extractedData.customerInfo.name}
										</span>
										<Button
											className="h-6 w-6 p-0"
											onClick={() => {
												setEditingField("name");
												setEditedCustomerInfo((prev) => ({
													...prev,
													name: prev.name || extractedData.customerInfo.name,
												}));
											}}
											size="sm"
											variant="ghost"
										>
											<Edit2 className="size-3" />
										</Button>
									</div>
								)}
							</div>
						)}

						{/* Email */}
						{(extractedData.customerInfo.email || editedCustomerInfo.email) && (
							<div>
								<label className="mb-1 block font-medium text-[10px] text-muted-foreground">Email</label>
								{editingField === "email" ? (
									<Input
										autoFocus
										className="h-8 text-sm"
										onBlur={() => setEditingField(null)}
										onChange={(e) => handleEditField("email", e.target.value)}
										value={editedCustomerInfo.email || ""}
									/>
								) : (
									<div className="flex items-center justify-between gap-2">
										<span className="text-muted-foreground text-sm">
											{editedCustomerInfo.email || extractedData.customerInfo.email}
										</span>
										<Button
											className="h-6 w-6 p-0"
											onClick={() => {
												setEditingField("email");
												setEditedCustomerInfo((prev) => ({
													...prev,
													email: prev.email || extractedData.customerInfo.email,
												}));
											}}
											size="sm"
											variant="ghost"
										>
											<Edit2 className="size-3" />
										</Button>
									</div>
								)}
							</div>
						)}

						{/* Phone */}
						{(extractedData.customerInfo.phone || editedCustomerInfo.phone) && (
							<div>
								<label className="mb-1 block font-medium text-[10px] text-muted-foreground">Phone</label>
								{editingField === "phone" ? (
									<Input
										autoFocus
										className="h-8 text-sm"
										onBlur={() => setEditingField(null)}
										onChange={(e) => handleEditField("phone", e.target.value)}
										value={editedCustomerInfo.phone || ""}
									/>
								) : (
									<div className="flex items-center justify-between gap-2">
										<span className="text-muted-foreground text-sm">
											{editedCustomerInfo.phone || extractedData.customerInfo.phone}
										</span>
										<Button
											className="h-6 w-6 p-0"
											onClick={() => {
												setEditingField("phone");
												setEditedCustomerInfo((prev) => ({
													...prev,
													phone: prev.phone || extractedData.customerInfo.phone,
												}));
											}}
											size="sm"
											variant="ghost"
										>
											<Edit2 className="size-3" />
										</Button>
									</div>
								)}
							</div>
						)}

						{/* Company */}
						{(extractedData.customerInfo.company || editedCustomerInfo.company) && (
							<div>
								<label className="mb-1 block font-medium text-[10px] text-muted-foreground">Company</label>
								{editingField === "company" ? (
									<Input
										autoFocus
										className="h-8 text-sm"
										onBlur={() => setEditingField(null)}
										onChange={(e) => handleEditField("company", e.target.value)}
										value={editedCustomerInfo.company || ""}
									/>
								) : (
									<div className="flex items-center justify-between gap-2">
										<span className="text-muted-foreground text-sm">
											{editedCustomerInfo.company || extractedData.customerInfo.company}
										</span>
										<Button
											className="h-6 w-6 p-0"
											onClick={() => {
												setEditingField("company");
												setEditedCustomerInfo((prev) => ({
													...prev,
													company: prev.company || extractedData.customerInfo.company,
												}));
											}}
											size="sm"
											variant="ghost"
										>
											<Edit2 className="size-3" />
										</Button>
									</div>
								)}
							</div>
						)}

						{!(
							extractedData.customerInfo.name ||
							extractedData.customerInfo.email ||
							extractedData.customerInfo.phone ||
							extractedData.customerInfo.company ||
							extractedData.customerInfo.address.full
						) && <p className="text-muted-foreground text-xs">No customer information extracted yet</p>}
					</div>
				</div>

				{/* Job Details */}
				{(extractedData.jobDetails.title || extractedData.jobDetails.description) && (
					<div className="rounded-lg border border-border bg-foreground/50 p-4">
						<div className="mb-3 flex items-center gap-2">
							<Tag className="size-3.5 text-blue-500" />
							<h4 className="font-semibold text-sm text-white">Job Details</h4>
						</div>
						<div className="space-y-2">
							{extractedData.jobDetails.title && (
								<div>
									<label className="mb-1 block font-medium text-[10px] text-muted-foreground">Title</label>
									<p className="text-muted-foreground text-sm">{extractedData.jobDetails.title}</p>
								</div>
							)}
							{extractedData.jobDetails.description && (
								<div>
									<label className="mb-1 block font-medium text-[10px] text-muted-foreground">Description</label>
									<p className="text-muted-foreground text-sm">{extractedData.jobDetails.description}</p>
								</div>
							)}
							{extractedData.jobDetails.urgency && (
								<div>
									<label className="mb-1 block font-medium text-[10px] text-muted-foreground">Urgency</label>
									<span
										className={`inline-block rounded px-2 py-1 text-xs ${
											extractedData.jobDetails.urgency === "emergency"
												? "bg-red-500/20 text-red-600"
												: extractedData.jobDetails.urgency === "high"
													? "bg-orange-500/20 text-orange-600"
													: "bg-blue-500/20 text-blue-600"
										}`}
									>
										{extractedData.jobDetails.urgency}
									</span>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Appointment Needs */}
				{(extractedData.appointmentNeeds.preferredDate || extractedData.appointmentNeeds.timePreference) && (
					<div className="rounded-lg border border-border bg-foreground/50 p-4">
						<div className="mb-3 flex items-center gap-2">
							<Tag className="size-3.5 text-purple-500" />
							<h4 className="font-semibold text-sm text-white">Appointment Preferences</h4>
						</div>
						<div className="space-y-2">
							{extractedData.appointmentNeeds.preferredDate && (
								<div>
									<label className="mb-1 block font-medium text-[10px] text-muted-foreground">Preferred Date</label>
									<p className="text-muted-foreground text-sm">{extractedData.appointmentNeeds.preferredDate}</p>
								</div>
							)}
							{extractedData.appointmentNeeds.timePreference && (
								<div>
									<label className="mb-1 block font-medium text-[10px] text-muted-foreground">Time Preference</label>
									<p className="text-muted-foreground text-sm capitalize">
										{extractedData.appointmentNeeds.timePreference}
									</p>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Call Summary */}
				{extractedData.callSummary && (
					<div className="rounded-lg border border-border bg-foreground/50 p-4">
						<h4 className="mb-2 font-semibold text-sm text-white">Call Summary</h4>
						<p className="text-muted-foreground text-sm leading-relaxed">{extractedData.callSummary}</p>
						<div className="mt-3 flex items-center gap-2">
							<span className="text-muted-foreground text-xs">Sentiment:</span>
							<Badge
								className={`${extractedData.sentiment === "positive" ? "bg-success/50 text-success" : extractedData.sentiment === "negative" ? "bg-destructive/50 text-destructive" : "bg-foreground text-muted-foreground"}`}
							>
								{extractedData.sentiment}
							</Badge>
						</div>
					</div>
				)}

				{/* No data yet */}
				{!(hasData || extractedData.callSummary) && extractedData.customerInfo.confidence === 0 && (
					<div className="flex h-full flex-col items-center justify-center py-12 text-center">
						<div className="rounded-full bg-foreground p-4">
							<Sparkles className="size-8 text-muted-foreground" />
						</div>
						<p className="mt-4 font-medium text-muted-foreground text-sm">AI is listening...</p>
						<p className="mt-1 text-muted-foreground text-xs">Data will auto-fill as the conversation progresses</p>
					</div>
				)}
			</div>
		</div>
	);
}
