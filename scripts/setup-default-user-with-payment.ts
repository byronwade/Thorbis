#!/usr/bin/env tsx

/**
 * Setup Default User with Payment
 *
 * This script sets up a default user with:
 * - Completed onboarding
 * - Active team member record
 * - Active Stripe subscription (for development/testing)
 *
 * Usage: pnpm tsx scripts/setup-default-user-with-payment.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { join } from "path";

// Load environment variables
dotenv.config({ path: join(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!(supabaseUrl && supabaseServiceKey)) {
  console.error("❌ Missing required environment variables:");
  console.error("   NEXT_PUBLIC_SUPABASE_URL");
  console.error("   SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupDefaultUserWithPayment() {
  console.log("========================================");
  console.log("🔧 Setting Up Default User with Payment");
  console.log("========================================\n");

  try {
    // Get the first user from auth
    const { data: authUsers, error: authError } =
      await supabase.auth.admin.listUsers();

    if (authError || !authUsers?.users || authUsers.users.length === 0) {
      console.error("❌ No users found in auth. Please create a user first.");
      process.exit(1);
    }

    const user = authUsers.users[0];
    console.log(`✅ Found user: ${user.email} (${user.id})\n`);

    // Ensure user exists in users table
    const { error: userError } = await supabase.from("users").upsert(
      {
        id: user.id,
        name:
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Default User",
        email: user.email,
        email_verified: true,
        is_active: true,
      },
      { onConflict: "id" }
    );

    if (userError) {
      console.error("❌ Error creating user:", userError);
      throw userError;
    }
    console.log("✅ User record created/updated");

    // Check if user already has a company
    const { data: existingMembership } = await supabase
      .from("team_members")
      .select("company_id, companies(*)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    let companyId: string;

    if (existingMembership?.company_id) {
      companyId = existingMembership.company_id;
      console.log(`✅ Using existing company: ${companyId}`);
    } else {
      // Create a default company
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .insert({
          name: "Default Company",
          industry: "hvac",
          company_size: "1-5",
          phone: "+1 (555) 123-4567",
          address: "123 Main St",
          city: "City",
          state: "State",
          zip_code: "12345",
          created_by: user.id,
        })
        .select()
        .single();

      if (companyError) {
        console.error("❌ Error creating company:", companyError);
        throw companyError;
      }

      companyId = company.id;
      console.log(`✅ Created company: ${companyId}`);
    }

    // Ensure team member record exists
    const { error: memberError } = await supabase.from("team_members").upsert(
      {
        company_id: companyId,
        user_id: user.id,
        status: "active",
      },
      { onConflict: "company_id,user_id" }
    );

    if (memberError) {
      console.error("❌ Error creating team member:", memberError);
      throw memberError;
    }
    console.log("✅ Team member record created/updated");

    // Update company with active subscription status (for development)
    // In production, this would come from Stripe webhook
    const { error: subscriptionError } = await supabase
      .from("companies")
      .update({
        stripe_subscription_status: "active",
        subscription_current_period_start: new Date().toISOString(),
        subscription_current_period_end: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // 30 days from now
      })
      .eq("id", companyId);

    if (subscriptionError) {
      console.error("❌ Error updating subscription:", subscriptionError);
      throw subscriptionError;
    }
    console.log("✅ Subscription status set to 'active'");

    // Update profile to mark onboarding as complete
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        onboarding_completed: true,
        active_company_id: companyId,
      },
      { onConflict: "id" }
    );

    if (profileError) {
      console.error("❌ Error updating profile:", profileError);
      // Don't fail if profile doesn't exist
      console.warn("⚠️  Profile update failed (may not exist yet)");
    } else {
      console.log("✅ Profile updated - onboarding marked as complete");
    }

    console.log("\n========================================");
    console.log("🎉 Setup Complete!");
    console.log("========================================");
    console.log(`User: ${user.email}`);
    console.log(`Company: ${companyId}`);
    console.log("Subscription: Active");
    console.log("Onboarding: Complete");
    console.log("========================================\n");
  } catch (error) {
    console.error("\n❌ Setup failed:", error);
    process.exit(1);
  }
}

// Run the script
setupDefaultUserWithPayment();
