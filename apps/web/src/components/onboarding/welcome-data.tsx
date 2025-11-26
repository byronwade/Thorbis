import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingWizard } from "./onboarding-wizard";

type WelcomeDataProps = {
	isCreatingNewCompany?: boolean;
};

export async function WelcomeData({ isCreatingNewCompany }: WelcomeDataProps) {
	const supabase = await createClient();

	// Check if user is authenticated
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	// Check if user already has a company set up
	const { data: membership } = await supabase
		.from("company_memberships")
		.select("company_id, companies(onboarding_completed_at)")
		.eq("user_id", user.id)
		.single();

	// If they have a company and onboarding is complete, redirect to dashboard
	if (membership?.companies?.onboarding_completed_at && !isCreatingNewCompany) {
		redirect("/dashboard");
	}

	// Show onboarding wizard
	return <OnboardingWizard />;
}
