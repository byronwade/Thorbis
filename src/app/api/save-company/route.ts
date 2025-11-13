/**
 * Save Company API Route
 *
 * Handles creating and updating companies during onboarding
 * Server-side endpoint with full validation and error handling
 */

import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface SaveCompanyRequest {
  id?: string | null;
  name: string;
  legalName?: string | null;
  doingBusinessAs?: string | null;
  industry: string;
  size: string;
  phone: string;
  supportEmail?: string | null;
  supportPhone?: string | null;
  brandColor?: string | null;
  ein?: string | null;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  website?: string;
  taxId?: string;
  logo?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // Parse and validate request body
    const data: SaveCompanyRequest = await request.json();

    // Validate required fields
    if (!(data.name && data.industry && data.size && data.phone)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!(data.address && data.city && data.state && data.zipCode)) {
      return NextResponse.json(
        { error: "Missing address information" },
        { status: 400 }
      );
    }

    // Format full address
    const fullAddress = `${data.address}, ${data.city}, ${data.state}, ${data.zipCode}`;

    let companyId = data.id;

    if (companyId) {
      // Update existing company
      const updatePayload = {
        name: data.name,
      legal_name: data.legalName || data.name,
      doing_business_as: data.doingBusinessAs || data.name,
        industry: data.industry,
        company_size: data.size,
        phone: data.phone,
      support_email: data.supportEmail || data.email || null,
      support_phone: data.supportPhone || data.phone || null,
      brand_color: data.brandColor || null,
      ein: data.ein || null,
        address: fullAddress,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        website: data.website || null,
        tax_id: data.taxId || null,
        logo: data.logo || null,
      };

      const { error: updateError } = await supabase
        .from("companies")
        .update(updatePayload)
        .eq("id", companyId)
        .eq("owner_id", user.id); // Security: Only allow owners to update

      if (updateError) {
        console.error("Error updating company:", updateError);
        return NextResponse.json(
          { error: `Failed to update company: ${updateError.message}` },
          { status: 500 }
        );
      }

      // Update onboarding progress to mark step 1 as completed
      const { data: existingCompany } = await supabase
        .from("companies")
        .select("onboarding_progress")
        .eq("id", companyId)
        .single();

      const currentProgress =
        (existingCompany?.onboarding_progress as Record<string, any>) || {};

      await supabase
        .from("companies")
        .update({
          onboarding_progress: {
            ...currentProgress,
            currentStep: Math.max(currentProgress.currentStep || 1, 1),
            step1: {
              completed: true,
              completedAt: new Date().toISOString(),
              data: {
                name: data.name,
                legalName: data.legalName,
                doingBusinessAs: data.doingBusinessAs,
                industry: data.industry,
                size: data.size,
                phone: data.phone,
                supportEmail: data.supportEmail,
                supportPhone: data.supportPhone,
                brandColor: data.brandColor,
                ein: data.ein,
                address: data.address,
                city: data.city,
                state: data.state,
                zipCode: data.zipCode,
                website: data.website,
                taxId: data.taxId,
              },
            },
          },
        })
        .eq("id", companyId);
    } else {
      // Create new company
      const baseSlug =
        data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || `company-${Date.now()}`;

      // Generate unique slug
      let slug = baseSlug;
      let slugExists = true;
      let counter = 1;

      while (slugExists) {
        const { data: existingCompany } = await supabase
          .from("companies")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();

        if (existingCompany) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        } else {
          slugExists = false;
        }
      }

      // Create company with initial onboarding progress
      const { data: newCompany, error: companyError } = await supabase
        .from("companies")
        .insert({
          name: data.name,
          slug,
          legal_name: data.legalName || data.name,
          doing_business_as: data.doingBusinessAs || data.name,
          support_email: data.supportEmail || data.email || null,
          support_phone: data.supportPhone || data.phone || null,
          brand_color: data.brandColor || null,
          ein: data.ein || null,
          industry: data.industry,
          company_size: data.size,
          phone: data.phone,
          address: fullAddress,
          city: data.city,
          state: data.state,
          zip_code: data.zipCode,
          website: data.website || null,
          tax_id: data.taxId || null,
          logo: data.logo || null,
          created_by: user.id,
          owner_id: user.id,
          stripe_subscription_status: "incomplete",
          onboarding_progress: {
            currentStep: 1,
            step1: {
              completed: true,
              completedAt: new Date().toISOString(),
              data: {
                name: data.name,
                legalName: data.legalName,
                doingBusinessAs: data.doingBusinessAs,
                industry: data.industry,
                size: data.size,
                phone: data.phone,
                supportEmail: data.supportEmail,
                supportPhone: data.supportPhone,
                brandColor: data.brandColor,
                ein: data.ein,
                address: data.address,
                city: data.city,
                state: data.state,
                zipCode: data.zipCode,
                website: data.website,
                taxId: data.taxId,
              },
            },
          },
        })
        .select("id")
        .single();

      if (companyError || !newCompany) {
        console.error("Error creating company:", companyError);
        return NextResponse.json(
          {
            error: `Failed to create company: ${
              companyError?.message || "Unknown error"
            }`,
          },
          { status: 500 }
        );
      }

      companyId = newCompany.id;

      // Get Owner role ID
      const { data: ownerRole } = await supabase
        .from("custom_roles")
        .select("id")
        .eq("name", "Owner")
        .maybeSingle();

      const roleId = ownerRole?.id || null;

      // Add user as team member with Owner role
      const { error: teamError } = await supabase.from("team_members").insert({
        company_id: companyId,
        user_id: user.id,
        role_id: roleId,
        status: "active",
      });

      if (teamError) {
        console.error("Error adding team member:", teamError);
        // Don't fail company creation if team member addition fails
        // User can be added manually later
      }

      // Create default company settings
      const defaultHours = {
        monday: { open: "09:00", close: "17:00" },
        tuesday: { open: "09:00", close: "17:00" },
        wednesday: { open: "09:00", close: "17:00" },
        thursday: { open: "09:00", close: "17:00" },
        friday: { open: "09:00", close: "17:00" },
        saturday: { open: null, close: null },
        sunday: { open: null, close: null },
      };

      const { error: settingsError } = await supabase
        .from("company_settings")
        .insert({
          company_id: companyId,
          hours_of_operation: defaultHours,
          address: data.address,
          address2: null,
          city: data.city,
          state: data.state,
          zip_code: data.zipCode,
          country: "USA",
        });

      if (settingsError) {
        console.error("Error creating company settings:", settingsError);
        // Don't fail company creation if settings creation fails
      }
    }

    return NextResponse.json({
      success: true,
      companyId,
    });
  } catch (error) {
    console.error("Error in save-company API:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
