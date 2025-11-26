"use client";

/**
 * Companies Table
 *
 * Displays all customer companies with stats and view-as action.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Search, DollarSign, Users, Briefcase, FileText } from "lucide-react";
import { requestCompanyAccess } from "@/actions/companies";
import { toast } from "sonner";
import type { CompanyStats } from "@/actions/companies";

interface CompaniesTableProps {
	companies: CompanyStats[];
}

export function CompaniesTable({ companies }: CompaniesTableProps) {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [isRequesting, setIsRequesting] = useState<string | null>(null);

	const filteredCompanies = companies.filter((company) => {
		const query = searchQuery.toLowerCase();
		return company.name.toLowerCase().includes(query) || company.email?.toLowerCase().includes(query) || company.id.toLowerCase().includes(query);
	});

	const handleViewAs = async (companyId: string, companyName: string) => {
		setIsRequesting(companyId);
		try {
			const result = await requestCompanyAccess(companyId, undefined, `Admin viewing ${companyName} for support`);

			if (result.error) {
				toast.error("Failed to request access", {
					description: result.error,
				});
				setIsRequesting(null);
				return;
			}

			if (result.success && result.sessionId) {
				toast.success("Access request sent", {
					description: result.message || "Waiting for customer approval...",
				});
				// Redirect to pending session page
				router.push(`/admin/dashboard/view-as/pending/${result.sessionId}`);
			}
		} catch (error) {
			toast.error("Failed to request access");
			setIsRequesting(null);
		}
	};

	const formatCurrency = (cents: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(cents / 100);
	};

	const getStatusBadge = (status: string) => {
		const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
			active: "default",
			suspended: "destructive",
			trial: "secondary",
		};

		return (
			<Badge variant={variants[status] || "outline"} className="capitalize">
				{status}
			</Badge>
		);
	};

	return (
		<div className="space-y-4">
			{/* Search */}
			<div className="flex items-center gap-2">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input placeholder="Search by name, email, or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
				</div>
				<div className="text-sm text-muted-foreground">
					Showing {filteredCompanies.length} of {companies.length} companies
				</div>
			</div>

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Company</TableHead>
							<TableHead>Plan</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">
								<Users className="h-4 w-4 inline mr-1" />
								Users
							</TableHead>
							<TableHead className="text-right">
								<Briefcase className="h-4 w-4 inline mr-1" />
								Jobs
							</TableHead>
							<TableHead className="text-right">
								<FileText className="h-4 w-4 inline mr-1" />
								Invoices
							</TableHead>
							<TableHead className="text-right">
								<DollarSign className="h-4 w-4 inline mr-1" />
								Revenue
							</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredCompanies.length === 0 ? (
							<TableRow>
								<TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
									No companies found
								</TableCell>
							</TableRow>
						) : (
							filteredCompanies.map((company) => (
								<TableRow key={company.id}>
									<TableCell>
										<div>
											<div className="font-medium">{company.name}</div>
											<div className="text-sm text-muted-foreground">{company.email}</div>
										</div>
									</TableCell>
									<TableCell>
										<Badge variant="outline" className="capitalize">
											{company.plan}
										</Badge>
									</TableCell>
									<TableCell>{getStatusBadge(company.status)}</TableCell>
									<TableCell className="text-right">{company.users_count}</TableCell>
									<TableCell className="text-right">{company.jobs_count}</TableCell>
									<TableCell className="text-right">{company.invoices_count}</TableCell>
									<TableCell className="text-right font-mono">{formatCurrency(company.total_revenue)}</TableCell>
									<TableCell className="text-right">
										<Button size="sm" onClick={() => handleViewAs(company.id, company.name)} disabled={isRequesting === company.id}>
											<Eye className="h-4 w-4 mr-1" />
											{isRequesting === company.id ? "Requesting..." : "View As"}
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
