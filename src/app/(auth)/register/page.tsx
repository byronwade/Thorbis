import { redirect } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { RegisterForm } from "@/components/features/auth/register-form";
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

	// In development, show the register form
	return (
		<div className="bg-background relative flex min-h-screen flex-col overflow-hidden md:items-center md:justify-center">
			{/* Subtle Background Gradient */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="from-primary/5 via-background to-background absolute inset-0 bg-gradient-to-br" />
				<div className="bg-primary/10 pointer-events-none absolute top-0 left-1/4 size-[600px] animate-pulse rounded-full opacity-40 blur-3xl" />
				<div className="bg-primary/10 pointer-events-none absolute right-1/4 bottom-0 size-[600px] animate-pulse rounded-full opacity-40 blur-3xl delay-1000" />
			</div>

			{/* Back Button */}
			<div className="absolute top-6 left-6">
				<Link
					className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
					href="/"
				>
					<ArrowLeft className="h-4 w-4" />
					<span className="text-sm">Back to Home</span>
				</Link>
			</div>

			{/* Form */}
			<div className="w-full px-4 py-12 sm:px-6 md:w-auto md:max-w-2xl lg:px-8">
				<Suspense
					fallback={
						<div className="flex min-h-[400px] items-center justify-center">
							<Loader2 className="text-primary size-8 animate-spin" />
						</div>
					}
				>
					<RegisterForm />
				</Suspense>
			</div>
		</div>
	);
}
