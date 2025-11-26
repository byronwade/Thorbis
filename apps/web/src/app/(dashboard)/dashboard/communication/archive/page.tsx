/**
 * Archive Folder Page
 * Shows all archived emails
 */

"use client";

import dynamic from "next/dynamic";

const CommunicationPage = dynamic(() => import("../page"), { ssr: false });

export default function ArchivePage() {
	return <CommunicationPage />;
}
