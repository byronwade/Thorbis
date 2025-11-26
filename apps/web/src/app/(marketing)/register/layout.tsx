import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

export const metadata = generateSEOMetadata({
	title: "Create Account",
	section: "Account",
	description:
		"Create your Thorbis account to streamline field service operations with modern scheduling, dispatch, and invoicing tools.",
	path: "/register",
	imageAlt: "Thorbis registration form",
	keywords: ["sign up", "create account", "field service software trial"],
	noindex: true,
	nofollow: true,
});

export default function RegisterLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
