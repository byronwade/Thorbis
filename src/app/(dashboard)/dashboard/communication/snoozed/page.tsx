/**
 * Snoozed Folder Page
 * Shows all snoozed emails
 */

"use client";

import dynamic from "next/dynamic";

const CommunicationPage = dynamic(() => import("../page"), { ssr: false });

export default function SnoozedPage() {
	return <CommunicationPage />;
}
