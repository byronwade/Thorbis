/**
 * Trash/Bin Folder Page
 * Shows all deleted emails
 */

"use client";

import dynamic from "next/dynamic";

const CommunicationPage = dynamic(() => import("../page"), { ssr: false });

export default function TrashPage() {
	return <CommunicationPage />;
}
