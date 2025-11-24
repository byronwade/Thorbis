"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText, Loader2, Printer } from "lucide-react";
import { exportReportToCSV } from "@/actions/reports-export";
import { toast } from "sonner";

type ReportType = "revenue" | "jobs" | "financial" | "team" | "customers";

interface ExportButtonProps {
	reportType: ReportType;
	days?: number;
}

const reportTitles: Record<ReportType, string> = {
	revenue: "Revenue Report",
	jobs: "Jobs Performance Report",
	financial: "Financial Report",
	team: "Team Leaderboard Report",
	customers: "Customer Analytics Report",
};

export function ExportButton({ reportType, days = 90 }: ExportButtonProps) {
	const [isExporting, setIsExporting] = useState(false);

	const handleExportCSV = async () => {
		setIsExporting(true);
		try {
			const result = await exportReportToCSV(reportType, days);

			if (!result.success || !result.data) {
				toast.error(result.error || "Failed to export report");
				return;
			}

			// Create download link
			const blob = new Blob([result.data], { type: "text/csv;charset=utf-8;" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = result.filename || `${reportType}-report.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			toast.success("Report exported successfully");
		} catch (error) {
			console.error("Export error:", error);
			toast.error("Failed to export report");
		} finally {
			setIsExporting(false);
		}
	};

	const handlePrintPDF = () => {
		// Create a print-friendly version of the current page
		const title = reportTitles[reportType];
		const date = new Date().toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

		// Store original title
		const originalTitle = document.title;

		// Set print title
		document.title = `${title} - ${date}`;

		// Trigger print dialog (user can save as PDF)
		window.print();

		// Restore original title
		document.title = originalTitle;

		toast.success("Print dialog opened - select 'Save as PDF' to export");
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" disabled={isExporting}>
					{isExporting ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<Download className="mr-2 h-4 w-4" />
					)}
					Export
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={handleExportCSV} disabled={isExporting}>
					<FileSpreadsheet className="mr-2 h-4 w-4" />
					Export as CSV
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handlePrintPDF}>
					<FileText className="mr-2 h-4 w-4" />
					Export as PDF
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handlePrintPDF}>
					<Printer className="mr-2 h-4 w-4" />
					Print Report
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
