/**
 * Spam Folder Page
 * Shows all spam emails
 */

"use client";

import dynamic from "next/dynamic";

const CommunicationPage = dynamic(() => import("../page"), { ssr: false });

export default function SpamPage() {
	return <CommunicationPage />;
}
