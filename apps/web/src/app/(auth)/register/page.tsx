import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ConvexSignupForm } from "@/components/auth/convex-signup-form";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
	title: "Create Your Thorbis Account",
	section: "Account",
	description:
		"Create your Thorbis account to bring scheduling, dispatch, and communications together for your field service team.",
	path: "/register",
	imageAlt: "Thorbis register form",
	keywords: [
		"thorbis register",
		"field service signup",
		"contractor crm account",
	],
	noindex: true,
	nofollow: true,
});

export default function RegisterPage() {
	// Redirect to waitlist in production
	if (process.env.NODE_ENV === "production") {
		redirect("/waitlist");
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4 py-12">
			<Suspense
				fallback={
					<div className="flex min-h-[400px] items-center justify-center">
						<Loader2 className="text-primary size-8 animate-spin" />
					</div>
				}
			>
				<ConvexSignupForm />
			</Suspense>
		</div>
	);
}
