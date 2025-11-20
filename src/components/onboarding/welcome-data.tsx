import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type WelcomeDataProps = {
	isCreatingNewCompany?: boolean;
};

export function WelcomeData({ isCreatingNewCompany }: WelcomeDataProps) {
	return (
		<div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
			<Card>
				<CardHeader>
					<CardTitle>Welcome to Thorbis</CardTitle>
					<CardDescription>
						Get started by setting up your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-sm">
						Welcome page content is loading...
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
