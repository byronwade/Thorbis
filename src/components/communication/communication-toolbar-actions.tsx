"use client";

/**
 * Communication Toolbar Actions - Client Component
 * Displays context-aware action buttons in the global toolbar
 *
 * Client-side features:
 * - Uses Zustand store to determine active tab
 * - Shows different action button based on active filter
 * - Renders in global app-toolbar, not in page content
 * - Automatic re-render only when activeFilter changes
 */

import { MessageSquare, Pencil, Phone, Plus, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommunicationStore } from "@/lib/stores/communication-store";

export function CommunicationToolbarActions() {
	const activeFilter = useCommunicationStore((state) => state.activeFilter);
	const openComposer = useCommunicationStore((state) => state.openComposer);

	// Return appropriate button based on active filter
	let buttonContent;

	switch (activeFilter) {
		case "email":
			buttonContent = (
				<Button
					onClick={() =>
						openComposer("email", {
							customerName: "Customer",
							email: "",
						})
					}
					size="sm"
					variant="default"
				>
					<Pencil className="mr-2 size-4" />
					<span className="hidden sm:inline">Compose</span>
					<span className="sm:hidden">New</span>
				</Button>
			);
			break;
		case "sms":
			buttonContent = (
				<Button
					onClick={() =>
						openComposer("sms", {
							customerName: "Customer",
							phone: "",
						})
					}
					size="sm"
					variant="default"
				>
					<MessageSquare className="mr-2 size-4" />
					<span className="hidden sm:inline">New Text</span>
					<span className="sm:hidden">New</span>
				</Button>
			);
			break;
		case "phone":
			buttonContent = (
				<Button
					onClick={() => openComposer("call")}
					size="sm"
					variant="default"
				>
					<Phone className="mr-2 size-4" />
					<span className="hidden sm:inline">New Call</span>
					<span className="sm:hidden">Call</span>
				</Button>
			);
			break;
		case "ticket":
			buttonContent = (
				<Button size="sm" variant="default">
					<Ticket className="mr-2 size-4" />
					<span className="hidden sm:inline">New Ticket</span>
					<span className="sm:hidden">New</span>
				</Button>
			);
			break;
		default:
			buttonContent = (
				<Button
					onClick={() => openComposer("email")}
					size="sm"
					variant="default"
				>
					<Plus className="mr-2 size-4" />
					<span className="hidden sm:inline">New Message</span>
					<span className="sm:hidden">New</span>
				</Button>
			);
	}

	return <div className="flex items-center gap-1">{buttonContent}</div>;
}
