"use client";

/**
 * Customer Info Widget Client Wrapper
 *
 * Adds interactive "Change Customer" functionality
 */

import {
	Building2,
	ExternalLink,
	Mail,
	Phone,
	RefreshCw,
	User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Customer data structure for this widget
export type CustomerData = {
	id: string;
	name: string;
	email: string;
	phone: string | null;
	company?: string | null;
	address?: string;
	city?: string;
	state?: string;
	zipCode?: string;
};

type CustomerInfoWidgetClientProps = {
	customer: CustomerData;
	jobId: string;
	onCustomerChange?: (customerId: string) => Promise<void>;
};

// Mock customer search - replace with real API
const mockCustomers: CustomerData[] = [
	{
		id: "customer-1",
		name: "John Smith",
		email: "john.smith@mainstreetoffice.com",
		phone: "(555) 123-4567",
		company: "Main Street Office Building LLC",
		address: "123 Main Street",
		city: "San Francisco",
		state: "CA",
		zipCode: "94102",
	},
	{
		id: "customer-2",
		name: "Jane Doe",
		email: "jane.doe@example.com",
		phone: "(555) 987-6543",
		company: "Acme Corporation",
		address: "456 Market Street",
		city: "San Francisco",
		state: "CA",
		zipCode: "94103",
	},
	{
		id: "customer-3",
		name: "Bob Johnson",
		email: "bob@hvacpro.com",
		phone: "(555) 555-1234",
		company: null,
		address: "789 Oak Avenue",
		city: "Oakland",
		state: "CA",
		zipCode: "94601",
	},
];

export function CustomerInfoWidgetClient({
	customer,
	jobId,
	onCustomerChange,
}: CustomerInfoWidgetClientProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [isChanging, setIsChanging] = useState(false);

	const filteredCustomers = mockCustomers.filter(
		(c) =>
			c.id !== customer.id &&
			(c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
				c.company?.toLowerCase().includes(searchQuery.toLowerCase())),
	);

	async function handleCustomerChange(customerId: string) {
		setIsChanging(true);
		try {
			if (onCustomerChange) {
				await onCustomerChange(customerId);
			}
			setIsDialogOpen(false);
		} catch (_error) {
		} finally {
			setIsChanging(false);
		}
	}

	return (
		<div className="space-y-3">
			<div className="flex items-start gap-2">
				<User className="text-muted-foreground mt-0.5 size-4" />
				<div className="flex-1">
					<div className="text-muted-foreground text-xs">Name</div>
					<div className="text-sm font-medium">{customer.name}</div>
				</div>
			</div>

			{customer.company ? (
				<div className="flex items-start gap-2">
					<Building2 className="text-muted-foreground mt-0.5 size-4" />
					<div className="flex-1">
						<div className="text-muted-foreground text-xs">Company</div>
						<div className="text-sm font-medium">{customer.company}</div>
					</div>
				</div>
			) : null}

			<Separator />

			<div className="flex items-start gap-2">
				<Mail className="text-muted-foreground mt-0.5 size-4" />
				<div className="flex-1">
					<div className="text-muted-foreground text-xs">Email</div>
					<Link
						className="text-sm hover:underline"
						href={`mailto:${customer.email}`}
					>
						{customer.email}
					</Link>
				</div>
			</div>

			{customer.phone ? (
				<>
					<div className="flex items-start gap-2">
						<Phone className="text-muted-foreground mt-0.5 size-4" />
						<div className="flex-1">
							<div className="text-muted-foreground text-xs">Phone</div>
							<Link
								className="text-sm hover:underline"
								href={`tel:${customer.phone}`}
							>
								{customer.phone}
							</Link>
						</div>
					</div>
					<Separator />
				</>
			) : null}

			{customer.address ? (
				<div>
					<div className="text-muted-foreground mb-1 text-xs">Address</div>
					<div className="text-sm">
						{customer.address}
						{customer.city && customer.state && customer.zipCode ? (
							<>
								<br />
								{customer.city}, {customer.state} {customer.zipCode}
							</>
						) : null}
					</div>
				</div>
			) : null}

			<div className="flex gap-2">
				<Button asChild className="flex-1" size="sm" variant="outline">
					<Link href={`/dashboard/customers/${customer.id}`}>
						<ExternalLink className="mr-2 size-3" />
						View Profile
					</Link>
				</Button>

				<Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
					<DialogTrigger asChild>
						<Button className="flex-1" size="sm" variant="outline">
							<RefreshCw className="mr-2 size-3" />
							Change
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>Change Customer</DialogTitle>
							<DialogDescription>
								Search and select a different customer for this job
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-4">
							<div>
								<Label htmlFor="search">Search Customers</Label>
								<Input
									id="search"
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search by name, email, or company..."
									value={searchQuery}
								/>
							</div>

							<ScrollArea className="h-[400px] rounded-md border p-4">
								<div className="space-y-2">
									{filteredCustomers.length === 0 ? (
										<div className="text-muted-foreground py-8 text-center text-sm">
											No customers found
										</div>
									) : (
										filteredCustomers.map((c) => (
											<button
												className="bg-card hover:bg-accent w-full rounded-lg border p-4 text-left transition-colors"
												disabled={isChanging}
												key={c.id}
												onClick={() => handleCustomerChange(c.id)}
												type="button"
											>
												<div className="flex items-start justify-between gap-4">
													<div className="flex-1 space-y-1">
														<div className="flex items-center gap-2">
															<User className="text-muted-foreground size-4" />
															<span className="font-medium">{c.name}</span>
														</div>
														{c.company ? (
															<div className="flex items-center gap-2">
																<Building2 className="text-muted-foreground size-4" />
																<span className="text-muted-foreground text-sm">
																	{c.company}
																</span>
															</div>
														) : null}
														<div className="flex items-center gap-2">
															<Mail className="text-muted-foreground size-4" />
															<span className="text-muted-foreground text-sm">
																{c.email}
															</span>
														</div>
														<div className="flex items-center gap-2">
															<Phone className="text-muted-foreground size-4" />
															<span className="text-muted-foreground text-sm">
																{c.phone}
															</span>
														</div>
													</div>
													<Button disabled={isChanging} size="sm" type="button">
														{isChanging ? "Changing..." : "Select"}
													</Button>
												</div>
											</button>
										))
									)}
								</div>
							</ScrollArea>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
