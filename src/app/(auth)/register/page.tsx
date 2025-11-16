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
	keywords: ["thorbis register", "field service signup", "contractor crm account"],
	noindex: true,
	nofollow: true,
});

export default function RegisterPage() {
	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden bg-background md:items-center md:justify-center">
			{/* Subtle Background Gradient */}
			<div className="-z-10 absolute inset-0 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
				<div className="pointer-events-none absolute top-0 left-1/4 size-[600px] animate-pulse rounded-full bg-primary/10 opacity-40 blur-3xl" />
				<div className="pointer-events-none absolute right-1/4 bottom-0 size-[600px] animate-pulse rounded-full bg-primary/10 opacity-40 blur-3xl delay-1000" />
			</div>

			{/* Back Button */}
			<div className="absolute top-6 left-6">
				<Link
					className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
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
							<Loader2 className="size-8 animate-spin text-primary" />
						</div>
					}
				>
					<RegisterForm />
				</Suspense>
			</div>
		</div>
	);
}
