/**
 * Phone Numbers Toolbar
 *
 * Action bar for phone number management with:
 * - Search & purchase new numbers
 * - Port existing numbers
 * - Filter and sort options
 * - Bulk actions
 */

"use client";

import { Clock, Filter, Phone, Search, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumberPortingWizard } from "./number-porting-wizard";
import { PhoneNumberSearchModal } from "./phone-number-search-modal";

type PhoneNumbersToolbarProps = {
	companyId: string;
};

export function PhoneNumbersToolbar({ companyId }: PhoneNumbersToolbarProps) {
	const [searchOpen, setSearchOpen] = useState(false);
	const [portingOpen, setPortingOpen] = useState(false);
	const [filterStatus, setFilterStatus] = useState<string>("all");

	return (
		<>
			<div className="border-b bg-background px-6 py-4">
				<div className="flex items-center justify-between gap-4">
					{/* Left: Search and Filters */}
					<div className="flex flex-1 items-center gap-3">
						<div className="relative w-full max-w-sm">
							<Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
							<Input className="pl-9" placeholder="Search phone numbers..." />
						</div>

						<Select onValueChange={setFilterStatus} value={filterStatus}>
							<SelectTrigger className="w-[180px]">
								<Filter className="mr-2 size-4" />
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Numbers</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="pending">Pending Setup</SelectItem>
								<SelectItem value="porting">Porting</SelectItem>
								<SelectItem value="suspended">Suspended</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Right: Primary Actions */}
					<div className="flex items-center gap-2">
						<Button asChild size="sm" variant="ghost">
							<Link href="/dashboard/settings/communications/porting-status">
								<Clock className="mr-2 size-4" />
								Porting Status
							</Link>
						</Button>

						<Button onClick={() => setPortingOpen(true)} variant="outline">
							<Upload className="mr-2 size-4" />
							Port Number
						</Button>

						<Button onClick={() => setSearchOpen(true)}>
							<Phone className="mr-2 size-4" />
							Purchase Number
						</Button>
					</div>
				</div>

				{/* Info Bar */}
				<div className="mt-3 flex items-center gap-6 text-muted-foreground text-sm">
					<div>
						<span className="font-medium text-foreground">3</span> active numbers
					</div>
					<div className="h-4 w-px bg-border" />
					<div>
						<span className="font-medium text-foreground">$3.00</span>/month total cost
					</div>
					<div className="h-4 w-px bg-border" />
					<div>
						<span className="font-medium text-foreground">1,247</span> minutes this month
					</div>
					<div className="h-4 w-px bg-border" />
					<div>
						<span className="font-medium text-foreground">423</span> SMS sent
					</div>
				</div>
			</div>

			{/* Modals */}
			<PhoneNumberSearchModal companyId={companyId} onOpenChange={setSearchOpen} open={searchOpen} />

			<NumberPortingWizard onOpenChange={setPortingOpen} open={portingOpen} />
		</>
	);
}
