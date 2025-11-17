import { CheckCircle2, Download, Home, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
// import { getSupabaseClient } from "@/lib/db";

/**
 * Contract Signing Success Page - Server Component
 *
 * Confirmation page shown after successful contract signing.
 * Provides options to download the signed contract and return home.
 */

export default async function ContractSignSuccessPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	// Await params in Next.js 16+
	const { id } = await params;

	// TODO: Fetch contract details to show in confirmation
	// const supabase = await getSupabaseClient();
	// const { data: contract, error } = await supabase
	//   .from("contracts")
	//   .select("*")
	//   .eq("id", id)
	//   .single();

	return (
		<div className="from-background to-muted/20 min-h-screen bg-gradient-to-b">
			<div className="mx-auto max-w-2xl px-4 py-16">
				{/* Success Message */}
				<Card className="border-success bg-success/50 dark:border-success/50 dark:bg-success/20">
					<CardContent className="flex flex-col items-center py-12">
						<div className="bg-success dark:bg-success/30 rounded-full p-6">
							<CheckCircle2 className="text-success dark:text-success size-16" />
						</div>
						<h1 className="text-success dark:text-success mt-6 text-3xl font-bold">
							Contract Signed Successfully!
						</h1>
						<p className="text-success dark:text-success mt-3 text-center text-lg">
							Thank you for signing the contract. You will receive a confirmation email shortly.
						</p>
					</CardContent>
				</Card>

				{/* Next Steps */}
				<Card className="mt-6">
					<CardHeader>
						<CardTitle>What's Next?</CardTitle>
						<CardDescription>Here are some things you can do now</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<Button asChild className="w-full" size="lg" variant="outline">
							<Link href={`/contracts/download/${id}`}>
								<Download className="mr-2 size-5" />
								Download Signed Contract
							</Link>
						</Button>
						<Button asChild className="w-full" size="lg" variant="outline">
							<Link href="/">
								<Home className="mr-2 size-5" />
								Return to Homepage
							</Link>
						</Button>
					</CardContent>
				</Card>

				{/* Email Notification */}
				<Card className="mt-6">
					<CardContent className="flex items-start gap-4 py-6">
						<div className="bg-primary dark:bg-primary/30 rounded-lg p-3">
							<Mail className="text-primary dark:text-primary size-6" />
						</div>
						<div className="flex-1">
							<h3 className="font-semibold">Email Confirmation Sent</h3>
							<p className="text-muted-foreground text-sm">
								A copy of the signed contract has been sent to your email address. Please check your
								inbox (and spam folder) for the confirmation.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Legal Notice */}
				<div className="mt-8 text-center">
					<p className="text-muted-foreground text-xs">
						This electronically signed document is legally binding. A copy has been recorded with a
						timestamp and your IP address for verification purposes. If you have any questions,
						please contact the service provider.
					</p>
				</div>
			</div>
		</div>
	);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	return generateSEOMetadata({
		title: "Contract Signed",
		section: "Customer Portal",
		description: "Confirmation page for your successfully signed Thorbis service agreement.",
		path: `/contracts/sign/${id}/success`,
		imageAlt: "Thorbis contract signing confirmation",
		keywords: ["contract signed", "thorbis confirmation"],
		noindex: true,
		nofollow: true,
	});
}
