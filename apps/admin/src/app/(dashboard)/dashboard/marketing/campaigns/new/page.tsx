"use client";

/**
 * New Campaign Page
 *
 * Create a new email marketing campaign using the campaign builder wizard.
 * Connects to real server actions for campaign CRUD operations.
 */

import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@stratos/ui";
import { CampaignBuilder } from "@/components/marketing/campaign-builder";
import { useCampaignStore } from "@/lib/stores/campaign-store";
import { createCampaign, sendCampaign, scheduleCampaign } from "@/actions/campaigns";
import type { CampaignDraft } from "@/types/campaigns";

export default function NewCampaignPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { openBuilder, closeBuilder } = useCampaignStore();

	// Initialize builder when page loads
	useEffect(() => {
		openBuilder();
		return () => closeBuilder();
	}, [openBuilder, closeBuilder]);

	const handleSave = useCallback(
		async (draft: CampaignDraft) => {
			setIsSubmitting(true);
			setError(null);
			try {
				const result = await createCampaign(draft);

				if (!result.success) {
					setError(result.error || "Failed to create campaign");
					return;
				}

				if (result.data) {
					router.push(`/dashboard/marketing/campaigns/${result.data.id}`);
				}
			} catch (err) {
				console.error("Failed to save campaign:", err);
				setError("An unexpected error occurred");
			} finally {
				setIsSubmitting(false);
			}
		},
		[router]
	);

	const handleSend = useCallback(
		async (draft: CampaignDraft) => {
			setIsSubmitting(true);
			setError(null);
			try {
				// First create the campaign as draft
				const createResult = await createCampaign(draft);

				if (!createResult.success || !createResult.data) {
					setError(createResult.error || "Failed to create campaign");
					return;
				}

				// Then send it
				const sendResult = await sendCampaign(createResult.data.id);

				if (!sendResult.success) {
					setError(sendResult.error || "Failed to send campaign");
					// Still redirect to campaign page so user can see the draft
					router.push(`/dashboard/marketing/campaigns/${createResult.data.id}`);
					return;
				}

				router.push(`/dashboard/marketing/campaigns/${createResult.data.id}`);
			} catch (err) {
				console.error("Failed to send campaign:", err);
				setError("An unexpected error occurred");
			} finally {
				setIsSubmitting(false);
			}
		},
		[router]
	);

	const handleSchedule = useCallback(
		async (draft: CampaignDraft, scheduledFor: string) => {
			setIsSubmitting(true);
			setError(null);
			try {
				// First create the campaign as draft
				const createResult = await createCampaign(draft);

				if (!createResult.success || !createResult.data) {
					setError(createResult.error || "Failed to create campaign");
					return;
				}

				// Then schedule it
				const scheduleResult = await scheduleCampaign(createResult.data.id, scheduledFor);

				if (!scheduleResult.success) {
					setError(scheduleResult.error || "Failed to schedule campaign");
					// Still redirect to campaign page so user can see the draft
					router.push(`/dashboard/marketing/campaigns/${createResult.data.id}`);
					return;
				}

				router.push(`/dashboard/marketing/campaigns/${createResult.data.id}`);
			} catch (err) {
				console.error("Failed to schedule campaign:", err);
				setError("An unexpected error occurred");
			} finally {
				setIsSubmitting(false);
			}
		},
		[router]
	);

	const handleCancel = useCallback(() => {
		router.push("/dashboard/marketing/campaigns");
	}, [router]);

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<div className="flex items-center gap-4 border-b px-6 py-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/dashboard/marketing/campaigns">
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<div>
					<h1 className="text-lg font-semibold">Create Campaign</h1>
					<p className="text-sm text-muted-foreground">
						Build a new email marketing campaign
					</p>
				</div>
			</div>

			{/* Error Display */}
			{error && (
				<div className="mx-6 mt-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
					<p className="text-sm text-destructive">{error}</p>
				</div>
			)}

			{/* Campaign Builder */}
			<div className="flex-1 overflow-hidden">
				<CampaignBuilder
					onSave={handleSave}
					onSend={handleSend}
					onSchedule={handleSchedule}
					onCancel={handleCancel}
					isSubmitting={isSubmitting}
				/>
			</div>
		</div>
	);
}
