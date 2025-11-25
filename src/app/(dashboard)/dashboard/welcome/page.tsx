import { redirect } from "next/navigation";

/**
 * Legacy redirect - Welcome page moved to /(onboarding)/welcome
 */
export default function LegacyWelcomePage() {
	redirect("/welcome");
}
