import { redirect } from "next/navigation";

/**
 * Legacy Welcome Page - Redirects to /dashboard/welcome
 *
 * The welcome/onboarding page has been moved to /dashboard/welcome
 */
export default function LegacyWelcomePage() {
	redirect("/dashboard/welcome");
}
