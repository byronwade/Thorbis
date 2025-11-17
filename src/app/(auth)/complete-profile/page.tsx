import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CompleteProfileForm } from "@/components/features/auth/complete-profile-form";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";

export const metadata = generateSEOMetadata({
	title: "Complete Your Profile",
	section: "Account",
	description: "Complete your profile to get started with Thorbis.",
	path: "/complete-profile",
	noindex: true,
	nofollow: true,
});

export default async function CompleteProfilePage() {
	// Check if user is authenticated
	const supabase = await createClient();
	if (!supabase) {
		redirect("/login");
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	// Get user profile to check what's missing
	const { data: profile } = await supabase
		.from("users")
		.select("phone, name, avatar")
		.eq("id", user.id)
		.single();

	// If profile is complete, redirect to dashboard
	if (profile?.phone && profile?.name) {
		redirect("/dashboard/welcome");
	}

	// Get OAuth avatar from user metadata if available
	const oauthAvatar =
		user.user_metadata?.avatar_url || user.user_metadata?.picture || profile?.avatar || null;

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
					href="/login"
				>
					<ArrowLeft className="h-4 w-4" />
					<span className="text-sm">Back to Login</span>
				</Link>
			</div>

			{/* Centered Content */}
			<div className="w-full px-4 py-12 sm:px-6 md:w-auto md:max-w-lg lg:px-8">
				<Suspense
					fallback={
						<div className="flex min-h-[400px] items-center justify-center">
							<Loader2 className="text-primary size-8 animate-spin" />
						</div>
					}
				>
					<CompleteProfileForm
						existingAvatar={oauthAvatar}
						existingName={profile?.name || user.user_metadata?.name || ""}
						existingPhone={profile?.phone || ""}
						userEmail={user.email || ""}
					/>
				</Suspense>
			</div>
		</div>
	);
}
