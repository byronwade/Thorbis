"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import SmsPage from "../page";

export default function SmsDetailPage() {
	const params = useParams();
	const searchParams = useSearchParams();
	const router = useRouter();
	const smsId = params?.id as string;
	const folder = searchParams.get("folder") || "inbox";

	// Convert path param to query param for consistency
	useEffect(() => {
		if (smsId) {
			const newParams = new URLSearchParams();
			if (folder) newParams.set("folder", folder);
			newParams.set("id", smsId);
			router.replace(`/dashboard/communication/sms?${newParams.toString()}`, {
				scroll: false,
			});
		}
	}, [smsId, folder, router]);

	// Render the same page component
	return <SmsPage />;
}
