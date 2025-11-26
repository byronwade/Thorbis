import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
	title: "Join the Waitlist - Thorbis",
	section: "Account",
	description:
		"Join the Thorbis waitlist to be among the first to access our field service management platform. Get notified when we launch.",
	path: "/waitlist",
	imageAlt: "Thorbis waitlist signup",
	keywords: [
		"thorbis waitlist",
		"field service software waitlist",
		"join waitlist",
	],
});

export default function WaitlistPage() {
	return (
		<div className="bg-background relative flex min-h-screen flex-col overflow-hidden md:items-center md:justify-center">
			{/* Enhanced Background Gradient */}
			<div className="absolute inset-0 -z-10 overflow-hidden">
				<div className="from-primary/10 via-primary/5 to-background absolute inset-0 bg-gradient-to-br" />
				<div className="bg-primary/20 pointer-events-none absolute top-0 left-1/4 size-[600px] animate-pulse rounded-full opacity-30 blur-3xl" />
				<div className="bg-primary/20 pointer-events-none absolute right-1/4 bottom-0 size-[600px] animate-pulse rounded-full opacity-30 blur-3xl delay-1000" />
			</div>

			{/* Form - Centered with compact spacing */}
			<div className="w-full px-4 py-8 sm:px-6 md:py-12 lg:px-8">
				<Suspense
					fallback={
						<div className="flex min-h-[400px] items-center justify-center">
							<Loader2 className="text-primary size-8 animate-spin" />
						</div>
					}
				>
					<WaitlistForm />
				</Suspense>
			</div>
		</div>
	);
}
