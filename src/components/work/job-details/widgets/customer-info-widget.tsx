/**
 * Customer Info Widget - Server Component
 */

import { Building2, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type CustomerInfoWidgetProps = {
	customer: {
		id: string;
		name: string;
		email: string;
		phone: string;
		company?: string | null;
		address: string;
		city: string;
		state: string;
		zipCode: string;
	};
};

export function CustomerInfoWidget({ customer }: CustomerInfoWidgetProps) {
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

			<div>
				<div className="text-muted-foreground mb-1 text-xs">Address</div>
				<div className="text-sm">
					{customer.address}
					<br />
					{customer.city}, {customer.state} {customer.zipCode}
				</div>
			</div>

			<Separator />

			<Button asChild className="w-full" size="sm" variant="outline">
				<Link href={`/dashboard/customers/${customer.id}`}>View Profile</Link>
			</Button>
		</div>
	);
}
