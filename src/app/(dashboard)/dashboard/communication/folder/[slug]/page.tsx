/**
 * Custom Folder Page
 * Shows emails in a custom folder
 * Route: /dashboard/communication/folder/[slug]
 */

"use client";

import dynamic from "next/dynamic";

const CommunicationPage = dynamic(() => import("../../page"), { ssr: false });

export default function CustomFolderPage() {
	return <CommunicationPage />;
}
