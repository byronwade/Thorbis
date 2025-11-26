/**
 * Sent Folder Page
 * Shows all sent emails
 */

"use client";

import dynamic from "next/dynamic";

const CommunicationPage = dynamic(() => import("../page"), { ssr: false });

export default function SentPage() {
	return <CommunicationPage />;
}
