import { CheckCircle2, Download, Home, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-2xl px-4 py-16">
        {/* Success Message */}
        <Card className="border-success bg-success/50 dark:border-success/50 dark:bg-success/20">
          <CardContent className="flex flex-col items-center py-12">
            <div className="rounded-full bg-success p-6 dark:bg-success/30">
              <CheckCircle2 className="size-16 text-success dark:text-success" />
            </div>
            <h1 className="mt-6 font-bold text-3xl text-success dark:text-success">
              Contract Signed Successfully!
            </h1>
            <p className="mt-3 text-center text-lg text-success dark:text-success">
              Thank you for signing the contract. You will receive a
              confirmation email shortly.
            </p>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Here are some things you can do now
            </CardDescription>
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
            <div className="rounded-lg bg-primary p-3 dark:bg-primary/30">
              <Mail className="size-6 text-primary dark:text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Email Confirmation Sent</h3>
              <p className="text-muted-foreground text-sm">
                A copy of the signed contract has been sent to your email
                address. Please check your inbox (and spam folder) for the
                confirmation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Legal Notice */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-xs">
            This electronically signed document is legally binding. A copy has
            been recorded with a timestamp and your IP address for verification
            purposes. If you have any questions, please contact the service
            provider.
          </p>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return generateSEOMetadata({
    title: "Contract Signed",
    section: "Customer Portal",
    description:
      "Confirmation page for your successfully signed Thorbis service agreement.",
    path: `/contracts/sign/${id}/success`,
    imageAlt: "Thorbis contract signing confirmation",
    keywords: ["contract signed", "thorbis confirmation"],
    noindex: true,
    nofollow: true,
  });
}
