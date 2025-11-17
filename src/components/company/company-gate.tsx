import { Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CompanyGateProps = {
	context?: string;
	hasCompanies?: boolean;
};

export function CompanyGate({ context = "this page", hasCompanies = false }: CompanyGateProps) {
	const description = hasCompanies
		? `Choose an active workspace from the switcher so we know which ${context} data to load.`
		: `You’re not part of any workspace yet. Ask an admin to invite you or create one to unlock ${context}.`;

	return (
		<div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
			<Card className="max-w-xl shadow-lg">
				<CardHeader className="flex items-start gap-3">
					<div className="bg-muted rounded-lg p-3">
						<Building2 className="text-muted-foreground size-6" />
					</div>
					<div>
						<CardTitle>Connect a workspace to continue</CardTitle>
						<CardDescription>{description}</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="flex flex-wrap gap-3">
					<Button asChild>
						<Link href="/dashboard/settings">Open settings</Link>
					</Button>
					<Button asChild variant="outline">
						<Link href="/dashboard">Back to dashboard</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
