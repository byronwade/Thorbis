/**
 * Drafts Folder Page
 * Shows all draft emails
 */

"use client";

import dynamic from "next/dynamic";

const CommunicationPage = dynamic(() => import("../page"), { ssr: false });

export default function DraftsPage() {
	return <CommunicationPage />;
}
