"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { updateCompany } from "@/actions/companies";
import { toast } from "sonner";

type CompanyEditFormProps = {
	company: any;
};

/**
 * Company Edit Form
 * 
 * Form for editing company information.
 */
export function CompanyEditForm({ company }: CompanyEditFormProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: company.name || "",
		owner_email: company.owner_email || "",
		owner_phone: company.owner_phone || "",
		status: company.status || "active",
		subscription_tier: company.subscription_tier || "free",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const result = await updateCompany(company.id, formData);
			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Company updated successfully");
				router.push(`/dashboard/work/companies/${company.id}`);
			}
		} catch (error) {
			toast.error("Failed to update company");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<div className="flex items-center gap-3">
					<div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
						<Building2 className="text-muted-foreground h-6 w-6" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">Edit Company</h1>
						<p className="text-muted-foreground text-sm">{company.name}</p>
					</div>
				</div>
			</div>

			<form onSubmit={handleSubmit}>
				<Card>
					<CardHeader>
						<CardTitle>Company Information</CardTitle>
						<CardDescription>Update company details</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Company Name</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="owner_email">Owner Email</Label>
							<Input
								id="owner_email"
								type="email"
								value={formData.owner_email}
								onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="owner_phone">Owner Phone</Label>
							<Input
								id="owner_phone"
								type="tel"
								value={formData.owner_phone}
								onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="status">Status</Label>
							<Select
								value={formData.status}
								onValueChange={(value) => setFormData({ ...formData, status: value })}
							>
								<SelectTrigger id="status">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="suspended">Suspended</SelectItem>
									<SelectItem value="cancelled">Cancelled</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="subscription_tier">Subscription Tier</Label>
							<Select
								value={formData.subscription_tier}
								onValueChange={(value) => setFormData({ ...formData, subscription_tier: value })}
							>
								<SelectTrigger id="subscription_tier">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="free">Free</SelectItem>
									<SelectItem value="starter">Starter</SelectItem>
									<SelectItem value="professional">Professional</SelectItem>
									<SelectItem value="enterprise">Enterprise</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex justify-end gap-2 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => router.back()}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								<Save className="mr-2 h-4 w-4" />
								Save Changes
							</Button>
						</div>
					</CardContent>
				</Card>
			</form>
		</div>
	);
}



