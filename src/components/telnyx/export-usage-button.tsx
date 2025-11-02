"use client";

/**
 * Export Usage Button - Client Component
 *
 * Client-side features:
 * - CSV export functionality
 * - Loading state during export
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function ExportUsageButton({ companyId, startDate, endDate }: { companyId: string; startDate: string; endDate: string }) {
	const [isExporting, setIsExporting] = useState(false);
	const { toast } = useToast();

	const handleExport = async () => {
		setIsExporting(true);
		try {
			const supabase = createClient();
			if (!supabase) {
				toast.error("Unable to connect to the database. Service unavailable.");
				return;
			}

			// Fetch all usage data
			const { data: communications } = await supabase.from("communications").select("*").eq("company_id", companyId).gte("created_at", startDate).lte("created_at", endDate).order("created_at", { ascending: false });

			const { data: voicemails } = await supabase.from("voicemails").select("*").eq("company_id", companyId).gte("received_at", startDate).lte("received_at", endDate).order("received_at", { ascending: false });

			if (!communications && !voicemails) {
				toast.error("No usage data found for the selected period.");
				return;
			}

			// Prepare CSV data
			const csvRows: string[] = [];

			// Header
			csvRows.push("Date,Type,Direction,From,To,Duration (seconds),Cost,Status,Details");

			// Add communications
			communications?.forEach((comm) => {
				const date = new Date(comm.created_at).toLocaleString();
				const type = comm.type === "phone" ? "Call" : "SMS";
				const direction = comm.direction;
				const from = comm.from_phone || "";
				const to = comm.to_phone || "";
				const duration = comm.duration_seconds || 0;

				// Calculate cost
				let cost = 0;
				if (comm.type === "phone" && duration > 0) {
					cost = Math.ceil(duration / 60) * 0.012;
				} else if (comm.type === "sms" && direction === "outbound") {
					cost = 0.0075;
				}

				const status = comm.status || "";
				const details = comm.body?.replace(/,/g, ";") || ""; // Replace commas to avoid CSV issues

				csvRows.push(`"${date}","${type}","${direction}","${from}","${to}",${duration},$${cost.toFixed(4)},"${status}","${details}"`);
			});

			// Add voicemails
			voicemails?.forEach((vm) => {
				const date = new Date(vm.received_at).toLocaleString();
				const from = vm.from_phone || "";
				const to = vm.to_phone || "";
				const duration = vm.duration_seconds || 0;
				const cost = 0.05; // Transcription cost
				const status = vm.is_read ? "Read" : "Unread";
				const details = vm.transcription?.replace(/,/g, ";") || "";

				csvRows.push(`"${date}","Voicemail","inbound","${from}","${to}",${duration},$${cost.toFixed(4)},"${status}","${details}"`);
			});

			// Create CSV content
			const csvContent = csvRows.join("\n");

			// Create blob and download
			const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.setAttribute("href", url);
			link.setAttribute("download", `telnyx-usage-${new Date().toISOString().split("T")[0]}.csv`);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.success(`Exported ${csvRows.length - 1} records to CSV.`);
		} catch (error) {
			console.error("Error exporting usage:", error);
			toast.error("Failed to export usage data. Please try again.");
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<Button onClick={handleExport} disabled={isExporting} variant="outline">
			{isExporting ? (
				<>
					<div className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
					Exporting...
				</>
			) : (
				<>
					<Download className="mr-2 size-4" />
					Export CSV
				</>
			)}
		</Button>
	);
}
