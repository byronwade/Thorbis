/**
 * Email Provider Settings Page - Server Component with PPR
 *
 * Allows company admins to choose between:
 * - Managed (Resend/Postmark) - Platform managed email
 * - Google Workspace - Gmail API integration
 * - Disabled - Turn off email capabilities
 */

import { Suspense } from "react";
import { EmailProviderData } from "@/components/settings/communications/email-provider-data";
import { EmailProviderSkeleton } from "@/components/settings/communications/email-provider-skeleton";

export default function EmailProviderPage() {
	return (
		<Suspense fallback={<EmailProviderSkeleton />}>
			<EmailProviderData />
		</Suspense>
	);
}
